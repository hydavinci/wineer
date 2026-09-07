const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { defaultAnswers, recommend } = require("../shared/recommender");
const {
  RecommendationDataError
} = require("../wechat/miniprogram/shared/recommender");
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
    "fenjiu-laobaifen10",
    "shuanggou-shengfang"
  ]);
  assert.equal(cards[0].rank, 1);
  assert.match(cards[0].whyText, /预算内/);
  assert.equal(cards[0].rankLabel, "优先推荐");
  assert.ok(cards[0].tradeoffText.length > 0);
  assert.match(cards[0].specText, /500mL/);
  assert.match(cards[0].qualityNotice, /价格待核实/);
});

test("builds the approved purchase search keyword", () => {
  assert.equal(purchaseKeyword(ranked[0].item), "口子窖 10年兼香型50度 500mL 十年型（50度）");
  assert.doesNotMatch(purchaseKeyword(ranked[0].item), /京东搜索/);
});

test("uses the top wine in the share title", () => {
  assert.equal(shareTitle(ranked), `Wineer 推荐：${ranked[0].item.name}`);
  assert.equal(shareTitle([]), "Wineer 白酒推荐");
});

test("throws a data error when a required display field is missing", () => {
  const malformedRanked = [{
    ...ranked[0],
    item: {
      ...ranked[0].item,
      taste: undefined
    }
  }];

  assert.throws(
    () => buildResultView(malformedRanked),
    error => error instanceof RecommendationDataError && /field taste/.test(error.message)
  );
});

test("purchase keywords include known specifications without inventing unknown ones", () => {
  assert.equal(purchaseKeyword({ name: "测试酒", volumeMl: 475, edition: null }), "测试酒 475mL");
  assert.equal(purchaseKeyword({ name: "测试酒", volumeMl: null, edition: null }), "测试酒");
  assert.equal(purchaseKeyword({ name: "测试酒", volumeMl: 500, edition: "21版" }), "测试酒 500mL 21版");
});
