const assert = require("node:assert/strict");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const data = require("../data/baijiu.json");

function review(items, options) {
  return require("../scripts/catalog-review").reviewCatalog(items, options);
}

function wine(id, patch = {}) {
  return {
    ...data.items[0], id, brand: "样例", price: 50, volumeMl: 500, edition: "标准版",
    source: "https://example.com/product", priceBasis: "estimate",
    priceSource: null, priceUpdated: null, ...patch
  };
}

test("review reports sample exposure separately from eligibility and prioritizes visible price gaps", () => {
  const items = ["a", "b", "c", "d"].map(id => wine(id));
  const result = review(items, { asOf: "2026-09-07" });
  assert.equal(result.profileCount, 2430);
  assert.equal(result.coverage.recommendedCount, 3);
  assert.deepEqual(result.coverage.notSeenIds, ["d"]);
  assert.equal(result.coverage.sameBrandTop3Profiles, 2430);
  assert.equal(result.priority[0].id, "a");
  assert.equal(result.priority[0].top3Count, 2430);
  assert.ok(result.priority[0].reasons.includes("price-unverified"));
  assert.equal(result.priority.at(-1).top3Count, 0);
  assert.deepEqual(review([...items].reverse(), { asOf: "2026-09-07" }), result);
});

test("review flags old or future observations without pretending the date is a transaction date", () => {
  const quoted = { priceBasis: "retail", priceSource: "https://example.com/quote" };
  const old = review([wine("old", { ...quoted, priceUpdated: "2026-01-01" })], { asOf: "2026-09-07" });
  assert.ok(old.priority[0].reasons.includes("observation-older-than-90-days"));
  const future = review([wine("future", { ...quoted, priceUpdated: "2026-09-08" })], { asOf: "2026-09-07" });
  assert.ok(future.priority[0].reasons.includes("future-observation"));
  const fresh = review([wine("fresh", { ...quoted, priceUpdated: "2026-09-01" })], { asOf: "2026-09-07" });
  assert.deepEqual(fresh.priority, []);
  assert.throws(() => review([wine("a")], { asOf: "2026-02-30" }), /date/i);
});

test("maintenance review command produces a dated, actionable report for the actual catalog", () => {
  const result = spawnSync("python3", ["scripts/collect.py", "review", "--as-of", "2026-09-07"], {
    cwd: path.resolve(__dirname, ".."), encoding: "utf8", timeout: 15000
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.total, data.items.length);
  assert.equal(report.asOf, "2026-09-07");
  assert.ok(report.priority.some(entry => entry.reasons.includes("price-unverified")));
});
