#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

python3 scripts/collect.py validate
python3 -m json.tool data/baijiu.json >/dev/null
python3 -m json.tool web/data/baijiu.json >/dev/null
node --check shared/recommender.js
node --check web/shared/recommender.js
node --check wechat/miniprogram/shared/recommender.js
node --check wechat/miniprogram/data/baijiu.js
node --test tests/*.test.js

echo "✅ check passed"
