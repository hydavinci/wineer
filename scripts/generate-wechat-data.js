const fs = require("node:fs");
const path = require("node:path");
const { validateItems } = require("../shared/recommender");

const root = path.resolve(__dirname, "..");
const sourcePath = path.resolve(root, process.argv[2] || "data/baijiu.json");
const outputPath = path.resolve(
  root,
  process.argv[3] || "wechat/miniprogram/data/baijiu.js"
);
const AROMAS = new Set(["酱香", "浓香", "清香", "兼香", "米香", "凤香", "其他"]);
const PRICE_TIERS = new Set(["口粮", "中端", "高端", "超高端"]);
const STRING_FIELDS = [
  "id",
  "name",
  "brand",
  "aroma",
  "priceTier",
  "region",
  "highlight",
  "caution"
];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateString(item, index, field) {
  if (typeof item[field] !== "string" || item[field].trim() === "") {
    throw new Error(`Invalid canonical data: item ${index} field ${field}`);
  }
}

function validateStringArray(item, index, field) {
  if (
    !Array.isArray(item[field])
    || item[field].length === 0
    || item[field].some(value => typeof value !== "string" || value.trim() === "")
  ) {
    throw new Error(`Invalid canonical data: item ${index} field ${field}`);
  }
}

function validateData(data) {
  if (!isObject(data) || !isObject(data.meta)) {
    throw new Error("Invalid canonical data: expected top-level meta object");
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Invalid canonical data: expected a non-empty items array");
  }

  const ids = new Set();
  data.items.forEach((item, index) => {
    if (!isObject(item)) {
      throw new Error(`Invalid canonical data: item ${index} must be an object`);
    }
    STRING_FIELDS.forEach(field => validateString(item, index, field));
    if (ids.has(item.id)) {
      throw new Error(`Invalid canonical data: duplicate id ${item.id}`);
    }
    ids.add(item.id);
    if (!AROMAS.has(item.aroma)) {
      throw new Error(`Invalid canonical data: item ${index} field aroma`);
    }
    if (!PRICE_TIERS.has(item.priceTier)) {
      throw new Error(`Invalid canonical data: item ${index} field priceTier`);
    }
    if (!Number.isFinite(item.abv) || item.abv <= 0) {
      throw new Error(`Invalid canonical data: item ${index} field abv`);
    }
    if (!Number.isFinite(item.price) || item.price < 0) {
      throw new Error(`Invalid canonical data: item ${index} field price`);
    }
    if (!Number.isInteger(item.beginner) || item.beginner < 1 || item.beginner > 5) {
      throw new Error(`Invalid canonical data: item ${index} field beginner`);
    }
    validateStringArray(item, index, "taste");
    validateStringArray(item, index, "scene");
  });
  validateItems(data.items);
}

function writeAtomically(targetPath, content) {
  const temporaryPath = `${targetPath}.tmp-${process.pid}`;
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  try {
    fs.writeFileSync(temporaryPath, content, "utf8");
    fs.renameSync(temporaryPath, targetPath);
  } finally {
    fs.rmSync(temporaryPath, { force: true });
  }
}

try {
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  validateData(data);
  if (process.argv[3] === "--validate") {
    console.log(`✅ 校验通过：${data.items.length} 款，字段格式合法，无重复 id`);
  } else {
    writeAtomically(
      outputPath,
      `"use strict";\n\nmodule.exports = ${JSON.stringify(data, null, 2)};\n`
    );
    console.log(`generated ${path.relative(root, outputPath)}`);
  }
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
}
