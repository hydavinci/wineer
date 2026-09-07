const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const {
  DIMENSIONS,
  RecommendationDataError,
  defaultAnswers,
  normalizeAnswers,
  budgetBand,
  scoreItem,
  describeItem,
  recommend
} = require("../shared/recommender");

const GOLDEN_VECTORS = [
  {
    name: "defaults",
    answers: { budget: 4, occasion: 4, softness: 3, flavorWeight: 4, brandFace: 4, adventure: 3 },
    ids: ["kouzijiao", "fenjiu-laobaifen10", "shuanggou-shengfang"]
  },
  {
    name: "budget daily",
    answers: { budget: 0, occasion: 1, softness: 2, flavorWeight: 2, brandFace: 1, adventure: 1 },
    ids: ["jiujiang-shuangzheng", "yubingshao", "fenjiu-huanggaibofen"]
  },
  {
    name: "business gift",
    answers: { budget: 9, occasion: 10, softness: 6, flavorWeight: 7, brandFace: 10, adventure: 2 },
    ids: ["gujing-gu20", "luzhou-1952-52", "yanghe-m9-52"]
  },
  {
    name: "adventurous",
    answers: { budget: 6, occasion: 3, softness: 9, flavorWeight: 10, brandFace: 1, adventure: 10 },
    ids: ["hengshui-gufa20", "dongjiu-baicao", "dongjiu"]
  }
];

test("defines the six dimensions and defaults", () => {
  assert.deepEqual(DIMENSIONS.map(({ key }) => key), [
    "budget", "occasion", "softness", "flavorWeight", "brandFace", "adventure"
  ]);
  assert.deepEqual(defaultAnswers(), GOLDEN_VECTORS[0].answers);
});

test("normalizes strings, fractions, bounds, and missing values", () => {
  assert.deepEqual(normalizeAnswers({
    budget: "-4",
    occasion: "8",
    softness: 4.6,
    flavorWeight: 99,
    brandFace: "invalid"
  }), {
    budget: 0,
    occasion: 8,
    softness: 5,
    flavorWeight: 10,
    brandFace: 4,
    adventure: 3
  });
});

for (const vector of GOLDEN_VECTORS) {
  test(`preserves the ${vector.name} ranking`, () => {
    assert.deepEqual(
      recommend(data.items, vector.answers).map(({ item }) => item.id),
      vector.ids
    );
  });
}

test("is deterministic and returns unique wines", () => {
  const first = recommend(data.items, defaultAnswers());
  const second = recommend(data.items, defaultAnswers());
  assert.deepEqual(second, first);
  assert.equal(new Set(first.map(({ item }) => item.id)).size, 3);
  assert.ok(first.every(({ matchPercent }) => matchPercent >= 60 && matchPercent <= 99));
});

test("respects a smaller result limit", () => {
  assert.equal(recommend(data.items, defaultAnswers(), 1).length, 1);
});

test("rejects invalid datasets instead of producing partial rankings", () => {
  assert.throws(() => recommend(null, defaultAnswers()), RecommendationDataError);
  assert.throws(
    () => recommend([{ id: "broken", name: "Broken" }], defaultAnswers()),
    RecommendationDataError
  );
});

test("adjacent values with the same budget label use identical ranking rules", () => {
  for (const [left, right] of [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]) {
    assert.deepEqual(
      recommend(data.items, { ...defaultAnswers(), budget: left }),
      recommend(data.items, { ...defaultAnswers(), budget: right })
    );
  }
});

test("budget bands expose the actual ceiling used by the recommendation", () => {
  const ceilings = [100, 100, 200, 200, 500, 500, 900, 900, 1500, 1500, Infinity];
  ceilings.forEach((ceiling, budget) => {
    assert.equal(budgetBand(budget).max, ceiling);
    assert.ok(recommend(data.items, { ...defaultAnswers(), budget })
      .every(({ item }) => item.price <= ceiling));
  });
});

test("a sparse catalog never silently fills results with over-budget wines", () => {
  const items = [
    { ...data.items[0], id: "affordable", price: 90, priceTier: "口粮" },
    { ...data.items[1], id: "over", price: 110, priceTier: "口粮" }
  ];
  assert.deepEqual(recommend(items, { budget: 0 }).map(({ item }) => item.id), ["affordable"]);
  assert.deepEqual(recommend([{ ...items[1] }], { budget: 0 }), []);
});

test("low strength wines do not acquire strong-alcohol claims from user preferences", () => {
  const item = data.items.find(({ id }) => id === "kouzi-xiaochi");
  const result = scoreItem(item, { ...defaultAnswers(), softness: 8 });
  assert.ok(!result.why.includes("酒劲够"));
  assert.ok(result.tradeoffs.some(reason => /度数偏低/.test(reason)));
});

