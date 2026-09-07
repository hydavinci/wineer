const assert = require("node:assert/strict");
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");
const data = require("../data/baijiu.json");

test("the seed catalog explicitly distinguishes missing quality fields from verified values", () => {
  for (const item of data.items) {
    for (const field of ["volumeMl", "edition", "source", "priceSource", "priceUpdated"]) {
      assert.ok(Object.hasOwn(item, field), `${item.id} is missing ${field}`);
    }
  }
});

test("the maintenance command reports missing provenance without fabricating sources", () => {
  const result = spawnSync("python3", ["scripts/collect.py", "quality"], {
    cwd: path.resolve(__dirname, ".."), encoding: "utf8"
  });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.total, data.items.length);
  assert.ok(report.missing.source > 0);
  assert.equal(report.missing.priceBasis, data.items.filter(item => item.priceBasis == null).length);
  assert.ok(report.needsReview.includes("kouzijiao"));
});

test("core product specifications retain independent price uncertainty", () => {
  for (const [id, volume] of [
    ["kouzijiao", 500], ["qinghua20", 500], ["fenjiu-bofen", 475],
    ["fenjiu-laobaifen10", 475], ["fenjiu-laobaifen15", 475],
    ["shuanggou-shengfang", 500]
  ]) {
    const item = data.items.find(item => item.id === id);
    assert.equal(item.volumeMl, volume, id);
    assert.match(item.source, /^https:\/\//, id);
    assert.equal(item.priceSource, null, `${id}: product pages do not substantiate a price`);
    assert.equal(item.priceUpdated, null, `${id}: research date is not a quote date`);
  }
});

test("regional product specifications distinguish bottle sizes and leave ambiguous identities unresolved", () => {
  for (const [id, volume] of [
    ["niulanshan-baipai", 500], ["baiyunbian", 500], ["baiyunbian-12", 500],
    ["songhe-liangye", 480], ["hongxing-lan8", 750], ["baofeng-guose", 500],
    ["xifeng-huashan20", 500], ["dongjiu-guomi", 500], ["site-dongfangyun", 500],
    ["yanghe-mengzhilan-m6", 550], ["yanghe-mengzhilan-m3", 550],
    ["yanghe-haizhilan", 480], ["tuopai-t68", 480], ["jiujiang-shuangzheng", 610],
    ["maotai-hanjiang", 500], ["wuliangye-pujing", 500]
  ]) {
    const item = data.items.find(item => item.id === id);
    assert.equal(item.volumeMl, volume, id);
    assert.match(item.source, /^https:\/\//, id);
  }
  for (const id of [
    "hongxing-erguotou", "dongjiu", "yubingshao", "qingke-huzhu",
    "langpai-tianbao", "maotai-shengxiao", "wuliangye-jingdian", "yanghe-tianzhilan"
  ]) {
    const item = data.items.find(item => item.id === id);
    assert.equal(item.volumeMl, null, `${id}: do not guess a different product's bottle size`);
    assert.equal(item.edition, null, `${id}: the original identity remains ambiguous`);
  }
});

test("the 1915 listing price is recorded with its quote basis instead of an unsupported market estimate", () => {
  const item = data.items.find(item => item.id === "laobaigan");
  assert.equal(item.price, 3318);
  assert.equal(item.priceTier, "超高端");
  assert.equal(item.volumeMl, 500);
  assert.equal(item.priceSource, "https://www.hslbgjq.com/oderCenter/21.cshtml");
  assert.equal(item.priceUpdated, "2026-09-07");
  assert.match(item.caution, /挂牌价.*不代表.*结算价/);
});

test("the provenance ledger accounts for every wine and agrees with every applied field", () => {
  const ledgerPath = path.resolve(__dirname, "../data/catalog-provenance.json");
  assert.ok(fs.existsSync(ledgerPath), "persist the reviewed evidence and unresolved identities");
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
  assert.equal(ledger.catalogVersion, data.meta.version);
  assert.deepEqual(ledger.entries.map(entry => entry.id).sort(), data.items.map(item => item.id).sort());
  for (const entry of ledger.entries) {
    const item = data.items.find(item => item.id === entry.id);
    for (const [key, value] of Object.entries(entry.appliedFields)) {
      assert.deepEqual(item[key], value, `${entry.id}.${key}`);
    }
    const sourcedFields = Object.keys(entry.appliedFields)
      .filter(key => key !== "priceBasis" || entry.appliedFields.priceBasis !== "estimate");
    if (sourcedFields.length) {
      assert.ok(entry.evidence.length > 0, `${entry.id}: changed facts must have evidence`);
    }
    assert.equal(typeof entry.reviewNotes, "string");
  }
});
