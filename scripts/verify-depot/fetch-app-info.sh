#!/usr/bin/env bash
set -euo pipefail

# Dump current public-branch app info for a Steam app.
# Usage:
#   ./fetch-app-info.sh <appid> [steam-user]
#
# Anonymous login is used when no user is given. Many AAA titles refuse
# anonymous app_info_print and require an account that owns the game.

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <appid> [steam-user]" >&2
  exit 2
fi

APPID="$1"
USER="${2:-anonymous}"

if ! command -v steamcmd >/dev/null 2>&1; then
  echo "steamcmd not found on PATH" >&2
  echo "see scripts/verify-depot/README.md for install steps" >&2
  exit 127
fi

OUT_DIR="$(dirname "$0")/out"
mkdir -p "$OUT_DIR"
OUT_FILE="$OUT_DIR/app_${APPID}.txt"

steamcmd \
  +@ShutdownOnFailedCommand 1 \
  +@NoPromptForPassword 1 \
  +login "$USER" \
  +app_info_update 1 \
  +app_info_print "$APPID" \
  +quit | tee "$OUT_FILE"

echo
echo "saved to $OUT_FILE"
