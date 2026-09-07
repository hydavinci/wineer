const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const candidates = require("../data/catalog-candidates.json");
const ledger = require("../data/catalog-provenance.json");
const { recommend, describeItem } = require("../shared/recommender");

test("ordinary M9 is promoted using the single-bottle listing rather than the crossed-out price", () => {
  const item = data.items.find(item => item.id === "yanghe-m9-52");
  assert.ok(item, "promote the evidenced candidate into the runtime catalog");
  assert.equal(item.price, 1099);
  assert.equal(item.priceBasis, "listing");
  assert.equal(item.abv, 52);
  assert.equal(item.volumeMl, 500);
  assert.match(item.edition, /非金M9/);
  assert.match(item.priceSource, /26wl5g4yo2bs3/);
  assert.equal(item.priceUpdated, "2026-09-07");
  assert.match(describeItem(item).qualityNotice, /挂牌价.*非成交价/);
  assert.match(item.caution, /活动.*结算/);
  assert.ok(!candidates.entries.some(entry => entry.id === item.id));
  assert.equal(recommend([item], { budget: 8 })[0].item.id, item.id);
  assert.deepEqual(recommend([item], { budget: 6 }), []);
});

test("stronger single-bottle product evidence does not silently validate the old Kouzijiao estimate", () => {
  const item = data.items.find(item => item.id === "kouzijiao");
  assert.match(item.source, /12114038638/);
  assert.equal(item.priceBasis, "estimate");
  assert.equal(item.priceSource, null);
  assert.equal(item.priceUpdated, null);
});

test("probable Bofen aliases retain ids and visible uncertainty rather than a confirmed identity group", () => {
  for (const id of ["fenjiu-bofen", "fenjiu-huanggaibofen"]) {
    const item = data.items.find(item => item.id === id);
    assert.ok(!item.identityGroup);
    assert.match(item.caution, /疑似同款/);
    const entry = ledger.entries.find(entry => entry.id === id);
    assert.ok(entry.evidence.some(evidence => evidence.url.includes("2oiv4ynm7sfa7")));
  }
});

test("candidate and provenance versions follow the promoted catalog without overlapping ids", () => {
  assert.equal(candidates.catalogVersion, data.meta.version);
  assert.equal(ledger.catalogVersion, data.meta.version);
  const ids = new Set(data.items.map(item => item.id));
  assert.ok(candidates.entries.every(entry => !ids.has(entry.id)));
});
