const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const ledger = require("../data/catalog-provenance.json");
const targets = require("../data/catalog-targets.json");
const { summarizeCatalog } = require("../scripts/catalog-stats");
const { recommend, budgetOptions, budgetBand } = require("../shared/recommender");

test("catalog expansion adds sourced, precisely specified wines without exceeding approved quotas", () => {
  const additions = ledger.entries.filter(entry => entry.addedIn);
  assert.ok(additions.length > 0, "deliver researched additions, not only a larger target");
  assert.equal(data.items.length, 100 + additions.length);
  assert.ok(data.items.length <= targets.total);
  const ids = new Set();
  const names = new Set();
  for (const item of data.items) {
    assert.ok(!ids.has(item.id), `duplicate id: ${item.id}`);
    ids.add(item.id);
    const name = item.name.normalize("NFKC").replace(/[\s·（）()]/g, "");
    assert.ok(!names.has(name), `duplicate named specification: ${item.name}`);
    names.add(name);
  }
  for (const entry of additions) {
    const item = data.items.find(item => item.id === entry.id);
    assert.ok(item, entry.id);
    assert.ok(item.volumeMl > 0, entry.id);
    assert.match(item.source, /^https:\/\//, entry.id);
    assert.ok(["retail", "msrp", "listing"].includes(item.priceBasis), entry.id);
    assert.match(item.priceSource, /^https:\/\//, entry.id);
    assert.match(item.priceUpdated, /^\d{4}-\d{2}-\d{2}$/, entry.id);
    assert.ok(entry.evidence.length > 0, entry.id);
    assert.match(item.caution, /推断|实饮/, entry.id);
  }
  for (const band of summarizeCatalog(data.items, targets).bands) {
    assert.ok(band.count <= band.target, `${band.label}: do not fill other bands to hide a shortfall`);
  }
});

test("new wines participate in recommendations without escaping any budget ceiling", () => {
  const additions = new Set(ledger.entries.filter(entry => entry.addedIn).map(entry => entry.id));
  const recommendedAdditions = new Set();
  for (const { value: budget } of budgetOptions()) {
    for (const occasion of [0, 4, 6, 8, 10]) {
      for (const flavorWeight of [1, 4, 9]) {
        const result = recommend(data.items, { budget, occasion, flavorWeight, softness: 6, brandFace: 8, adventure: 7 });
        assert.equal(new Set(result.map(({ item }) => item.id)).size, result.length);
        for (const { item } of result) {
          assert.ok(item.price <= budgetBand(budget).max, item.id);
          if (additions.has(item.id)) recommendedAdditions.add(item.id);
        }
      }
    }
  }
  assert.ok(recommendedAdditions.size > 0, "the expanded catalog must reach the recommendation path");
});
