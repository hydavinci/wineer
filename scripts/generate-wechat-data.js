const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "data/baijiu.json");
const outputPath = path.join(root, "wechat/miniprogram/data/baijiu.js");
const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  `"use strict";\n\nmodule.exports = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);
console.log("generated wechat/miniprogram/data/baijiu.js");
