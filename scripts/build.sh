#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p web/data
cp data/baijiu.json web/data/baijiu.json
echo "✅ copied data/baijiu.json -> web/data/baijiu.json"
