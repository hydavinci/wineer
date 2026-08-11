#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/collect.py validate
python3 -m json.tool data/baijiu.json >/dev/null
node --check web/app.js
if [ ! -f web/data/baijiu.json ]; then
  echo "❌ web/data/baijiu.json 不存在；请运行 scripts/build.sh 或保留 web/data -> ../data" >&2
  exit 1
fi
python3 -m json.tool web/data/baijiu.json >/dev/null
echo "✅ check passed"
