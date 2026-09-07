#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

python3 scripts/collect.py validate

generated_files=(
  web/data/baijiu.json
  web/shared/recommender.js
  wechat/miniprogram/data/baijiu.js
  wechat/miniprogram/shared/recommender.js
)

for generated_file in "${generated_files[@]}"; do
  if [[ ! -f "$generated_file" ]]; then
    echo "❌ missing generated file: $generated_file; run bash scripts/build.sh" >&2
    exit 1
  fi
done

python3 -m json.tool data/baijiu.json >/dev/null
python3 -m json.tool web/data/baijiu.json >/dev/null
node --check shared/recommender.js
node --check web/shared/recommender.js
node --check wechat/miniprogram/shared/recommender.js
node --check wechat/miniprogram/data/baijiu.js
node --check wechat/miniprogram/app.js
node --check wechat/miniprogram/config.js
node --check wechat/miniprogram/utils/age.js
node --check wechat/miniprogram/utils/navigation.js
node --check wechat/miniprogram/utils/result.js
node --check wechat/miniprogram/utils/catalog.js
node --check wechat/miniprogram/utils/purchase.js
node --check wechat/miniprogram/utils/analytics.js
node --check wechat/miniprogram/utils/poster.js
node --check wechat/miniprogram/pages/home/home.js
node --check wechat/miniprogram/pages/quiz/quiz.js
node --check wechat/miniprogram/pages/result/result.js
node --check wechat/miniprogram/pages/catalog/catalog.js
node --check wechat/miniprogram/components/wine-card/wine-card.js
node --test tests/*.test.js

echo "✅ check passed"
