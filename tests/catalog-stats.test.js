const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const data = require("../data/baijiu.json");

const statsPath = path.resolve(__dirname, "../scripts/catalog-stats.js");
const targets = {
  total: 200,
  bands: [
    { max: 100, target: 35 }, { max: 200, target: 40 },
    { max: 500, target: 55 }, { max: 900, target: 35 },
    { max: 1500, target: 20 }, { max: null, target: 15 }
  ]
};

function summarize(items, config = targets) {
  assert.ok(fs.existsSync(statsPath), "provide the shared-budget catalog statistics entry point");
  return require(statsPath).summarizeCatalog(items, config);
}

function item(price, index, priceBasis = "estimate") {
  return {
    ...data.items[0], id: `fixture-${index}`, price, priceBasis,
    priceSource: priceBasis === "estimate" ? null : "https://example.com/quote",
    priceUpdated: priceBasis === "estimate" ? null : "2026-09-07"
  };
}

test("price distribution counts exact boundaries once and reports quota gaps", () => {
  const prices = [100, 100.01, 200, 200.01, 500, 500.01, 900, 900.01, 1500, 1500.01];
  const result = summarize(prices.map((price, index) => item(price, index)));
  assert.equal(result.total, 10);
  assert.equal(result.targetTotal, 200);
  assert.deepEqual(result.bands.map(band => band.count), [1, 2, 2, 2, 2, 1]);
  assert.deepEqual(result.bands.map(band => band.percent), [10, 20, 20, 20, 20, 10]);
  assert.deepEqual(result.bands.map(band => band.gap), [34, 38, 53, 33, 18, 14]);
  assert.equal(result.bands[5].max, null);
});

test("statistics distinguish merchant quotes, guidance prices and estimates", () => {
  const result = summarize([
    item(80, 0), item(120, 1, "retail"), item(180, 2, "msrp"), item(300, 3, "listing")
  ]);
  assert.deepEqual(result.priceBasisCounts, { estimate: 1, retail: 1, msrp: 1, listing: 1, unspecified: 0 });
  assert.equal(result.unverifiedPrices, 1);
  assert.equal(result.bands[1].priceBasisCounts.retail, 1);
  assert.equal(result.bands[1].priceBasisCounts.msrp, 1);
  assert.equal(result.bands[1].unverifiedPrices, 0);
});

test("distribution refuses target definitions that drift from quiz budgets", () => {
  const wrongBoundary = structuredClone(targets);
  wrongBoundary.bands[2].max = 400;
  assert.throws(() => summarize([item(100, 0)], wrongBoundary), /budget|预算/i);
  assert.throws(() => summarize([item(100, 0)], { ...targets, total: 201 }), /total|总/i);
});

test("maintenance stats supports JSON without losing the human-readable command", () => {
  const run = args => spawnSync("python3", ["scripts/collect.py", "stats", ...args], {
    cwd: path.resolve(__dirname, ".."), encoding: "utf8"
  });
  const json = run(["--json"]);
  assert.equal(json.status, 0, json.stderr);
  let report;
  assert.doesNotThrow(() => { report = JSON.parse(json.stdout); }, "stats --json must emit JSON");
  assert.equal(report.total, data.items.length);
  assert.equal(report.bands.reduce((sum, band) => sum + band.count, 0), data.items.length);
  const text = run([]);
  assert.equal(text.status, 0, text.stderr);
  assert.match(text.stdout, /总计:/);
  assert.match(text.stdout, /占比/);
  assert.match(text.stdout, /待核实/);
});
