#!/usr/bin/env bash
# Rebuild and restart Syberis Docker on 221studio (needs sudo once).
#
# IMPORTANT: snap Docker cannot read /var/www — build context MUST live under $HOME.
set -euo pipefail

# Under `sudo`, $HOME becomes /root — prefer the invoking user home.
OWNER_HOME="$(getent passwd "${SUDO_USER:-$USER}" | cut -d: -f6)"
OWNER_HOME="${OWNER_HOME:-/home/nikodem}"
APP_DIR="${APP_DIR:-$OWNER_HOME/syberis-build}"
IMAGE="${IMAGE:-syberis}"
NAME="${NAME:-syberis}"
WWW_DIR="${WWW_DIR:-/var/www/syberis}"

if [[ ! -f "$APP_DIR/Dockerfile" ]]; then
  echo "✗ Missing $APP_DIR/Dockerfile" >&2
  exit 1
fi

cd "$APP_DIR"
echo "→ pwd=$(pwd)"
echo "→ Dockerfile=$(wc -c < Dockerfile) bytes"

echo "→ Building $IMAGE (sudo docker, context=$APP_DIR)…"
sudo docker build -t "$IMAGE" .

# Keep /var/www/syberis in sync as the editable source tree (optional mirror)
if [[ -d "$WWW_DIR" ]]; then
  echo "→ Mirroring build tree → $WWW_DIR…"
  rsync -a --delete \
    --exclude node_modules --exclude .next \
    "$APP_DIR"/ "$WWW_DIR"/
fi

OLD="$(sudo docker ps -q --filter publish=3000 || true)"
if [[ -n "${OLD}" ]]; then
  echo "→ Stopping old container on :3000 ($OLD)…"
  sudo docker stop "$OLD" >/dev/null
  sudo docker rm "$OLD" >/dev/null || true
fi

if sudo docker ps -aq --filter "name=^/${NAME}$" | grep -q .; then
  sudo docker rm -f "$NAME" >/dev/null || true
fi

echo "→ Starting $NAME on 127.0.0.1:3000…"
sudo docker run -d \
  --name "$NAME" \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  "$IMAGE"

echo "→ Waiting for health…"
for i in $(seq 1 60); do
  if curl -sf -o /dev/null http://127.0.0.1:3000/; then
    echo "✓ Syberis is up: https://syberis.221studio.pl"
    exit 0
  fi
  sleep 1
done

echo "✗ Container started but HTTP check failed" >&2
sudo docker logs --tail 40 "$NAME" >&2 || true
exit 1
