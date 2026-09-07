const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { createPage, createWx } = require("./helpers/miniprogram");
const pagePath = "wechat/miniprogram/pages/catalog/catalog";

function filter(items, filters) {
  return require("../wechat/miniprogram/utils/catalog").filterCatalog(items, filters);
}

test.beforeEach(() => { global.wx = createWx(); });
test.afterEach(() => { delete global.wx; });

test("browse price bands are disjoint and include their exact upper boundary", () => {
  const prices = [100, 100.01, 200, 200.01, 500, 500.01, 900, 900.01, 1500, 1500.01];
  const items = prices.map(price => ({ ...data.items[0], id: String(price), price }));
  const expected = [[100], [100.01, 200], [200.01, 500], [500.01, 900], [900.01, 1500], [1500.01]];
  expected.forEach((values, index) => {
    assert.deepEqual(filter(items, { priceBand: String(index) }).map(item => item.price), values);
  });
  assert.throws(() => filter(items, { priceBand: "unexpected" }), /price/i);
  assert.throws(() => filter(items, { aroma: "nonexistent" }), /aroma/i);
});

test("browse search matches all normalized words across names, brands and known specifications", () => {
  const items = [
    { ...data.items[0], id: "a", name: "示例酒 53度", brand: "品牌甲", volumeMl: 500, price: 50 },
    { ...data.items[0], id: "b", name: "示例酒 42度", brand: "品牌甲", volumeMl: 475, price: 40 }
  ];
  assert.deepEqual(filter(items, { query: " 品牌甲  ５００ＭＬ " }).map(item => item.id), ["a"]);
  assert.deepEqual(filter(items, { query: "不存在" }), []);
  assert.deepEqual(filter([...items].reverse(), {}).map(item => item.id), ["b", "a"]);
});

test("catalog direct entry stays empty until adult confirmation and decline returns home", () => {
  global.wx = createWx(false);
  const page = createPage(pagePath);
  page.onLoad();
  assert.equal(page.data.agePending, true);
  assert.deepEqual(page.data.wines, []);
  page.onSearchInput({ detail: { value: "汾酒" } });
  assert.deepEqual(page.data.wines, []);
  wx.modals[0].success({ confirm: false });
  assert.equal(wx.routes[0].url, "/pages/home/home");
  assert.deepEqual(page.data.wines, []);
});

test("catalog progressively displays active wines, combines filters and resets an empty search", () => {
  const page = createPage(pagePath);
  page.onLoad();
  assert.equal(page.data.total, data.items.length);
  assert.equal(page.data.wines.length, 20);
  assert.equal(page.data.hasMore, true);
  page.onReachBottom();
  assert.equal(page.data.wines.length, 40);
  page.onSearchInput({ detail: { value: "汾酒" } });
  page.onPriceChange({ detail: { value: "1" } });
  const aromaIndex = page.data.aromaOptions.findIndex(option => option.value === "清香");
  page.onAromaChange({ detail: { value: String(aromaIndex) } });
  assert.ok(page.data.wines.length > 0);
  assert.ok(page.data.wines.every(item => item.price <= 100 && item.aroma === "清香"));
  assert.ok(page.data.wines.every(item => !Object.hasOwn(item, "rank")));
  page.onSearchInput({ detail: { value: "不存在的酒款" } });
  assert.equal(page.data.resultCount, 0);
  assert.equal(page.data.hasMore, false);
  page.resetFilters();
  assert.equal(page.data.resultCount, data.items.length);
  assert.equal(page.data.query, "");
  assert.equal(page.data.priceIndex, 0);
  assert.equal(page.data.aromaIndex, 0);
  assert.equal(page.data.wines.length, 20);
});

test("catalog can resume confirmation and copies known specs without recording false success", () => {
  global.wx = createWx(false);
  const page = createPage(pagePath);
  page.onLoad();
  wx.modals[0].success({ confirm: true });
  assert.equal(page.data.agePending, false);
  let clipboard;
  wx.setClipboardData = options => { clipboard = options; };
  page.onSearchInput({ detail: { value: "口子窖 十年" } });
  const item = page.data.wines.find(wine => wine.id === "kouzijiao");
  assert.ok(item);
  page.copyPurchaseKeyword({ detail: { id: item.id } });
  assert.match(clipboard.data, /500mL/);
  assert.ok(!wx.storage.get("wineer_events").some(entry => entry.event === "copy_keyword_success"));
  clipboard.success();
  assert.ok(wx.storage.get("wineer_events").some(entry =>
    entry.event === "copy_keyword_success" && entry.payload.source === "catalog"));
  page.copyPurchaseKeyword({ detail: { id: "not-present" } });
  assert.match(wx.toasts.at(-1).title, /不存在/);
});

test("home and result browse entries keep their pages and release navigation locks on return", () => {
  for (const path of ["wechat/miniprogram/pages/home/home", "wechat/miniprogram/pages/result/result"]) {
    const page = createPage(path);
    page.onLoad?.({});
    page.openCatalog();
    page.openCatalog();
    assert.equal(wx.routes.length, 1);
    assert.equal(wx.routes[0].url, "/pages/catalog/catalog");
    page.onShow();
    assert.equal(page.data.navigationBusy, false);
    wx.routes.length = 0;
  }
});

test("malformed later-page display data shows an explicit error and can recover after repair", t => {
  const runtime = require("../wechat/miniprogram/data/baijiu");
  const index = runtime.items.findIndex(item => item.price === Math.max(...runtime.items.map(wine => wine.price)));
  const original = runtime.items[index];
  t.after(() => { runtime.items[index] = original; });
  t.mock.method(console, "error", () => {});
  runtime.items[index] = { ...original, taste: null };
  const page = createPage(pagePath);
  page.onLoad();
  assert.equal(page.data.errorMessage, "");
  while (page.data.hasMore) page.onReachBottom();
  assert.match(page.data.errorMessage, /无法加载/);
  assert.deepEqual(page.data.wines, []);
  runtime.items[index] = original;
  page.resetFilters();
  assert.equal(page.data.errorMessage, "");
  assert.equal(page.data.wines.length, 20);
});

test("invalid picker events leave the current filters and results intact", t => {
  t.mock.method(console, "error", () => {});
  const page = createPage(pagePath);
  page.onLoad();
  const before = structuredClone(page.data);
  page.onPriceChange({ detail: { value: "not-a-number" } });
  page.onAromaChange({ detail: { value: "-1" } });
  assert.deepEqual(page.data, before);
  assert.equal(wx.toasts.length, 2);
});
