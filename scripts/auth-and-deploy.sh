#!/usr/bin/env bash
# Authenticate and deploy Phase 0 — run this in your local terminal (not sandboxed).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${BLUE}==>${NC} $1"; }
ok()   { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }

# ---------------------------------------------------------------------------
# 1. Docker Desktop
# ---------------------------------------------------------------------------
log "Checking Docker..."

if [[ -d "/Applications/Docker.app" ]]; then
  if ! docker info &>/dev/null; then
    log "Starting Docker Desktop..."
    open -a Docker
    echo "Waiting for Docker daemon (up to 120s)..."
    for i in $(seq 1 60); do
      if docker info &>/dev/null; then
        ok "Docker is ready"
        break
      fi
      sleep 2
      if [[ $i -eq 60 ]]; then
        fail "Docker did not start. Open Docker Desktop manually and re-run this script."
      fi
    done
  else
    ok "Docker is already running"
  fi
else
  fail "Docker Desktop not found. Install from https://docker.com/products/docker-desktop"
fi

# ---------------------------------------------------------------------------
# 2. Environment files
# ---------------------------------------------------------------------------
log "Ensuring environment files..."
cp -n .env.example .env 2>/dev/null || true
cp -n frontend/.env.example frontend/.env 2>/dev/null || true
cp -n data-service-python/.env.example data-service-python/.env 2>/dev/null || true
ok "Environment files ready"

# ---------------------------------------------------------------------------
# 3. Docker Compose — all services
# ---------------------------------------------------------------------------
log "Building and starting Docker Compose services..."
docker compose up --build -d

log "Waiting for services to become healthy..."
sleep 15

check_url() {
  local name="$1" url="$2"
  if curl -sf "$url" &>/dev/null; then
    ok "$name — $url"
  else
    echo "  ⚠ $name not ready yet — $url (may still be starting)"
  fi
}

check_url "Backend health"  "http://localhost:8080/api/v1/health"
check_url "Data service"    "http://localhost:8000/api/v1/health"
check_url "Frontend"        "http://localhost:5173"

# ---------------------------------------------------------------------------
# 4. Vercel authentication & deployment
# ---------------------------------------------------------------------------
log "Vercel authentication..."

if [[ -n "${VERCEL_TOKEN:-}" ]]; then
  ok "Using VERCEL_TOKEN from environment"
else
  if ! npx vercel@latest whoami &>/dev/null; then
    log "Opening Vercel login in browser — complete sign-in, then return here..."
    npx vercel@latest login
  fi
  ok "Vercel authenticated as: $(npx vercel@latest whoami 2>/dev/null || echo 'unknown')"
fi

log "Building frontend..."
cd "$ROOT_DIR/frontend"
npm ci
npm run build

log "Deploying frontend to Vercel (production)..."
DEPLOY_URL=$(npx vercel@latest --prod --yes 2>&1 | tee /dev/stderr | grep -Eo 'https://[^ ]+' | tail -1)

echo ""
echo "============================================================"
echo "  Phase 0 — Auth & Deploy Complete"
echo "============================================================"
echo ""
echo "  Local Docker:"
echo "    Frontend:     http://localhost:5173"
echo "    Backend:      http://localhost:8080"
echo "    Data Service: http://localhost:8000"
echo "    PostgreSQL:   localhost:5433"
echo ""
if [[ -n "$DEPLOY_URL" ]]; then
  echo "  Vercel Production: $DEPLOY_URL"
  echo "  Engineering Arch:  ${DEPLOY_URL}/engineering"
else
  echo "  Vercel: check output above for deployment URL"
fi
echo ""
echo "  Demo login: executive@retailcorp.com / Enterprise2026!"
echo "============================================================"
