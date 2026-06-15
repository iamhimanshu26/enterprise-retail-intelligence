#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/frontend"

echo "=== Vercel Frontend Deployment ==="
echo ""

if ! command -v vercel &>/dev/null; then
  echo "Vercel CLI not found. Installing via npx..."
  DEPLOY_CMD="npx vercel@latest"
else
  DEPLOY_CMD="vercel"
fi

echo "Building frontend..."
npm ci
npm run build

echo ""
echo "Deploying to Vercel (production)..."
echo "If prompted, confirm root directory: frontend/"
echo ""

$DEPLOY_CMD --prod

echo ""
echo "Deployment complete. Visit the URL shown above."
echo "Demo login: executive@retailcorp.com / Enterprise2026!"
echo "Engineering Architecture: <your-url>/engineering"
