#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Development Setup ==="

# Frontend
echo "Setting up frontend..."
cd frontend
cp -n .env.example .env 2>/dev/null || true
npm install
cd ..

# Python
echo "Setting up Python data service..."
cd data-service-python
cp -n .env.example .env 2>/dev/null || true
python3 -m venv .venv 2>/dev/null || true
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python scripts/verify_generator.py
deactivate
cd ..

echo ""
echo "Setup complete. Run services individually:"
echo "  PostgreSQL:  docker compose up postgres -d"
echo "  Backend:     cd backend-springboot && mvn spring-boot:run"
echo "  Data Service: cd data-service-python && source .venv/bin/activate && uvicorn app.main:app --reload"
echo "  Verify:       ./scripts/verify-generator.sh"
echo "  Frontend:    cd frontend && npm run dev"
