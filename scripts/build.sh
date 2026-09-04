#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p web/data web/shared
mkdir -p wechat/miniprogram/data wechat/miniprogram/shared

stage_suffix=".stage-$$"
stage_web_data="web/data/baijiu.json${stage_suffix}"
stage_web_recommender="web/shared/recommender.js${stage_suffix}"
stage_wechat_data="wechat/miniprogram/data/baijiu.js${stage_suffix}"
stage_wechat_recommender="wechat/miniprogram/shared/recommender.js${stage_suffix}"
staged_files=(
  "$stage_web_data"
  "$stage_web_recommender"
  "$stage_wechat_data"
  "$stage_wechat_recommender"
)

cleanup() {
  rm -f -- "${staged_files[@]}"
}
trap cleanup EXIT

node scripts/generate-wechat-data.js data/baijiu.json "$stage_wechat_data"
cp data/baijiu.json "$stage_web_data"
cp shared/recommender.js "$stage_web_recommender"
cp shared/recommender.js "$stage_wechat_recommender"

mv -f "$stage_web_data" web/data/baijiu.json
mv -f "$stage_web_recommender" web/shared/recommender.js
mv -f "$stage_wechat_data" wechat/miniprogram/data/baijiu.js
mv -f "$stage_wechat_recommender" wechat/miniprogram/shared/recommender.js

echo "✅ generated Web and WeChat runtime assets"
