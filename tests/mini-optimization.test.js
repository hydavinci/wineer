const assert = require("node:assert/strict");
const test = require("node:test");
const { createPage, createWx } = require("./helpers/miniprogram");
const config = require("../wechat/miniprogram/config");

const quizPath = "wechat/miniprogram/pages/quiz/quiz";
const resultPath = "wechat/miniprogram/pages/result/result";
const changed = { budget: 8, occasion: 8, softness: 2, flavorWeight: 1, brandFace: 7, adventure: 2 };
test.beforeEach(() => { global.wx = createWx(); });
test.afterEach(() => {
  delete global.wx;
  config.analyticsEndpoint = "";
});

test("adjusting a result preserves all six answers while reset restores defaults", () => {
  const result = createPage(resultPath);
  result.onLoad(changed);
  result.adjustPreferences();
  const url = wx.routes[0].url;
  const quiz = createPage(quizPath);
  quiz.onLoad(Object.fromEntries(new URLSearchParams(url.split("?")[1])));
  assert.deepEqual(quiz.data.answers, changed);
  quiz.resetAnswers();
  assert.deepEqual(quiz.data.answers, {
    budget: 4, occasion: 4, softness: 3, flavorWeight: 4, brandFace: 4, adventure: 3
  });
});

test("slider updates only changed data and ignores repeated integer values", () => {
  const page = createPage(quizPath);
  page.onLoad({});
  const event = { currentTarget: { dataset: { key: "budget" } }, detail: { value: 8 } };
  page.onSliderChange(event);
  assert.equal(page.data.answers.budget, 8);
  assert.equal(page.data.dimensions[0].value, 8);
  assert.ok(!Object.hasOwn(page.patches.at(-1), "dimensions"));
  const count = page.patches.length;
  page.onSliderChange(event);
  assert.equal(page.patches.length, count);
});

test("changing any scene preserves the budget and all four advanced preferences", () => {
  const page = createPage(quizPath);
  page.onLoad(changed);
  for (const occasion of [1, 4, 5, 8, 10]) {
    page.selectOption({ currentTarget: { dataset: { key: "occasion" } }, detail: { value: String(occasion) } });
    assert.deepEqual(page.data.answers, { ...changed, occasion });
    assert.equal(page.data.occasionSelected, occasion);
  }
});

test("raw rankings stay out of setData and result views contain actual tradeoffs", () => {
  const page = createPage(resultPath);
  page.onLoad(changed);
  assert.equal(page.ranked.length, 3);
  assert.ok(page.patches.every(patch => !Object.hasOwn(patch, "ranked")));
  assert.equal(page.data.wines[0].rankLabel, "优先推荐");
  assert.ok(page.data.wines.every(wine => wine.tradeoffText.length > 0));
});

test("first shared entry remains gated and preserves the incoming answers after confirmation", () => {
  global.wx = createWx(false);
  const page = createPage(resultPath);
  page.onLoad({ ...changed, from: "share" });
  assert.equal(page.data.agePending, true);
  assert.equal(page.data.wines.length, 0);
  assert.equal(wx.modals.length, 1);
  wx.modals[0].success({ confirm: true });
  assert.equal(page.data.agePending, false);
  assert.deepEqual(page.data.answers, changed);
  assert.equal(page.data.wines.length, 3);
  const events = wx.storage.get("wineer_events");
  assert.ok(events.some(entry => entry.event === "result_view" && entry.payload.fromShare));
});

test("declining age confirmation reveals no recommendations", () => {
  global.wx = createWx(false);
  const page = createPage(resultPath);
  page.onLoad(changed);
  wx.modals[0].success({ confirm: false });
  assert.equal(page.data.wines.length, 0);
  assert.equal(wx.routes[0].url, "/pages/home/home");
  assert.equal(wx.storage.get("wineer_adult_confirmed_v1"), false);
});

test("quiz direct entry also requires confirmation", () => {
  global.wx = createWx(false);
  const page = createPage(quizPath);
  page.onLoad(changed);
  assert.equal(page.data.agePending, true);
  assert.equal(page.data.dimensions.length, 0);
  wx.modals[0].success({ confirm: true });
  assert.deepEqual(page.data.answers, changed);
});

test("copy success is only recorded after the clipboard callback succeeds", () => {
  const page = createPage(resultPath);
  page.onLoad({});
  let callbacks;
  wx.setClipboardData = options => { callbacks = options; };
  page.copyPurchaseKeyword({ detail: { id: page.ranked[0].item.id } });
  assert.ok(!wx.storage.get("wineer_events").some(entry => entry.event === "copy_keyword_success"));
  callbacks.success();
  assert.ok(wx.storage.get("wineer_events").some(entry => entry.event === "copy_keyword_success"));
});

