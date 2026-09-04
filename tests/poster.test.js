const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { defaultAnswers, recommend } = require("../shared/recommender");
const {
  buildPosterModel,
  drawPoster
} = require("../wechat/miniprogram/utils/poster");

const ranked = recommend(data.items, defaultAnswers());

test("poster model contains Top 3 and disclaimer", () => {
  const model = buildPosterModel(ranked);

  assert.deepEqual(model.wines.map(({ id }) => id), [
    "kouzijiao", "qinghua20", "shuanggou-shengfang"
  ]);
  assert.match(model.disclaimer, /非实时报价/);
});

test("drawPoster uses the supplied canvas context", () => {
  const calls = [];
  const context = {
    beginPath: (...args) => calls.push(["beginPath", ...args]),
    closePath: (...args) => calls.push(["closePath", ...args]),
    fill: (...args) => calls.push(["fill", ...args]),
    fillRect: (...args) => calls.push(["fillRect", ...args]),
    fillText: (...args) => calls.push(["fillText", ...args]),
    lineTo: (...args) => calls.push(["lineTo", ...args]),
    measureText: text => ({ width: String(text).length * 20 }),
    moveTo: (...args) => calls.push(["moveTo", ...args]),
    quadraticCurveTo: (...args) => calls.push(["quadraticCurveTo", ...args])
  };
  const canvas = { getContext: () => context };

  drawPoster(canvas, 750, 1200, buildPosterModel(ranked));

  assert.ok(calls.some(([name]) => name === "fillRect"));
  assert.ok(calls.some(([name]) => name === "fillText"));
});
