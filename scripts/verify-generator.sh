#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/data-service-python"

echo "=== Verifying Python data service & synthetic generator ==="

if [[ ! -d .venv ]]; then
  echo "Creating virtual environment (.venv)..."
  python3 -m venv .venv
fi

# shellcheck source=/dev/null
source .venv/bin/activate

echo "Installing pinned requirements..."
python -m pip install --upgrade pip
pip install -r requirements.txt

python scripts/verify_generator.py
