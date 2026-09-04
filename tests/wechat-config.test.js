const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));

test("project config points to the native Mini Program root", () => {
  const config = readJson("wechat/project.config.json");
  assert.equal(config.appid, "touristappid");
  assert.equal(config.miniprogramRoot, "miniprogram/");
  assert.equal(config.projectname, "wineer-wechat");
});

test("private project config example stays minimal", () => {
  const config = readJson("wechat/project.private.config.json.example");
  assert.deepEqual(config, { setting: {} });
});

test("private WeChat Developer Tools config is ignored", () => {
  const result = spawnSync(
    "git",
    ["check-ignore", "--quiet", "wechat/project.private.config.json"],
    { cwd: root, encoding: "utf8" }
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("app config starts with the home page and shell styling", () => {
  const config = readJson("wechat/miniprogram/app.json");
  assert.deepEqual(config.pages, [
    "pages/home/home",
    "pages/quiz/quiz",
    "pages/result/result"
  ]);
  assert.equal(config.window.navigationBarTitleText, "Wineer 白酒推荐");
  assert.equal(config.window.navigationBarBackgroundColor, "#1a1210");
  assert.equal(config.window.navigationBarTextStyle, "white");
  assert.equal(config.window.backgroundColor, "#1a1210");
  assert.equal(config.sitemapLocation, "sitemap.json");
});
