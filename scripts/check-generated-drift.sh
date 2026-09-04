#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

generated_files=(
  web/data/baijiu.json
  web/shared/recommender.js
  wechat/miniprogram/data/baijiu.js
  wechat/miniprogram/shared/recommender.js
)

if ! git diff --name-only --exit-code -- "${generated_files[@]}"; then
  echo "❌ generated assets drifted after build; run bash scripts/build.sh and commit the updated files." >&2
  exit 1
fi

echo "✅ generated assets are in sync"
