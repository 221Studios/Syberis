#!/usr/bin/env bash
set -euo pipefail

DEPLOY_USER="${1:-nikodem}"
DEPLOY_SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/syberis-deploy-root.sh"
SUDOERS_TEMP="$(mktemp)"
trap 'rm -f "$SUDOERS_TEMP"' EXIT

if [[ ! "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*[$]?$ ]]; then
  echo "Invalid Linux username: $DEPLOY_USER" >&2
  exit 1
fi

if [[ ! -f "$DEPLOY_SCRIPT" ]]; then
  echo "Missing deployment script: $DEPLOY_SCRIPT" >&2
  exit 1
fi

printf '%s ALL=(root) NOPASSWD: /usr/local/sbin/syberis-deploy ""\n' \
  "$DEPLOY_USER" > "$SUDOERS_TEMP"
visudo -cf "$SUDOERS_TEMP"

sudo install -o root -g root -m 0755 "$DEPLOY_SCRIPT" \
  /usr/local/sbin/syberis-deploy
sudo install -o root -g root -m 0440 "$SUDOERS_TEMP" \
  /etc/sudoers.d/syberis-deploy
sudo visudo -cf /etc/sudoers
echo "Installed restricted Syberis deployment command for $DEPLOY_USER."
