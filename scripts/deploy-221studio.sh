#!/usr/bin/env bash
# Run on the production host after syncing the repository into APP_DIR.
set -euo pipefail

APP_DIR="/home/nikodem/syberis-build"
DEPLOY_COMMAND="/usr/local/sbin/syberis-deploy"

if [[ ! -f "$APP_DIR/Dockerfile" ]]; then
  echo "Missing $APP_DIR/Dockerfile" >&2
  exit 1
fi

if [[ ! -x "$DEPLOY_COMMAND" ]]; then
  echo "Missing $DEPLOY_COMMAND; run scripts/setup-deploy-host.sh first" >&2
  exit 1
fi

echo "Deploying from $APP_DIR..."
sudo -n "$DEPLOY_COMMAND"
