const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const GENERATED_FILES = [
  "web/data/baijiu.json",
  "web/shared/recommender.js",
  "wechat/miniprogram/data/baijiu.js",
  "wechat/miniprogram/shared/recommender.js"
];

test("build rejects invalid JSON without replacing any runtime output", () => {
  withBuildScratch((scratch) => {
    const before = seedRuntimeSentinels(scratch);
    fs.writeFileSync(path.join(scratch, "data/baijiu.json"), "{\"items\":[", "utf8");

    const result = runBuild(scratch);

    assert.notEqual(result.status, 0);
    assertRuntimeFilesEqual(scratch, before);
  });
});

test("build rejects semantically invalid data without replacing any runtime output", () => {
  withBuildScratch((scratch) => {
    const before = seedRuntimeSentinels(scratch);
    const sourcePath = path.join(scratch, "data/baijiu.json");
    const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    data.items[0].taste = [];
    fs.writeFileSync(sourcePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

    const result = runBuild(scratch);

    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}${result.stderr}`, /taste/);
    assertRuntimeFilesEqual(scratch, before);
  });
});

test("build leaves runtime outputs untouched when a later staged copy fails", () => {
  withBuildScratch((scratch) => {
    const before = seedRuntimeSentinels(scratch);
    fs.rmSync(path.join(scratch, "shared/recommender.js"));

    const result = runBuild(scratch);

    assert.notEqual(result.status, 0);
    assertRuntimeFilesEqual(scratch, before);
  });
});

function withBuildScratch(run) {
  const scratch = path.join(
    root,
    ".scratch",
    `build-integrity-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );

  try {
    for (const relativePath of [
      "scripts/build.sh",
      "scripts/generate-wechat-data.js",
      "data/baijiu.json",
      "shared/recommender.js",
      ...GENERATED_FILES
    ]) {
      copyIntoScratch(relativePath, scratch);
    }
    run(scratch);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function seedRuntimeSentinels(scratch) {
  const contents = {};
  GENERATED_FILES.forEach((relativePath, index) => {
    const content = `runtime sentinel ${index}\n`;
    fs.writeFileSync(path.join(scratch, relativePath), content, "utf8");
    contents[relativePath] = content;
  });
  return contents;
}

function assertRuntimeFilesEqual(scratch, expected) {
  for (const relativePath of GENERATED_FILES) {
    const actual = fs.readFileSync(path.join(scratch, relativePath), "utf8");
    assert.ok(actual === expected[relativePath], `${relativePath} changed after a failed build`);
  }
}

function runBuild(cwd) {
  return spawnSync("bash", ["scripts/build.sh"], {
    cwd,
    encoding: "utf8"
  });
}

function copyIntoScratch(relativePath, scratch) {
  const sourcePath = path.join(root, relativePath);
  const targetPath = path.join(scratch, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}
