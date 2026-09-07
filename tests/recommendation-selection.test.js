const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { recommend, RecommendationDataError } = require("../shared/recommender");

function wine(id, patch = {}) {
  return {
    ...data.items[0], id, brand: "样例品牌", price: 90, priceTier: "中端",
    priceBasis: "estimate", priceSource: null, priceUpdated: null,
    ...patch
  };
}

test("equally matching quotes outrank estimates without treating an attached estimate URL as a quote", () => {
  const items = [
    wine("estimate", { price: 50, priceSource: "https://example.com/old", priceUpdated: "2026-09-07" }),
    wine("quoted", { priceBasis: "retail", priceSource: "https://example.com/bottle", priceUpdated: "2026-09-01" })
  ];
  assert.deepEqual(recommend(items, {}).map(entry => entry.item.id), ["quoted", "estimate"]);
});

test("brand variety only changes equally matching alternatives, not a better first choice", () => {
  const items = [wine("a"), wine("b"), wine("c"), wine("d", { brand: "另一品牌" })];
  assert.deepEqual(recommend(items, {}).map(entry => entry.item.id), ["a", "d", "b"]);
  assert.deepEqual(recommend([...items].reverse(), {}), recommend(items, {}));
  const lessSuitable = wine("d", { brand: "另一品牌", scene: ["收藏"], aroma: "其他" });
  assert.deepEqual(recommend([...items.slice(0, 3), lessSuitable], {}).map(entry => entry.item.id), ["a", "b", "c"]);
});

test("confirmed product groups keep legacy ids but occupy only one recommendation slot", () => {
  const items = [
    wine("a", { identityGroup: "same-bottle" }),
    wine("b", { identityGroup: "same-bottle" }),
    wine("c"), wine("d")
  ];
  assert.deepEqual(recommend(items, {}).map(entry => entry.item.id), ["a", "c", "d"]);
  assert.equal(items.length, 4, "do not delete catalog records while selecting");
});

test("identity groups cannot merge different strengths or known bottle sizes", () => {
  for (const patch of [{ abv: 42 }, { volumeMl: 750 }, { identityGroup: "" }]) {
    assert.throws(() => recommend([
      wine("a", { identityGroup: "same-bottle", abv: 53, volumeMl: 475 }),
      wine("b", { identityGroup: "same-bottle", abv: 53, volumeMl: 475, ...patch })
    ], {}), RecommendationDataError);
  }
});

test("duplicate ids are rejected and identity grouping never fills with over-budget alternatives", () => {
  assert.throws(() => recommend([wine("a"), wine("a")], {}), RecommendationDataError);
  const items = [
    wine("a", { identityGroup: "same-bottle" }),
    wine("b", { identityGroup: "same-bottle" }),
    wine("c", { price: 101 })
  ];
  assert.deepEqual(recommend(items, { budget: 0 }).map(entry => entry.item.id), ["a"]);
});
