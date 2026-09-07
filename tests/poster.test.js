const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { defaultAnswers, recommend } = require("../shared/recommender");
const {
  buildPosterModel,
  drawPoster
} = require("../wechat/miniprogram/utils/poster");

const ranked = recommend(data.items, defaultAnswers());

test("poster model contains Top 3, a Mini Program sharing prompt, and disclaimer", () => {
  const model = buildPosterModel(ranked);

  assert.deepEqual(model.wines.map(({ id }) => id), [
    "kouzijiao", "fenjiu-laobaifen10", "shuanggou-shengfang"
  ]);
  assert.match(model.sharePrompt, /小程序.*分享/);
  assert.match(model.disclaimer, /非实时报价/);
  assert.equal(model.wines[0].rankLabel, "优先推荐");
  assert.ok(model.wines.every(wine => !Object.hasOwn(wine, "matchPercent")));
});

test("a sparse recommendation poster describes the actual result count", () => {
  const model = buildPosterModel(ranked.slice(0, 1));
  assert.match(model.subtitle, /1 款/);
  assert.doesNotMatch(model.subtitle, /Top 3/);
  assert.match(model.wines[0].details, /参考价/);
});

test("drawPoster uses the supplied canvas context", () => {
  const calls = [];
  const context = {
    beginPath: (...args) => calls.push(["beginPath", ...args]),
    closePath: (...args) => calls.push(["closePath", ...args]),
    fill: (...args) => calls.push(["fill", ...args]),
    fillRect: (...args) => calls.push(["fillRect", ...args, context.fillStyle]),
    fillText: (...args) => calls.push(["fillText", ...args, context.fillStyle]),
    lineTo: (...args) => calls.push(["lineTo", ...args]),
    measureText: text => ({ width: String(text).length * 20 }),
    moveTo: (...args) => calls.push(["moveTo", ...args]),
    quadraticCurveTo: (...args) => calls.push(["quadraticCurveTo", ...args])
  };
  const canvas = { getContext: () => context };

  const model = buildPosterModel(ranked);
  drawPoster(canvas, 750, 1200, model);

  assert.ok(calls.some(([name]) => name === "fillRect"));
  assert.ok(calls.some(([name]) => name === "fillText"));
  assert.ok(calls.some(([name, text]) => name === "fillText" && text === model.sharePrompt));
  assert.equal(calls.find(([name]) => name === "fillRect").at(-1), "#f7f6f2");
  assert.equal(calls.find(([name, text]) => name === "fillText" && text === model.title).at(-1), "#242722");
  assert.equal(calls.find(([name, text]) => name === "fillText" && text === model.disclaimer).at(-1), "#696c65");
});
