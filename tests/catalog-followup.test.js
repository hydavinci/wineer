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

test("the Bofen aggregate quote remains a listing and does not validate its probable alias", () => {
  const item = data.items.find(item => item.id === "fenjiu-huanggaibofen");
  assert.equal(item.price, 56.5);
  assert.equal(item.priceBasis, "listing");
  assert.equal(item.abv, 53);
  assert.equal(item.volumeMl, 475);
  assert.equal(item.priceSource, "https://www.suning.com/item/0000000000/612856581.html");
  assert.equal(item.priceUpdated, "2026-09-07");
  assert.match(item.caution, /聚合.*展示价/);
  assert.match(item.caution, /结算.*未核实/);
  assert.match(item.caution, /疑似同款/);
  assert.match(describeItem(item).qualityNotice, /挂牌价.*非成交价/);
  const entry = ledger.entries.find(entry => entry.id === item.id);
  assert.equal(entry.priceEvidence.adopted, true);
  assert.equal(entry.priceEvidence.price, item.price);
  assert.equal(entry.priceEvidence.priceBasis, item.priceBasis);
  const alias = data.items.find(item => item.id === "fenjiu-bofen");
  assert.equal(alias.priceBasis, "estimate");
  assert.equal(alias.priceSource, null);
});

test("1952 enters the 900-yuan budget with its full-payment listing, not a monthly installment", () => {
  const item = data.items.find(item => item.id === "luzhou-1952-52");
  assert.ok(item, "promote the exactly specified and priced 1952 candidate");
  assert.equal(item.abv, 52);
  assert.equal(item.volumeMl, 500);
  assert.equal(item.edition, null, "1952 is a product name, not a production year");
  assert.equal(item.price, 752);
  assert.equal(item.priceBasis, "listing");
  assert.equal(item.priceSource, "https://shop.jshbank.com/ccmall/product/productDetail?productId=107141");
  assert.equal(item.priceUpdated, "2026-09-07");
  assert.match(item.caution, /全额.*分期/);
  assert.match(item.caution, /银行商城.*第三方.*展示价/);
  assert.match(item.caution, /购买资格.*库存.*结算.*未核实/);
  assert.match(item.caution, /规则推断.*未做实饮/);
  assert.match(describeItem(item).qualityNotice, /挂牌价.*非成交价/);
  assert.deepEqual(recommend([item], { budget: 4 }), []);
  assert.equal(recommend([item], { budget: 6 })[0].item.id, item.id);
  assert.ok(!candidates.entries.some(entry => entry.id === item.id));
});

test("conditional candidate quotes cannot leak into recommendations as verified generic products", () => {
  for (const [id, source, reason] of [
    ["baofeng-jinbiao-50", "tYd17NZHimhZPqyes9FE0g", /身份|重复/],
    ["langjiu-hongyun-53", "ZQvYnC57Dw8mChDHH19xMg", /年份/]
  ]) {
    const entry = candidates.entries.find(entry => entry.id === id);
    assert.ok(entry, id);
    assert.equal(entry.price, null, id);
    assert.equal(entry.priceBasis, null, id);
    assert.equal(entry.priceUpdated, null, id);
    assert.ok(!data.items.some(item => item.id === id), id);
    assert.ok(entry.evidence.some(evidence => evidence.url.includes(source)), id);
    assert.match(entry.reason, reason, id);
  }
});

test("candidate and provenance versions follow the promoted catalog without overlapping ids", () => {
  assert.equal(candidates.catalogVersion, data.meta.version);
  assert.equal(ledger.catalogVersion, data.meta.version);
  const ids = new Set(data.items.map(item => item.id));
  assert.ok(candidates.entries.every(entry => !ids.has(entry.id)));
});
