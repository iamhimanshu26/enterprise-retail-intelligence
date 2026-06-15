#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Enterprise Retail Intelligence Platform ==="
echo "Starting all services with Docker Compose..."
echo ""

docker compose up --build -d

echo ""
echo "Services starting:"
echo "  Frontend:      http://localhost:5173"
echo "  Backend API:   http://localhost:8080"
echo "  Data Service:  http://localhost:8000"
echo "  Swagger UI:    http://localhost:8080/swagger-ui.html"
echo "  PostgreSQL:    localhost:5432"
echo ""
echo "Demo login: executive@retailcorp.com / Enterprise2026!"