test("navigation ignores duplicate taps and releases its lock on failure", () => {
  const page = createPage(resultPath);
  page.onLoad({});
  page.adjustPreferences();
  page.adjustPreferences();
  assert.equal(wx.routes.length, 1);
  const original = console.error;
  console.error = () => {};
  try {
    wx.routes[0].fail(new Error("route unavailable"));
  } finally {
    console.error = original;
  }
  assert.equal(page.data.navigationBusy, false);
  assert.match(wx.toasts.at(-1).title, /失败/);
  page.adjustPreferences();
  assert.equal(wx.routes.length, 2);
});

test("the reporting UI requires informed opt-in before transmitting local records", async () => {
  config.analyticsEndpoint = "https://example.com/events";
  const page = createPage(resultPath);
  page.onLoad({});
  assert.equal(page.data.reportingAvailable, true);
  assert.equal(page.data.reportingEnabled, false);
  let requests = 0;
  wx.request = options => { requests++; options.success({ statusCode: 200 }); };
  page.toggleReporting({ detail: { value: true } });
  assert.equal(requests, 0);
  assert.match(wx.modals[0].content, /最近 200 条/);
  await wx.modals[0].success({ confirm: true });
  assert.equal(requests, 1);
  assert.equal(page.data.reportingEnabled, true);
  assert.match(page.data.reportStatus, /已上报/);
  page.toggleReporting({ detail: { value: false } });
  assert.equal(page.data.reportingEnabled, false);
});

test("budget options preserve incoming answers and select the corresponding ceiling", () => {
  const page = createPage(quizPath);
  page.onLoad({ budget: "5", occasion: "3" });
  assert.equal(page.data.answers.budget, 5);
  assert.equal(page.data.budgetSelected, 4);
  assert.equal(page.data.occasionSelected, 4);
  page.selectOption({ currentTarget: { dataset: { key: "budget" } }, detail: { value: "2" } });
  assert.equal(page.data.answers.budget, 2);
  assert.equal(page.data.budgetSelected, 2);
  assert.match(page.data.dimensions[0].hint, /200/);
  assert.equal(page.data.answers.occasion, 3);
});

test("scene and budget selection stay independent and reset restores defaults", () => {
  const page = createPage(quizPath);
  page.onLoad({ budget: 9 });
  page.selectOption({ currentTarget: { dataset: { key: "occasion" } }, detail: { value: "10" } });
  assert.equal(page.data.answers.occasion, 10);
  assert.equal(page.data.answers.budget, 9);
  page.selectOption({ currentTarget: { dataset: { key: "budget" } }, detail: { value: "8" } });
  assert.equal(page.data.occasionSelected, 10);
  assert.equal(page.data.budgetSelected, 8);
  page.resetAnswers();
  assert.equal(page.data.budgetSelected, 4);
  assert.equal(page.data.occasionSelected, 4);
});

test("invalid option selection cannot silently change the profile", () => {
  const page = createPage(quizPath);
  page.onLoad({});
  const before = { ...page.data.answers };
  const original = console.error;
  console.error = () => {};
  try {
    page.selectOption({ currentTarget: { dataset: { key: "budget" } }, detail: { value: "garbage" } });
  } finally {
    console.error = original;
  }
  assert.deepEqual(page.data.answers, before);
  assert.match(wx.toasts.at(-1).title, /无效/);
});

test("quiz entry events use the explicit source rather than the budget value", () => {
  for (const [options, source, editing] of [
    [{ budget: 9 }, "direct", false],
    [{ from: "adjust", softness: 1 }, "adjust", true],
    [{ from: "restart" }, "restart", false],
    [{ from: "home" }, "home", false],
    [{ from: "unknown" }, "direct", false]
  ]) {
    const page = createPage(quizPath);
    page.onLoad(options);
    const entry = wx.storage.get("wineer_events").at(-1);
    assert.equal(entry.payload.source, source);
    assert.equal(entry.payload.editing, editing);
  }
});

test("adjust and restart navigation identify their source without changing the answers", () => {
  const page = createPage(resultPath);
  page.onLoad({});
  page.adjustPreferences();
  const edit = Object.fromEntries(new URLSearchParams(wx.routes[0].url.split("?")[1]));
  assert.equal(edit.from, "adjust");
  assert.equal(edit.budget, "4");
  page.setData({ navigationBusy: false });
  page.restart();
  assert.match(wx.routes[1].url, /[?&]from=restart/);
});

test("legacy focused quiz links preserve answers and reveal the relevant preference", () => {
  const quiz = createPage(quizPath);
  quiz.onLoad({ ...changed, from: "feedback", focus: "softness" });
  assert.equal(quiz.data.advanced, true);
  assert.equal(quiz.data.focusDimension, "softness");
  assert.deepEqual(quiz.data.answers, changed);
});
