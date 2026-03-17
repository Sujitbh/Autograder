#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV_PYTHON="$ROOT_DIR/.venv/bin/python"
BACKEND_LOG="/tmp/autograder-backend.log"
FRONTEND_LOG="/tmp/autograder-frontend.log"

cd "$ROOT_DIR"

echo "[1/6] Stopping existing backend/frontend processes..."
pkill -f "uvicorn app.main:app" >/dev/null 2>&1 || true
pkill -f "next dev" >/dev/null 2>&1 || true
lsof -ti :8000 | xargs kill -9 >/dev/null 2>&1 || true
lsof -ti :3000 | xargs kill -9 >/dev/null 2>&1 || true

echo "[2/6] Clearing frontend lock..."
rm -f "$FRONTEND_DIR/.next/dev/lock"

echo "[3/6] Starting docker services..."
docker-compose up -d

echo "[4/6] Starting backend on :8000..."
if [[ ! -x "$VENV_PYTHON" ]]; then
  echo "ERROR: Python venv not found at $VENV_PYTHON"
  echo "Create it first, then install backend dependencies."
  exit 1
fi

nohup "$VENV_PYTHON" -m uvicorn app.main:app --app-dir "$BACKEND_DIR" --reload --host 0.0.0.0 --port 8000 \
  > "$BACKEND_LOG" 2>&1 &

echo "[5/6] Starting frontend on :3000..."
nohup npm --prefix "$FRONTEND_DIR" run dev > "$FRONTEND_LOG" 2>&1 &

echo "[6/6] Waiting for services..."
sleep 4

echo
if lsof -i :8000 >/dev/null 2>&1; then
  echo "✅ Backend running at http://localhost:8000"
else
  echo "⚠️  Backend may not have started. Check: tail -n 60 $BACKEND_LOG"
fi

if lsof -i :3000 >/dev/null 2>&1; then
  echo "✅ Frontend running at http://localhost:3000"
else
  echo "⚠️  Frontend may not have started. Check: tail -n 60 $FRONTEND_LOG"
fi

echo
printf "Logs:\n  Backend: %s\n  Frontend: %s\n" "$BACKEND_LOG" "$FRONTEND_LOG"
echo "Use: tail -f $BACKEND_LOG"
echo "Use: tail -f $FRONTEND_LOG"
