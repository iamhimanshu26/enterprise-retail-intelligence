#!/usr/bin/env bash
cd "$(dirname "$0")/.."
chmod +x scripts/auth-and-deploy.sh
./scripts/auth-and-deploy.sh
read -p "Press Enter to close..."
