const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const workflowPath = path.join(root, ".github/workflows/ci.yml");

function getWorkflowRunCommands() {
  const workflowSource = fs.readFileSync(workflowPath, "utf8");
  return [...workflowSource.matchAll(/^\s*-\s*run:\s*(.+)$/gm)].map((match) =>
    match[1].trim().replace(/^['"]|['"]$/g, "")
  );
}

test("CI runs the generated-asset drift gate after build and before checks", () => {
  assert.deepEqual(getWorkflowRunCommands().slice(-3), [
    "bash scripts/build.sh",
    "bash scripts/check-generated-drift.sh",
    "bash scripts/check.sh"
  ]);
});

test("generated-asset drift gate fails when a committed build output changes", () => {
  const scratch = createScratchRepo();
  try {
    const targetPath = path.join(scratch, "web/shared/recommender.js");
    fs.writeFileSync(targetPath, `${fs.readFileSync(targetPath, "utf8")}\n// drift gate regression probe\n`);

    const result = spawnSync("bash", ["scripts/check-generated-drift.sh"], {
      cwd: scratch,
      encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}${result.stderr}`, /web\/shared\/recommender\.js/);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});

test("generated-asset drift gate fails when a committed build output is deleted", () => {
  const scratch = createScratchRepo();
  try {
    fs.rmSync(path.join(scratch, "web/shared/recommender.js"));

    const result = spawnSync("bash", ["scripts/check-generated-drift.sh"], {
      cwd: scratch,
      encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}${result.stderr}`, /web\/shared\/recommender\.js/);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});

test("generated-asset drift gate fails when build recreates an output omitted from HEAD", () => {
  const scratch = createScratchRepo();
  try {
    const relativePath = "web/shared/recommender.js";
    const targetPath = path.join(scratch, relativePath);
    const generatedContent = fs.readFileSync(targetPath, "utf8");

    runGit(["rm", relativePath], scratch);
    runGit(["commit", "-m", "omit generated output"], scratch);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, generatedContent);

    const result = spawnSync("bash", ["scripts/check-generated-drift.sh"], {
      cwd: scratch,
      encoding: "utf8"
    });

    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}${result.stderr}`, /web\/shared\/recommender\.js/);
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
});

function createScratchRepo() {
  const scratchRoot = path.join(
    root,
    ".scratch",
    `ci-workflow-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  );

  fs.mkdirSync(path.join(scratchRoot, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(scratchRoot, "web/data"), { recursive: true });
  fs.mkdirSync(path.join(scratchRoot, "web/shared"), { recursive: true });
  fs.mkdirSync(path.join(scratchRoot, "wechat/miniprogram/data"), { recursive: true });
  fs.mkdirSync(path.join(scratchRoot, "wechat/miniprogram/shared"), { recursive: true });

  copyIntoScratch("scripts/check-generated-drift.sh", scratchRoot);
  copyIntoScratch("data/baijiu.json", scratchRoot);
  copyIntoScratch("shared/recommender.js", scratchRoot);
  copyIntoScratch("web/data/baijiu.json", scratchRoot);
  copyIntoScratch("web/shared/recommender.js", scratchRoot);
  copyIntoScratch("wechat/miniprogram/data/baijiu.js", scratchRoot);
  copyIntoScratch("wechat/miniprogram/shared/recommender.js", scratchRoot);

  runGit(["init"], scratchRoot);
  runGit(["config", "user.name", "Copilot"], scratchRoot);
  runGit(["config", "user.email", "copilot@example.com"], scratchRoot);
  runGit(["add", "."], scratchRoot);
  runGit(["commit", "-m", "fixture"], scratchRoot);

  return scratchRoot;
}

function copyIntoScratch(relativePath, scratchRoot) {
  const sourcePath = path.join(root, relativePath);
  const targetPath = path.join(scratchRoot, relativePath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(sourcePath, targetPath);
}

function runGit(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout || `git ${args.join(" ")} failed`);
}
