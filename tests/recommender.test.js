const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const {
  DIMENSIONS,
  RecommendationDataError,
  defaultAnswers,
  normalizeAnswers,
  recommend
} = require("../shared/recommender");

const GOLDEN_VECTORS = [
  {
    name: "defaults",
    answers: { budget: 4, occasion: 4, softness: 3, flavorWeight: 4, brandFace: 4, adventure: 3 },
    ids: ["kouzijiao", "qinghua20", "shuanggou-shengfang"]
  },
  {
    name: "budget daily",
    answers: { budget: 0, occasion: 1, softness: 2, flavorWeight: 2, brandFace: 1, adventure: 1 },
    ids: ["jiujiang-shuangzheng", "yubingshao", "fenjiu-bofen"]
  },
  {
    name: "business gift",
    answers: { budget: 9, occasion: 10, softness: 6, flavorWeight: 7, brandFace: 10, adventure: 2 },
    ids: ["gujing-gu20", "wuliangye-pujing", "guojiao1573"]
  },
  {
    name: "adventurous",
    answers: { budget: 6, occasion: 3, softness: 9, flavorWeight: 10, brandFace: 1, adventure: 10 },
    ids: ["hengshui-gufa20", "laobaigan", "dongjiu"]
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
