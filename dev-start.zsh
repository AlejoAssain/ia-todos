#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo
  echo "Stopping development servers..."

  jobs -pr | xargs -r kill 2>/dev/null || true
  wait 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Starting backend on http://localhost:3000 ..."
(cd "$ROOT_DIR/backend" && npm run start:dev) &

echo "Starting frontend on http://localhost:5173 ..."
(cd "$ROOT_DIR/frontend" && npm run dev) &

wait
