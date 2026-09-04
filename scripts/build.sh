#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p web/data web/shared
mkdir -p wechat/miniprogram/data wechat/miniprogram/shared

cp data/baijiu.json web/data/baijiu.json
cp shared/recommender.js web/shared/recommender.js
cp shared/recommender.js wechat/miniprogram/shared/recommender.js
node scripts/generate-wechat-data.js

echo "✅ generated Web and WeChat runtime assets"
