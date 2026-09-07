const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const vm = require("node:vm");
const { createPage, createWx } = require("./helpers/miniprogram");

const compiler = process.env.WINEER_WCC
  || "/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec/wcc";
const available = Boolean(process.env.WINEER_WCC) || fs.existsSync(compiler);
let context;

function render(file, data) {
  if (!context) {
    const result = spawnSync(compiler, [
      "pages/home/home.wxml", "pages/quiz/quiz.wxml", "pages/result/result.wxml",
      "pages/catalog/catalog.wxml", "components/wine-card/wine-card.wxml"
    ], {
      cwd: path.resolve(__dirname, "../wechat/miniprogram"),
      encoding: "utf8", timeout: 15000, maxBuffer: 8 * 1024 * 1024
    });

    assert.equal(result.status, 0, result.error?.message || result.stderr);
    context = vm.createContext({ window: {}, console });
    vm.runInContext(result.stdout, context, { timeout: 5000 });
  }
  return context.$gwx(file)(data);
}

function nodes(tree, tag) {
  if (!tree || typeof tree !== "object") return [];
  return [
    ...(tree.tag === tag ? [tree] : []),
    ...(tree.children || []).flatMap(child => nodes(child, tag))
  ];
}

test("native collapsed cards retain purchase warnings while hiding optional taste details", { skip: !available }, () => {
  const wine = { rank: 1, name: "Example", caution: "PURCHASE_CAUTION",
    qualityNotice: "PRICE_UNCERTAINTY", tradeoffText: "PREFERENCE_CONFLICT",
    tasteText: "OPTIONAL_TASTE", sourceText: "OPTIONAL_SOURCE" };
  const collapsed = JSON.stringify(render("components/wine-card/wine-card.wxml", { wine, expanded: false }));
  assert.ok(collapsed.includes("PURCHASE_CAUTION"));
  assert.ok(collapsed.includes("PRICE_UNCERTAINTY"));
  assert.ok(collapsed.includes("PREFERENCE_CONFLICT"));
  assert.ok(!collapsed.includes("OPTIONAL_TASTE"));
  const expanded = JSON.stringify(render("components/wine-card/wine-card.wxml", { wine, expanded: true }));
  assert.ok(expanded.includes("OPTIONAL_TASTE"));
  assert.ok(expanded.includes("OPTIONAL_SOURCE"));
});

test("native quiz renders labeled options, retains legacy selections and reveals four advanced sliders", { skip: !available }, () => {
  global.wx = createWx();
  try {
    const page = createPage("wechat/miniprogram/pages/quiz/quiz");
    page.onLoad({ budget: "5", occasion: "3" });
    const tree = render("pages/quiz/quiz.wxml", page.data);
    assert.equal(nodes(tree, "wx-radio").length, 11);
    assert.equal(nodes(tree, "wx-radio-group").length, 2);
    assert.equal(nodes(tree, "wx-button").filter(node => node.attr.bindtap === "applyPreset").length, 0);
    assert.ok(!JSON.stringify(tree).includes("场景预设"), "do not advertise removed scene presets");
    assert.equal(nodes(tree, "wx-slider").length, 0);
    const selected = nodes(tree, "wx-radio").filter(node => node.attr.checked);
    assert.deepEqual(selected.map(node => String(node.attr.value)), ["4", "4"]);
    page.toggleAdvanced();
    assert.equal(nodes(render("pages/quiz/quiz.wxml", page.data), "wx-slider").length, 4);
    page.setData({ agePending: true });
    assert.equal(nodes(render("pages/quiz/quiz.wxml", page.data), "wx-radio").length, 0);
  } finally {
    delete global.wx;
  }
});

test("native result omits feedback prompts while retaining adjustment, sharing and the age gate", { skip: !available }, () => {
  global.wx = createWx();
  try {
    const page = createPage("wechat/miniprogram/pages/result/result");
    page.onLoad({});
    const before = render("pages/result/result.wxml", page.data);
    assert.equal(nodes(before, "wx-wine-card").length, 3);
    assert.ok(!JSON.stringify(before).includes("这些推荐有帮助吗"), "do not ask users to rate the recommendations");
    assert.ok(!JSON.stringify(before).includes("默认只保存在本机"), "omit the unconfigured feedback/status card");
    const buttons = nodes(before, "wx-button");
    assert.equal(buttons.filter(node => node.attr.bindtap === "adjustPreferences").length, 1);
    assert.equal(buttons.filter(node => node.attr.bindtap === "generatePoster").length, 1);
    assert.equal(buttons.filter(node => node.attr.openType === "share").length, 1);
    assert.equal(buttons.filter(node => /Feedback/.test(node.attr.bindtap || "")).length, 0);
    page.setData({ reportingAvailable: true });
    const withReporting = render("pages/result/result.wxml", page.data);
    assert.equal(nodes(withReporting, "wx-switch").length, 1);
    assert.ok(!JSON.stringify(withReporting).includes("这些推荐有帮助吗"));
    page.setData({ agePending: true });
    assert.equal(nodes(render("pages/result/result.wxml", page.data), "wx-wine-card").length, 0);
  } finally {
    delete global.wx;
  }
});

test("native browsing exposes filters and empty recovery without suggesting a recommendation rank", { skip: !available }, () => {
  global.wx = createWx();
  try {
    const page = createPage("wechat/miniprogram/pages/catalog/catalog");
    page.onLoad();
    const tree = render("pages/catalog/catalog.wxml", page.data);
    assert.equal(nodes(tree, "wx-input").length, 1);
    assert.equal(nodes(tree, "wx-picker").length, 2);
    assert.equal(nodes(tree, "wx-wine-card").length, 20);
    const card = JSON.stringify(render("components/wine-card/wine-card.wxml", {
      wine: { ...page.data.wines[0], caution: "PURCHASE_CAUTION", qualityNotice: "PRICE_UNCERTAINTY" },
      catalogMode: true, expanded: false
    }));
    assert.ok(!card.includes("优先考虑这一款"));
    assert.ok(!card.includes("权衡："));
    assert.ok(card.includes("PURCHASE_CAUTION"));
    assert.ok(card.includes("PRICE_UNCERTAINTY"));
    page.onSearchInput({ detail: { value: "不存在的酒款" } });
    const empty = render("pages/catalog/catalog.wxml", page.data);
    assert.equal(nodes(empty, "wx-wine-card").length, 0);
    assert.ok(nodes(empty, "wx-button").some(node => node.attr.bindtap === "resetFilters"));
    page.setData({ agePending: true });
    const gated = render("pages/catalog/catalog.wxml", page.data);
    assert.equal(nodes(gated, "wx-input").length, 0);
    assert.equal(nodes(gated, "wx-wine-card").length, 0);
    for (const file of ["pages/home/home.wxml", "pages/result/result.wxml"]) {
      const viewData = file.includes("home") ? {} : { agePending: false, isLoading: false, wines: [] };
      assert.ok(nodes(render(file, viewData), "wx-button").some(node => node.attr.bindtap === "openCatalog"));
    }
  } finally {
    delete global.wx;
  }
});