test("adventurous claims require a matching wine attribute", () => {
  const item = data.items.find(({ id }) => id === "jiujiang-shuangzheng");
  const result = scoreItem(item, { ...defaultAnswers(), adventure: 8 });
  assert.ok(!result.why.includes("个性风味"));
  assert.ok(result.tradeoffs.some(reason => /大众/.test(reason)));
});

test("ranking labels convey order rather than a probability", () => {
  const ranked = recommend(data.items, defaultAnswers());
  assert.deepEqual(ranked.map(({ rankLabel }) => rankLabel), ["优先推荐", "备选 1", "备选 2"]);
  assert.ok(ranked.every(({ tradeoffs }) => Array.isArray(tradeoffs)));
});

test("catalog descriptions expose unknown specifications and price provenance honestly", () => {
  const details = describeItem({ ...data.items[0], volumeMl: null, edition: null,
    source: null, priceSource: null, priceUpdated: null });
  assert.match(details.specText, /容量待核实.*版本待核实/);
  assert.match(details.priceNote, /来源.*待核实/);
  assert.match(details.priceNote, /日期.*待核实/);
  const complete = describeItem({ ...data.items[0], volumeMl: 500, edition: "标准版",
    source: "https://example.com/product", priceSource: "https://example.com/price", priceUpdated: "2026-09-01" });
  assert.equal(complete.specText, "500mL · 标准版");
  assert.match(complete.priceNote, /2026-09-01/);
});

test("malformed optional catalog fields are rejected instead of published", () => {
  for (const patch of [
    { volumeMl: -500 }, { volumeMl: "500" }, { edition: "" },
    { source: "javascript:alert(1)" }, { priceSource: 42 },
    { priceUpdated: "2026-02-30" }, { priceUpdated: "yesterday" }
  ]) {
    assert.throws(() => recommend([{ ...data.items[0], ...patch }], {}), RecommendationDataError);
  }
});

test("price basis is explicit and estimates remain unverified even with a source", () => {
  const base = {
    ...data.items[0], priceSource: "https://example.com/quote", priceUpdated: "2026-09-07"
  };
  assert.match(describeItem({ ...base, priceBasis: "msrp" }).qualityNotice, /官方指导价.*非成交价/);
  assert.match(describeItem({ ...base, priceBasis: "listing" }).priceNote, /挂牌价/);
  assert.match(describeItem({ ...base, priceBasis: "retail" }).priceNote, /商家报价/);
  assert.match(describeItem({ ...base, priceBasis: "estimate" }).qualityNotice, /价格.*待核实/);
});

test("invalid price bases and unsupported quotes cannot enter recommendations", () => {
  for (const patch of [
    { priceBasis: "made-up" },
    { priceBasis: ["retail"], priceSource: "https://example.com/quote", priceUpdated: "2026-09-07" },
    { priceBasis: "retail", priceSource: null, priceUpdated: "2026-09-07" },
    { priceBasis: "msrp", priceSource: "https://example.com/quote", priceUpdated: null },
    { price: 0 }, { price: -1 }
  ]) {
    assert.throws(() => recommend([{ ...data.items[0], ...patch }], {}), RecommendationDataError);
  }
});

test("tied recommendations prefer fewer conflicts then lower reference price then stable id", () => {
  const base = { ...data.items[0], priceTier: "中端", price: 200 };
  const items = [
    { ...base, id: "z", price: 200 },
    { ...base, id: "b", price: 180 },
    { ...base, id: "a", price: 180 }
  ];
  assert.deepEqual(recommend(items, {}).map(({ item }) => item.id), ["a", "b", "z"]);
  assert.deepEqual(recommend([...items].reverse(), {}), recommend(items, {}));
});

test("reordering the catalog does not change any golden profile recommendation", () => {
  for (const { answers } of GOLDEN_VECTORS) {
    assert.deepEqual(recommend([...data.items].reverse(), answers), recommend(data.items, answers));
  }
});

test("catalog notices never equate a product source with a verified purchase price", () => {
  const item = { ...data.items[0], volumeMl: 500, edition: "标准版",
    source: "https://example.com/product", priceSource: null, priceUpdated: null };
  assert.match(describeItem(item).qualityNotice, /价格.*待核实/);
  assert.match(describeItem({ ...item, volumeMl: null }).qualityNotice, /规格.*待核实/);
  assert.match(describeItem({ ...item, priceSource: "https://example.com/price",
    priceUpdated: "2026-09-01" }).qualityNotice, /非实时.*成交价/);
});
