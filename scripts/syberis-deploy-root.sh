#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/nikodem/syberis-build"
IMAGE="syberis"
NAME="syberis"
WWW_DIR="/var/www/syberis"
DOCKER="/snap/bin/docker"

if [[ ! -f "$APP_DIR/Dockerfile" ]]; then
  echo "Missing $APP_DIR/Dockerfile" >&2
  exit 1
fi

cd "$APP_DIR"
echo "Building $IMAGE from $APP_DIR..."
"$DOCKER" build -t "$IMAGE" .

if [[ -d "$WWW_DIR" ]]; then
  echo "Mirroring source to $WWW_DIR..."
  rsync -a --delete \
    --exclude .git --exclude .claude --exclude .idea \
    --exclude AGENTS.md --exclude CLAUDE.md --exclude CONTEXT.md \
    --exclude ozziee.jpg --exclude docs/adr --exclude '.env*' \
    --exclude node_modules --exclude .next \
    "$APP_DIR"/ "$WWW_DIR"/
fi

OLD="$("$DOCKER" ps -q --filter publish=3000 || true)"
if [[ -n "$OLD" ]]; then
  "$DOCKER" stop "$OLD" >/dev/null
  "$DOCKER" rm "$OLD" >/dev/null || true
fi

if "$DOCKER" ps -aq --filter "name=^/${NAME}$" | grep -q .; then
  "$DOCKER" rm -f "$NAME" >/dev/null || true
fi

echo "Starting $NAME on 127.0.0.1:3000..."
"$DOCKER" run -d \
  --name "$NAME" \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  "$IMAGE"

echo "Waiting for health..."
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null http://127.0.0.1:3000/; then
    echo "Syberis is up: https://syberis.221studio.pl"
    exit 0
  fi
  sleep 1
done

echo "Container started but HTTP check failed" >&2
"$DOCKER" logs --tail 40 "$NAME" >&2 || true
exit 1
