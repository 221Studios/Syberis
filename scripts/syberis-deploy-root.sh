#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/nikodem/syberis-build"
IMAGE="syberis"
NAME="syberis"
WWW_DIR="/var/www/syberis"
DOCKER="/usr/bin/docker"
# Production containers live on the snap dockerd. Plain /snap/bin/docker may
# talk to the system daemon instead, which cannot manage the live Syberis task.
export DOCKER_HOST="${DOCKER_HOST:-unix:///run/snap.docker/docker.sock}"

force_remove_container() {
  local id="$1"
  local short="${id:0:12}"

  "$DOCKER" stop "$id" >/dev/null 2>&1 || true
  "$DOCKER" kill "$id" >/dev/null 2>&1 || true

  # Snap AppArmor sometimes blocks runc signals ("unable to signal init:
  # permission denied"). Fall back to killing the shim and proxy by hand.
  local shim
  shim="$(ps -eo pid=,args= | awk -v id="$id" '
    $0 ~ /containerd-shim/ && index($0, id) { print $1; exit }
  ' || true)"
  if [[ -n "$shim" ]]; then
    kill -9 "$shim" >/dev/null 2>&1 || true
  fi

  pkill -9 -f "docker-proxy .* -host-port 3000 .*${short}" >/dev/null 2>&1 || true
  systemctl stop "docker-${id}.scope" >/dev/null 2>&1 || true
  systemctl stop "docker-${short}.scope" >/dev/null 2>&1 || true

  "$DOCKER" rm -f "$id" >/dev/null 2>&1 || true
  "$DOCKER" rm -f "$short" >/dev/null 2>&1 || true
}

if [[ ! -f "$APP_DIR/Dockerfile" ]]; then
  echo "Missing $APP_DIR/Dockerfile" >&2
  exit 1
fi

cd "$APP_DIR"
echo "Building $IMAGE from $APP_DIR (DOCKER_HOST=$DOCKER_HOST)..."
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
  echo "Replacing container on port 3000 ($OLD)..."
  force_remove_container "$OLD"
fi

EXISTING="$("$DOCKER" ps -aq --filter "name=^/${NAME}$" || true)"
if [[ -n "$EXISTING" ]]; then
  echo "Removing previous $NAME container..."
  force_remove_container "$EXISTING"
fi

# Clear a stale name even if the ID filter missed it.
"$DOCKER" rm -f "$NAME" >/dev/null 2>&1 || true

echo "Starting $NAME on 127.0.0.1:3000..."
"$DOCKER" run -d \
  --name "$NAME" \
  --restart unless-stopped \
  -p 127.0.0.1:3000:3000 \
  "$IMAGE"

echo "Waiting for health..."
for _ in $(seq 1 60); do
  if curl -sf -o /dev/null http://127.0.0.1:3000/; then
    echo "Syberis is up: https://syberis.pl"
    exit 0
  fi
  sleep 1
done

echo "Container started but HTTP check failed" >&2
"$DOCKER" logs --tail 40 "$NAME" >&2 || true
exit 1
