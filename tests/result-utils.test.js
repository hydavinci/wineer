const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { defaultAnswers, recommend } = require("../shared/recommender");
const {
  buildResultView,
  purchaseKeyword,
  shareTitle
} = require("../wechat/miniprogram/utils/result");

const ranked = recommend(data.items, defaultAnswers());

test("builds cards without changing ranking", () => {
  const cards = buildResultView(ranked);

  assert.deepEqual(cards.map(({ id }) => id), [
    "kouzijiao",
    "qinghua20",
    "shuanggou-shengfang"
  ]);
  assert.equal(cards[0].rank, 1);
  assert.match(cards[0].whyText, /预算匹配/);
});

test("builds the approved purchase search keyword", () => {
  assert.equal(purchaseKeyword(ranked[0].item), `${ranked[0].item.name} 京东搜索`);
});

test("uses the top wine in the share title", () => {
  assert.equal(shareTitle(ranked), `Wineer 推荐：${ranked[0].item.name}`);
  assert.equal(shareTitle([]), "Wineer 白酒推荐");
});
