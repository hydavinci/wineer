const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("runtime recommender copies equal the shared source", () => {
  const source = read("shared/recommender.js");
  assert.equal(read("web/shared/recommender.js"), source);
  assert.equal(read("wechat/miniprogram/shared/recommender.js"), source);
});

test("Web JSON equals canonical JSON", () => {
  assert.deepEqual(
    JSON.parse(read("web/data/baijiu.json")),
    JSON.parse(read("data/baijiu.json"))
  );
});

test("Mini Program data equals canonical JSON", () => {
  const canonical = JSON.parse(read("data/baijiu.json"));
  const generatedPath = path.join(root, "wechat/miniprogram/data/baijiu.js");
  delete require.cache[require.resolve(generatedPath)];
  assert.deepEqual(require(generatedPath), canonical);
});
