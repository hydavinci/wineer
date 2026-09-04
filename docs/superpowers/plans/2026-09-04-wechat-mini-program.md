# Wineer WeChat Mini Program MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native WeChat Mini Program in `wechat/` that reproduces Wineer's age gate, six-dimension quiz, Top 3 recommendations, sharing, poster generation, and purchase-keyword copying while preserving the existing Web experience.

**Architecture:** Extract the scoring rules into a dependency-free UMD/CommonJS module at `shared/recommender.js`. Build copies that module and the canonical `data/baijiu.json` into the Web and Mini Program runtime directories; Web keeps browser-specific rendering while the Mini Program implements native pages and WeChat APIs.

**Tech Stack:** Vanilla JavaScript, Node.js 22 built-in test runner, Python 3 validation scripts, Bash build/check scripts, native WeChat Mini Program WXML/WXSS/JavaScript.

**Spec:** `docs/superpowers/specs/2026-09-04-wechat-mini-program-design.md`

## Global Constraints

- The native Mini Program lives under `wineer/wechat/` and uses a placeholder AppID.
- `data/baijiu.json` remains the only hand-maintained wine data source.
- Web and Mini Program must execute the same recommendation implementation.
- Do not add npm, pip, Taro, uni-app, cloud development, login, favorites, history, payment, affiliate, live pricing, inventory, or admin features.
- The MVP purchase action copies `"<wine name> 京东搜索"`; it does not navigate to an e-commerce Mini Program.
- Remote analytics are out of scope; Mini Program events remain in local Storage with a maximum of 200 records.
- Existing Web share URLs remain valid and existing recommendation rankings must not change unintentionally.
- Generated runtime files are committed but never hand-edited.
- Errors must be surfaced explicitly; do not introduce empty catches, silent data fallbacks, recursive retries, or success-shaped failures.

## File Map

### Shared recommendation source

- `shared/recommender.js`: UMD/CommonJS recommendation API used by Node tests and copied into both runtimes.
- `tests/recommender.test.js`: normalization, error, ranking, budget, stability, and golden-vector tests.

### Runtime generation

- `scripts/generate-wechat-data.js`: deterministically converts canonical JSON into a CommonJS data module.
- `scripts/build.sh`: generates/copies all runtime assets.
- `scripts/check.sh`: validates data, generated-file equality, tests, and JavaScript syntax.
- `web/shared/recommender.js`: generated Web copy of the shared core.
- `wechat/miniprogram/shared/recommender.js`: generated Mini Program copy of the shared core.
- `wechat/miniprogram/data/baijiu.js`: generated Mini Program wine data module.
- `tests/runtime-assets.test.js`: verifies generated copies exactly match canonical sources.

### Existing Web integration

- `web/index.html`: loads the generated shared module before `app.js`.
- `web/app.js`: retains browser state/rendering/sharing and delegates scoring to `WineerRecommender`.
- `tests/web-smoke.test.js`: boots the browser bundle with mocks and verifies unchanged golden recommendations.

### Mini Program shell and pages

- `wechat/project.config.json`: developer-tool project configuration using `touristappid`.
- `wechat/project.private.config.json.example`: documented personal-settings example.
- `wechat/miniprogram/app.js`: empty application lifecycle shell.
- `wechat/miniprogram/app.json`: page registration and global window configuration.
- `wechat/miniprogram/app.wxss`: global palette, typography, cards, and buttons.
- `wechat/miniprogram/sitemap.json`: permits indexed pages.
- `wechat/miniprogram/pages/home/*`: brand introduction and age confirmation.
- `wechat/miniprogram/pages/quiz/*`: six native slider controls and navigation to results.
- `wechat/miniprogram/pages/result/*`: recommendation computation, actions, error state, and poster canvas.
- `wechat/miniprogram/components/wine-card/*`: presentation-only result card.

### Mini Program utilities

- `wechat/miniprogram/utils/navigation.js`: answer query encoding and decoding.
- `wechat/miniprogram/utils/result.js`: result view-model, share-title, and purchase-keyword helpers.
- `wechat/miniprogram/utils/analytics.js`: bounded local event storage.
- `wechat/miniprogram/utils/poster.js`: poster model and Canvas drawing.
- `tests/wechat-config.test.js`: project/page configuration checks.
- `tests/navigation.test.js`: answer query round-trip and invalid-input tests.
- `tests/result-utils.test.js`: result-model and purchase-keyword tests.
- `tests/analytics.test.js`: Storage retention and failure behavior tests.
- `tests/poster.test.js`: poster-model and drawing-call tests.

### Documentation

- `README.md`: adds Mini Program build and import instructions.
- `wechat/README.md`: focused developer-tool, AppID, build, and manual-acceptance guide.

---

### Task 1: Extract and Characterize the Shared Recommendation Core

**Files:**
- Create: `shared/recommender.js`
- Create: `tests/recommender.test.js`
- Read from: `web/app.js:8-99`
- Read from: `web/app.js:212-370`
- Read from: `data/baijiu.json`

**Interfaces:**
- Produces: `DIMENSIONS: Array<Dimension>`
- Produces: `RecommendationDataError extends Error`
- Produces: `defaultAnswers(): Answers`
- Produces: `normalizeAnswers(input: object): Answers`
- Produces: `scoreItem(item: Wine, answers: Answers): RankedWine`
- Produces: `recommend(items: Wine[], answers: object, limit?: number): RankedWine[]`
- `RankedWine` shape: `{ item, score, why, matchPercent }`
- `Answers` keys: `budget`, `occasion`, `softness`, `flavorWeight`, `brandFace`, `adventure`

- [ ] **Step 1: Write failing golden-vector and validation tests**

Create `tests/recommender.test.js` with Node's built-in runner:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const {
  DIMENSIONS,
  RecommendationDataError,
  defaultAnswers,
  normalizeAnswers,
  recommend
} = require("../shared/recommender");

const GOLDEN_VECTORS = [
  {
    name: "defaults",
    answers: { budget: 4, occasion: 4, softness: 3, flavorWeight: 4, brandFace: 4, adventure: 3 },
    ids: ["kouzijiao", "qinghua20", "shuanggou-shengfang"]
  },
  {
    name: "budget daily",
    answers: { budget: 0, occasion: 1, softness: 2, flavorWeight: 2, brandFace: 1, adventure: 1 },
    ids: ["jiujiang-shuangzheng", "yubingshao", "fenjiu-bofen"]
  },
  {
    name: "business gift",
    answers: { budget: 9, occasion: 10, softness: 6, flavorWeight: 7, brandFace: 10, adventure: 2 },
    ids: ["gujing-gu20", "wuliangye-pujing", "guojiao1573"]
  },
  {
    name: "adventurous",
    answers: { budget: 6, occasion: 3, softness: 9, flavorWeight: 10, brandFace: 1, adventure: 10 },
    ids: ["hengshui-gufa20", "laobaigan", "dongjiu"]
  }
];

test("defines the six dimensions and defaults", () => {
  assert.deepEqual(DIMENSIONS.map(({ key }) => key), [
    "budget", "occasion", "softness", "flavorWeight", "brandFace", "adventure"
  ]);
  assert.deepEqual(defaultAnswers(), GOLDEN_VECTORS[0].answers);
});

test("normalizes strings, fractions, bounds, and missing values", () => {
  assert.deepEqual(normalizeAnswers({
    budget: "-4",
    occasion: "8",
    softness: 4.6,
    flavorWeight: 99,
    brandFace: "invalid"
  }), {
    budget: 0,
    occasion: 8,
    softness: 5,
    flavorWeight: 10,
    brandFace: 4,
    adventure: 3
  });
});

for (const vector of GOLDEN_VECTORS) {
  test(`preserves the ${vector.name} ranking`, () => {
    assert.deepEqual(
      recommend(data.items, vector.answers).map(({ item }) => item.id),
      vector.ids
    );
  });
}

test("is deterministic and returns unique wines", () => {
  const first = recommend(data.items, defaultAnswers());
  const second = recommend(data.items, defaultAnswers());
  assert.deepEqual(second, first);
  assert.equal(new Set(first.map(({ item }) => item.id)).size, 3);
  assert.ok(first.every(({ matchPercent }) => matchPercent >= 60 && matchPercent <= 99));
});

test("respects a smaller result limit", () => {
  assert.equal(recommend(data.items, defaultAnswers(), 1).length, 1);
});

test("rejects invalid datasets instead of producing partial rankings", () => {
  assert.throws(() => recommend(null, defaultAnswers()), RecommendationDataError);
  assert.throws(
    () => recommend([{ id: "broken", name: "Broken" }], defaultAnswers()),
    RecommendationDataError
  );
});
```

- [ ] **Step 2: Run the tests to verify the module is missing**

Run:

```bash
cd /Users/yhe/Work/wineer
node --test tests/recommender.test.js
```

Expected: FAIL with `Cannot find module '../shared/recommender'`.

- [ ] **Step 3: Implement the dependency-free UMD/CommonJS module**

Create `shared/recommender.js` with this wrapper and public contract:

```js
(function initRecommender(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.WineerRecommender = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createRecommender() {
  "use strict";

  const ANSWER_KEYS = [
    "budget", "occasion", "softness", "flavorWeight", "brandFace", "adventure"
  ];
  const DEFAULT_ANSWERS = {
    budget: 4,
    occasion: 4,
    softness: 3,
    flavorWeight: 4,
    brandFace: 4,
    adventure: 3
  };

  class RecommendationDataError extends Error {
    constructor(message) {
      super(message);
      this.name = "RecommendationDataError";
    }
  }

  function defaultAnswers() {
    return { ...DEFAULT_ANSWERS };
  }

  function normalizeAnswers(input = {}) {
    const normalized = defaultAnswers();
    for (const key of ANSWER_KEYS) {
      const numeric = Number(input[key]);
      if (!Number.isFinite(numeric)) continue;
      normalized[key] = Math.max(0, Math.min(10, Math.round(numeric)));
    }
    return normalized;
  }

  // Move DIMENSIONS, brand/aroma sets, sceneTargets, budgetTier,
  // aromaTargets, budgetCeiling, brandScore, and the existing scoring
  // branches from web/app.js without changing their constants or copy.
  // Change scoreItem to receive normalized answers explicitly.

  function recommend(items, inputAnswers, limit = 3) {
    validateItems(items);
    const answers = normalizeAnswers(inputAnswers);
    const resultLimit = Math.max(0, Math.floor(Number(limit) || 0));
    const ceiling = budgetCeiling(answers.budget);
    const ranked = items
      .map((item, index) => ({ ...scoreItem(item, answers), index }))
      .sort((left, right) => right.score - left.score || left.index - right.index);
    const withinBudget = Number.isFinite(ceiling)
      ? ranked.filter(({ item }) => item.price <= ceiling * 1.15)
      : ranked;
    const selected = (withinBudget.length >= resultLimit ? withinBudget : ranked)
      .slice(0, resultLimit);
    const bestScore = Math.max(...selected.map(({ score }) => score), 1);
    return selected.map(({ index, ...entry }) => ({
      ...entry,
      matchPercent: Math.max(60, Math.min(99, Math.round(entry.score / bestScore * 96)))
    }));
  }

  return {
    DIMENSIONS,
    RecommendationDataError,
    defaultAnswers,
    normalizeAnswers,
    scoreItem,
    recommend
  };
});
```

Implement `validateItems(items)` to require a non-empty array and verify every item has valid `id`, `name`, `brand`, `aroma`, numeric `abv`, numeric `price`, `priceTier`, integer `beginner`, and array `scene`. Throw `RecommendationDataError` with the failing index and field.

Copy the existing score weights and reason strings exactly from `web/app.js:266-346`. Do not tune weights during extraction.

- [ ] **Step 4: Run the core tests**

Run:

```bash
node --test tests/recommender.test.js
```

Expected: all tests PASS, including the four exact ID vectors.

- [ ] **Step 5: Commit the shared core**

```bash
git add shared/recommender.js tests/recommender.test.js
git commit -m "refactor: extract shared recommendation core"
```

---

### Task 2: Generate and Verify Runtime Assets

**Files:**
- Create: `scripts/generate-wechat-data.js`
- Create: `tests/runtime-assets.test.js`
- Create generated: `web/shared/recommender.js`
- Create generated: `wechat/miniprogram/shared/recommender.js`
- Create generated: `wechat/miniprogram/data/baijiu.js`
- Modify: `scripts/build.sh`
- Modify: `scripts/check.sh`

**Interfaces:**
- Consumes: `shared/recommender.js` from Task 1.
- Produces: `wechat/miniprogram/data/baijiu.js` exporting `{ meta, schema, items }`.
- Produces: byte-identical runtime copies of `shared/recommender.js`.
- Produces: `bash scripts/build.sh` as the single runtime-generation command.

- [ ] **Step 1: Write failing generated-asset tests**

Create `tests/runtime-assets.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify generated files are missing**

Run:

```bash
node --test tests/runtime-assets.test.js
```

Expected: FAIL on the first missing generated runtime path.

- [ ] **Step 3: Implement deterministic Mini Program data generation**

Create `scripts/generate-wechat-data.js`:

```js
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
```

Update `scripts/build.sh` to create runtime directories, copy canonical files, copy the shared core to both runtimes, and run the generator:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p web/data web/shared
mkdir -p wechat/miniprogram/data wechat/miniprogram/shared

cp data/baijiu.json web/data/baijiu.json
cp shared/recommender.js web/shared/recommender.js
cp shared/recommender.js wechat/miniprogram/shared/recommender.js
node scripts/generate-wechat-data.js

echo "✅ generated Web and WeChat runtime assets"
```

- [ ] **Step 4: Expand the check command**

Update `scripts/check.sh` so its complete content runs:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

python3 scripts/collect.py validate
python3 -m json.tool data/baijiu.json >/dev/null
python3 -m json.tool web/data/baijiu.json >/dev/null

node --check shared/recommender.js
node --check web/shared/recommender.js
node --check wechat/miniprogram/shared/recommender.js
node --check wechat/miniprogram/data/baijiu.js
node --test tests/*.test.js

echo "✅ check passed"
```

- [ ] **Step 5: Build twice and verify determinism**

Run:

```bash
bash scripts/build.sh
before="$(shasum web/data/baijiu.json web/shared/recommender.js \
  wechat/miniprogram/shared/recommender.js \
  wechat/miniprogram/data/baijiu.js)"
bash scripts/build.sh
after="$(shasum web/data/baijiu.json web/shared/recommender.js \
  wechat/miniprogram/shared/recommender.js \
  wechat/miniprogram/data/baijiu.js)"
test "$before" = "$after"
node --test tests/runtime-assets.test.js
```

Expected: the second build creates no diff and all runtime-asset tests PASS.

- [ ] **Step 6: Commit generated-asset support**

```bash
git add scripts/build.sh scripts/check.sh scripts/generate-wechat-data.js \
  tests/runtime-assets.test.js web/shared/recommender.js \
  wechat/miniprogram/shared/recommender.js wechat/miniprogram/data/baijiu.js
git commit -m "build: generate shared Mini Program assets"
```

---

### Task 3: Rewire the Existing Web App to the Shared Core

**Files:**
- Modify: `web/index.html:45-46`
- Modify: `web/app.js:1-370`
- Create: `tests/web-smoke.test.js`

**Interfaces:**
- Consumes browser global: `WineerRecommender`.
- Preserves public browser API: `Wineer.startQuiz`, `setDim`, `recommend`, `restart`, `shareResult`, `downloadPoster`, `trackBuy`.
- Preserves existing `w=1` answer query parameters.

- [ ] **Step 1: Write a failing browser-bundle smoke test**

Create `tests/web-smoke.test.js` using `node:vm`. Load `web/shared/recommender.js`, then `web/app.js`, mock `fetch`, DOM, Storage, and location, and assert:

```js
test("Web bundle preserves the default ranking through the shared core", async () => {
  const context = await bootWebBundle();
  context.Wineer.startQuiz();
  context.Wineer.recommend();
  assert.equal(context.sharedRecommendCalls, 1);
  assert.deepEqual(extractRenderedWineIds(context), [
    "kouzijiao", "qinghua20", "shuanggou-shengfang"
  ]);
});

test("Web bundle restores shared answer parameters", async () => {
  const context = await bootWebBundle(
    "?w=1&budget=0&occasion=1&softness=2&flavorWeight=2&brandFace=1&adventure=1"
  );
  context.Wineer.startQuiz();
  context.Wineer.recommend();
  assert.deepEqual(extractRenderedWineIds(context), [
    "jiujiang-shuangzheng", "yubingshao", "fenjiu-bofen"
  ]);
});
```

`bootWebBundle()` must expose the evaluated `Wineer` object on the VM context, resolve the mocked `fetch`, and map rendered names back to canonical IDs. After loading `web/shared/recommender.js` and before loading `web/app.js`, wrap `WineerRecommender.recommend` with a spy that increments `context.sharedRecommendCalls`. It must not copy the scoring algorithm.

- [ ] **Step 2: Run the smoke test before rewiring**

Run:

```bash
node --test tests/web-smoke.test.js
```

Expected: FAIL because `web/index.html` and `web/app.js` do not yet consume `WineerRecommender`.

- [ ] **Step 3: Load the generated shared module before the Web UI**

Change the end of `web/index.html` to:

```html
<script src="shared/recommender.js?v=0.5"></script>
<script src="app.js?v=0.5"></script>
```

- [ ] **Step 4: Remove duplicate recommendation rules from `web/app.js`**

At the start of the IIFE, bind the shared API:

```js
const {
  DIMENSIONS,
  defaultAnswers,
  normalizeAnswers,
  recommend: rankWines
} = WineerRecommender;
```

Delete local `FAMOUS_BRANDS`, `STEADY_AROMAS`, `CHARACTER_AROMAS`, `DIMENSIONS`, `defaultAnswers`, `sceneTargets`, `budgetTier`, `aromaTargets`, `budgetCeiling`, `brandScore`, and `scoreItem`.

Keep Web-only URL, DOM, analytics, sharing, and poster functions.

Replace the page action with:

```js
function recommend() {
  if (DB.length === 0) {
    alert("数据尚未加载完成，请稍后重试");
    return;
  }

  answers = normalizeAnswers(answers);
  let top3;
  try {
    top3 = rankWines(DB, answers, 3);
  } catch (error) {
    console.error("recommendation failed", error);
    alert("推荐数据异常，请稍后再试");
    return;
  }

  lastTop3 = top3;
  track("recommend", {
    answers: { ...answers },
    top3: top3.map(({ item, score }) => ({
      id: item.id,
      name: item.name,
      score,
      price: item.price
    }))
  });
  renderResult(top3);
  switchScreen("result");
}
```

In `renderResult()`, use `r.matchPercent` instead of recomputing the percentage.

- [ ] **Step 5: Harden Web data loading without recursive retries**

Change `load()` to verify `res.ok`, verify `json.items` is an array, and try each path exactly once. On success it returns `true`. If both paths fail, log both underlying errors, show the existing user-facing failure message, leave `DB` empty, and return `false`. `recommend()` must never call `load().then(recommend)`.

- [ ] **Step 6: Run Web and core regressions**

Run:

```bash
bash scripts/build.sh
node --test tests/recommender.test.js tests/runtime-assets.test.js tests/web-smoke.test.js
bash scripts/check.sh
```

Expected: all tests PASS and the four golden rankings remain unchanged.

- [ ] **Step 7: Commit the Web integration**

```bash
git add web/index.html web/app.js tests/web-smoke.test.js \
  web/shared/recommender.js wechat/miniprogram/shared/recommender.js
git commit -m "refactor: use shared recommender on Web"
```

---

### Task 4: Create the Native Mini Program Shell and Home Page

**Files:**
- Create: `wechat/project.config.json`
- Create: `wechat/project.private.config.json.example`
- Create: `wechat/miniprogram/app.js`
- Create: `wechat/miniprogram/app.json`
- Create: `wechat/miniprogram/app.wxss`
- Create: `wechat/miniprogram/sitemap.json`
- Create: `wechat/miniprogram/pages/home/home.js`
- Create: `wechat/miniprogram/pages/home/home.json`
- Create: `wechat/miniprogram/pages/home/home.wxml`
- Create: `wechat/miniprogram/pages/home/home.wxss`
- Create: `tests/wechat-config.test.js`

**Interfaces:**
- Produces page route: `pages/home/home`.
- Project AppID: `touristappid`.

- [ ] **Step 1: Write failing configuration tests**

Create `tests/wechat-config.test.js`:

```js
const assert = require("node:assert/strict");
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

test("app config starts with the home page", () => {
  const config = readJson("wechat/miniprogram/app.json");
  assert.deepEqual(config.pages, ["pages/home/home"]);
});
```

- [ ] **Step 2: Run the test to verify configuration is absent**

Run:

```bash
node --test tests/wechat-config.test.js
```

Expected: FAIL with missing `wechat/project.config.json`.

- [ ] **Step 3: Add the standard project and app configuration**

Use:

```json
{
  "appid": "touristappid",
  "compileType": "miniprogram",
  "miniprogramRoot": "miniprogram/",
  "projectname": "wineer-wechat",
  "setting": {
    "es6": true,
    "minified": true,
    "postcss": true
  }
}
```

Register only `pages/home/home` in `app.json` so this task remains runnable before later pages exist. Set navigation title to `Wineer 白酒推荐`, use background `#1a1210`, foreground `white`, and set `"sitemapLocation": "sitemap.json"`.

- [ ] **Step 4: Implement the home page**

`home.js` contains `Page({})`.

`home.wxml` contains the Wineer logo, product description, and exact 18+ warning from the Web version. The start button is added with its destination in Task 5, when the quiz page exists.

`app.wxss` defines the shared colors and reusable `.page`, `.card`, `.button-primary`, `.button-secondary`, `.muted`, and safe-area spacing. `home.wxss` only contains home-specific centering and logo styles.

- [ ] **Step 5: Run configuration and syntax checks**

Run:

```bash
node --test tests/wechat-config.test.js
node --check wechat/miniprogram/app.js
node --check wechat/miniprogram/pages/home/home.js
```

Expected: all checks PASS.

- [ ] **Step 6: Commit the Mini Program shell**

```bash
git add wechat/project.config.json wechat/project.private.config.json.example \
  wechat/miniprogram/app.js wechat/miniprogram/app.json \
  wechat/miniprogram/app.wxss wechat/miniprogram/sitemap.json \
  wechat/miniprogram/pages/home tests/wechat-config.test.js
git commit -m "feat: add native Mini Program shell"
```

---

### Task 5: Implement Answer Navigation and the Six-Dimension Quiz

**Files:**
- Create: `wechat/miniprogram/utils/navigation.js`
- Create: `wechat/miniprogram/pages/quiz/quiz.js`
- Create: `wechat/miniprogram/pages/quiz/quiz.json`
- Create: `wechat/miniprogram/pages/quiz/quiz.wxml`
- Create: `wechat/miniprogram/pages/quiz/quiz.wxss`
- Create: `tests/navigation.test.js`
- Modify: `wechat/miniprogram/app.json`
- Modify: `wechat/miniprogram/pages/home/home.js`
- Modify: `wechat/miniprogram/pages/home/home.wxml`
- Modify: `tests/wechat-config.test.js`

**Interfaces:**
- Consumes: `DIMENSIONS`, `defaultAnswers()`, `normalizeAnswers()` from `../../shared/recommender`.
- Produces: `encodeAnswers(answers): string`.
- Produces: `decodeAnswers(options): Answers`.
- Quiz navigation target: `/pages/result/result?<six encoded keys>`.

- [ ] **Step 1: Write failing navigation tests**

Create `tests/navigation.test.js`:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const { defaultAnswers } = require("../shared/recommender");
const {
  decodeAnswers,
  encodeAnswers
} = require("../wechat/miniprogram/utils/navigation");

test("round-trips all six answer values", () => {
  const answers = {
    budget: 1, occasion: 2, softness: 3,
    flavorWeight: 4, brandFace: 5, adventure: 6
  };
  const query = encodeAnswers(answers);
  assert.equal(
    query,
    "budget=1&occasion=2&softness=3&flavorWeight=4&brandFace=5&adventure=6"
  );
  assert.deepEqual(
    decodeAnswers(Object.fromEntries(new URLSearchParams(query))),
    answers
  );
});

test("uses safe normalized values for missing or invalid options", () => {
  assert.deepEqual(decodeAnswers({ budget: "99", occasion: "bad" }), {
    ...defaultAnswers(),
    budget: 10
  });
});
```

- [ ] **Step 2: Run the test to verify the navigation module is missing**

Run:

```bash
node --test tests/navigation.test.js
```

Expected: FAIL with missing `utils/navigation`.

- [ ] **Step 3: Implement answer encoding and decoding**

`navigation.js`:

```js
const { normalizeAnswers } = require("../shared/recommender");

const ANSWER_KEYS = [
  "budget", "occasion", "softness", "flavorWeight", "brandFace", "adventure"
];

function encodeAnswers(input) {
  const answers = normalizeAnswers(input);
  return ANSWER_KEYS
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(answers[key])}`)
    .join("&");
}

function decodeAnswers(options = {}) {
  return normalizeAnswers(options);
}

module.exports = { ANSWER_KEYS, decodeAnswers, encodeAnswers };
```

Because `utils/navigation.js` is one directory below the Mini Program root, its runtime import must be `require("../shared/recommender")`.

- [ ] **Step 4: Implement the quiz page state**

`quiz.js`:

```js
const {
  DIMENSIONS,
  defaultAnswers,
  normalizeAnswers
} = require("../../shared/recommender");
const { encodeAnswers } = require("../../utils/navigation");

function toViewDimensions(answers) {
  return DIMENSIONS.map(dimension => ({
    key: dimension.key,
    title: dimension.title,
    left: dimension.left,
    right: dimension.right,
    value: answers[dimension.key],
    hint: dimension.hint(answers[dimension.key])
  }));
}

Page({
  data: {
    answers: defaultAnswers(),
    dimensions: []
  },

  onLoad() {
    this.refreshDimensions(defaultAnswers());
  },

  onSliderChange(event) {
    const { key } = event.currentTarget.dataset;
    const answers = normalizeAnswers({
      ...this.data.answers,
      [key]: event.detail.value
    });
    this.refreshDimensions(answers);
  },

  refreshDimensions(answers) {
    this.setData({
      answers,
      dimensions: toViewDimensions(answers)
    });
  },

  showResults() {
    const query = encodeAnswers(this.data.answers);
    wx.navigateTo({ url: `/pages/result/result?${query}` });
  }
});
```

`quiz.wxml` renders six cards with `wx:for`, a slider using `data-key`, and a primary button bound to `showResults`. Do not render HTML strings.

- [ ] **Step 5: Register and connect the quiz page**

Append `pages/quiz/quiz` to `app.json`. Change `home.js` to:

```js
Page({
  startQuiz() {
    wx.navigateTo({ url: "/pages/quiz/quiz" });
  }
});
```

Add the primary `我已满 18 岁，开始` button to `home.wxml` and bind it to `startQuiz`.

Update `tests/wechat-config.test.js` to expect:

```js
assert.deepEqual(config.pages, [
  "pages/home/home",
  "pages/quiz/quiz"
]);
```

- [ ] **Step 6: Style and verify the quiz**

Add responsive WXSS for labels, current values, hints, and touch spacing. Then run:

```bash
node --test tests/navigation.test.js tests/recommender.test.js
node --test tests/wechat-config.test.js
node --check wechat/miniprogram/utils/navigation.js
node --check wechat/miniprogram/pages/quiz/quiz.js
```

Expected: all checks PASS.

- [ ] **Step 7: Commit the quiz flow**

```bash
git add wechat/miniprogram/utils/navigation.js \
  wechat/miniprogram/pages/quiz wechat/miniprogram/app.json \
  wechat/miniprogram/pages/home tests/navigation.test.js \
  tests/wechat-config.test.js
git commit -m "feat: add Mini Program recommendation quiz"
```

---

### Task 6: Render Results, Share Answers, and Copy Purchase Keywords

**Files:**
- Create: `wechat/miniprogram/utils/result.js`
- Create: `wechat/miniprogram/components/wine-card/wine-card.js`
- Create: `wechat/miniprogram/components/wine-card/wine-card.json`
- Create: `wechat/miniprogram/components/wine-card/wine-card.wxml`
- Create: `wechat/miniprogram/components/wine-card/wine-card.wxss`
- Create: `wechat/miniprogram/pages/result/result.js`
- Create: `wechat/miniprogram/pages/result/result.json`
- Create: `wechat/miniprogram/pages/result/result.wxml`
- Create: `wechat/miniprogram/pages/result/result.wxss`
- Create: `tests/result-utils.test.js`
- Modify: `wechat/miniprogram/app.json`
- Modify: `tests/wechat-config.test.js`

**Interfaces:**
- Consumes: generated `data/baijiu.js`.
- Consumes: `recommend()` and `RecommendationDataError`.
- Consumes: `decodeAnswers()` and `encodeAnswers()`.
- Produces: `buildResultView(ranked): ResultCard[]`.
- Produces: `purchaseKeyword(item): string`.
- Produces: `shareTitle(ranked): string`.
- Wine card emits: `buy` with `{ id, name }`.

- [ ] **Step 1: Write failing result utility tests**

Create `tests/result-utils.test.js`:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const data = require("../data/baijiu.json");
const { defaultAnswers, recommend } = require("../shared/recommender");
const {
  buildResultView,
  purchaseKeyword,
  shareTitle
} = require("../wechat/miniprogram/utils/result");

const ranked = recommend(data.items, defaultAnswers());

test("builds cards without changing ranking", () => {
  const cards = buildResultView(ranked);
  assert.deepEqual(cards.map(({ id }) => id), [
    "kouzijiao", "qinghua20", "shuanggou-shengfang"
  ]);
  assert.equal(cards[0].rank, 1);
  assert.match(cards[0].whyText, /预算匹配/);
});

test("builds the approved purchase search keyword", () => {
  assert.equal(purchaseKeyword(ranked[0].item), `${ranked[0].item.name} 京东搜索`);
});

test("uses the top wine in the share title", () => {
  assert.equal(shareTitle(ranked), `Wineer 推荐：${ranked[0].item.name}`);
});
```

- [ ] **Step 2: Run the test to verify the result module is missing**

Run:

```bash
node --test tests/result-utils.test.js
```

Expected: FAIL with missing `utils/result`.

- [ ] **Step 3: Implement result view helpers**

`utils/result.js`:

```js
function buildResultView(ranked) {
  return ranked.map(({ item, why, matchPercent }, index) => ({
    id: item.id,
    rank: index + 1,
    name: item.name,
    brand: item.brand,
    aroma: item.aroma,
    abv: item.abv,
    price: item.price,
    priceTier: item.priceTier,
    region: item.region,
    tasteText: item.taste.join("、"),
    highlight: item.highlight,
    caution: item.caution,
    matchPercent,
    whyText: why.length ? [...new Set(why)].slice(0, 4).join(" · ") : "综合条件最优"
  }));
}

function purchaseKeyword(item) {
  return `${item.name} 京东搜索`;
}

function shareTitle(ranked) {
  return ranked.length
    ? `Wineer 推荐：${ranked[0].item.name}`
    : "Wineer 白酒推荐";
}

module.exports = { buildResultView, purchaseKeyword, shareTitle };
```

- [ ] **Step 4: Implement the presentation-only wine card**

Declare properties for one `wine` card object and emit:

```js
Component({
  properties: {
    wine: Object
  },
  methods: {
    copyPurchaseKeyword() {
      this.triggerEvent("buy", {
        id: this.data.wine.id,
        name: this.data.wine.name
      });
    }
  }
});
```

The WXML shows rank, recommendation percentage, reason text, tags, highlight, taste, caution, and a button labeled `复制购买搜索词`.

- [ ] **Step 5: Implement result loading and error state**

`result.js` loads answers and recommendations exactly once:

```js
const wineData = require("../../data/baijiu");
const {
  RecommendationDataError,
  recommend
} = require("../../shared/recommender");
const {
  decodeAnswers,
  encodeAnswers
} = require("../../utils/navigation");
const {
  buildResultView,
  purchaseKeyword,
  shareTitle
} = require("../../utils/result");

Page({
  data: {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    posterPath: "",
    posterBusy: false
  },

  onLoad(options) {
    const answers = decodeAnswers(options);
    try {
      const ranked = recommend(wineData.items, answers, 3);
      this.setData({
        answers,
        ranked,
        wines: buildResultView(ranked),
        errorMessage: ""
      });
    } catch (error) {
      console.error("recommendation failed", error);
      this.setData({
        answers,
        ranked: [],
        wines: [],
        errorMessage: error instanceof RecommendationDataError
          ? "推荐数据异常，请稍后重试"
          : "生成推荐失败，请稍后重试"
      });
    }
  },

  restart() {
    wx.redirectTo({ url: "/pages/quiz/quiz" });
  },

  copyPurchaseKeyword(event) {
    const item = this.data.ranked
      .map(({ item }) => item)
      .find(({ id }) => id === event.detail.id);
    if (!item) {
      wx.showToast({ title: "酒款信息不存在", icon: "none" });
      return;
    }
    wx.setClipboardData({
      data: purchaseKeyword(item),
      success: () => wx.showToast({ title: "搜索词已复制", icon: "success" }),
      fail: error => {
        console.error("clipboard failed", error);
        wx.showToast({ title: "复制失败，请重试", icon: "none" });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: shareTitle(this.data.ranked),
      path: `/pages/result/result?${encodeAnswers(this.data.answers)}`
    };
  }
});
```

Result WXML has separate loading/content/error regions, uses `<wine-card>` for each result, includes `open-type="share"` on the share button, and binds card `buy` events to `copyPurchaseKeyword`.

- [ ] **Step 6: Register the result page**

Append `pages/result/result` to `app.json`. Update `tests/wechat-config.test.js` to expect the final ordered page list:

```js
assert.deepEqual(config.pages, [
  "pages/home/home",
  "pages/quiz/quiz",
  "pages/result/result"
]);
```

- [ ] **Step 7: Verify result behavior**

Run:

```bash
node --test tests/result-utils.test.js tests/navigation.test.js tests/recommender.test.js
node --test tests/wechat-config.test.js
node --check wechat/miniprogram/utils/result.js
node --check wechat/miniprogram/components/wine-card/wine-card.js
node --check wechat/miniprogram/pages/result/result.js
```

Expected: all checks PASS.

- [ ] **Step 8: Commit the native result flow**

```bash
git add wechat/miniprogram/utils/result.js \
  wechat/miniprogram/components/wine-card \
  wechat/miniprogram/pages/result wechat/miniprogram/app.json \
  tests/result-utils.test.js tests/wechat-config.test.js
git commit -m "feat: add native Mini Program results"
```

---

### Task 7: Add Local Analytics and Share Poster Generation

**Files:**
- Create: `wechat/miniprogram/utils/analytics.js`
- Create: `wechat/miniprogram/utils/poster.js`
- Create: `tests/analytics.test.js`
- Create: `tests/poster.test.js`
- Modify: `wechat/miniprogram/pages/home/home.js`
- Modify: `wechat/miniprogram/pages/quiz/quiz.js`
- Modify: `wechat/miniprogram/pages/result/result.js`
- Modify: `wechat/miniprogram/pages/result/result.wxml`
- Modify: `wechat/miniprogram/pages/result/result.wxss`

**Interfaces:**
- Produces: `track(event, payload, wxApi = wx, logger = console): boolean`.
- Storage key: `wineer_events`.
- Produces: `buildPosterModel(ranked): PosterModel`.
- Produces: `drawPoster(canvas, width, height, model): void`.
- Result page actions: `generatePoster()` and `savePoster()`.

- [ ] **Step 1: Write failing analytics tests**

Create `tests/analytics.test.js`:

```js
const assert = require("node:assert/strict");
const test = require("node:test");
const { track } = require("../wechat/miniprogram/utils/analytics");

test("appends an event and keeps the newest 200", () => {
  let stored = Array.from({ length: 200 }, (_, index) => ({ event: `old-${index}` }));
  const wxApi = {
    getStorageSync: () => stored,
    setStorageSync: (_key, value) => { stored = value; }
  };
  assert.equal(track("recommend", { count: 3 }, wxApi), true);
  assert.equal(stored.length, 200);
  assert.equal(stored.at(-1).event, "recommend");
  assert.equal(stored.at(-1).payload.count, 3);
});

test("reports Storage failures without throwing into the user flow", () => {
  const errors = [];
  const wxApi = {
    getStorageSync() { throw new Error("storage unavailable"); }
  };
  assert.equal(track("start_quiz", {}, wxApi, {
    error: (...args) => errors.push(args)
  }), false);
  assert.equal(errors.length, 1);
});
```

- [ ] **Step 2: Write failing poster-model and canvas-call tests**

Create `tests/poster.test.js`:

```js
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
```

- [ ] **Step 3: Run both tests to verify utilities are missing**

Run:

```bash
node --test tests/analytics.test.js tests/poster.test.js
```

Expected: FAIL with missing analytics and poster modules.

- [ ] **Step 4: Implement bounded local analytics**

`analytics.js`:

```js
const STORAGE_KEY = "wineer_events";
const MAX_EVENTS = 200;

function track(event, payload = {}, wxApi = wx, logger = console) {
  try {
    const existing = wxApi.getStorageSync(STORAGE_KEY);
    const events = Array.isArray(existing) ? existing : [];
    events.push({
      event,
      payload,
      ts: new Date().toISOString()
    });
    wxApi.setStorageSync(STORAGE_KEY, events.slice(-MAX_EVENTS));
    return true;
  } catch (error) {
    logger.error("analytics storage failed", error);
    return false;
  }
}

module.exports = { MAX_EVENTS, STORAGE_KEY, track };
```

Wire the matching event names:

- Home `startQuiz()`: `start_quiz`.
- Quiz `showResults()`: `recommend` with normalized answers.
- Result `onShareAppMessage()`: `share_click`.
- Result poster generation: `share_poster`.
- Result purchase copy: `buy_click`.
- Result restart: `restart`.

- [ ] **Step 5: Implement poster model and Canvas drawing**

`poster.js` exports a deterministic model:

```js
function buildPosterModel(ranked) {
  return {
    title: "Wineer 白酒推荐",
    subtitle: "按真实需求生成的 Top 3 选择",
    wines: ranked.map(({ item, matchPercent }, index) => ({
      id: item.id,
      rank: index + 1,
      name: item.name,
      details: `${item.aroma}型 · ${item.abv}度 · 约 ¥${item.price}`,
      matchPercent
    })),
    disclaimer: "价格为市场参考，非实时报价。请理性饮酒。"
  };
}
```

`drawPoster(canvas, width, height, model)` obtains a 2D context, scales for device pixel ratio in the page before drawing, paints a dark background, title, three rounded cards, wine details, percentages, and disclaimer. Keep text wrapping inside this module and limit each wine name to two lines.

- [ ] **Step 6: Implement result-page poster lifecycle**

Add a hidden Canvas 2D node to `result.wxml`:

```xml
<canvas
  id="posterCanvas"
  type="2d"
  class="poster-canvas"
/>
```

`generatePoster()` must:

1. Reject duplicate clicks while `posterBusy` is true.
2. Query `#posterCanvas` with `{ node: true, size: true }`.
3. Verify a canvas node exists.
4. Apply device pixel ratio dimensions.
5. Call `drawPoster`.
6. Call `wx.canvasToTempFilePath({ canvas, fileType: "png" })`.
7. Store the returned path and open `wx.previewImage`.
8. Reset `posterBusy` in both success and failure paths.
9. Log the underlying error and show `生成海报失败，请重试` on failure.

`savePoster()` must require a generated path, call `wx.saveImageToPhotosAlbum`, show success only from its success callback, and explain denied permission with a modal whose confirm action calls `wx.openSetting`.

- [ ] **Step 7: Run utility and page checks**

Run:

```bash
node --test tests/analytics.test.js tests/poster.test.js \
  tests/result-utils.test.js tests/navigation.test.js
node --check wechat/miniprogram/utils/analytics.js
node --check wechat/miniprogram/utils/poster.js
node --check wechat/miniprogram/pages/home/home.js
node --check wechat/miniprogram/pages/quiz/quiz.js
node --check wechat/miniprogram/pages/result/result.js
```

Expected: all checks PASS.

- [ ] **Step 8: Commit sharing support**

```bash
git add wechat/miniprogram/utils/analytics.js \
  wechat/miniprogram/utils/poster.js \
  wechat/miniprogram/pages/home/home.js \
  wechat/miniprogram/pages/quiz/quiz.js \
  wechat/miniprogram/pages/result \
  tests/analytics.test.js tests/poster.test.js
git commit -m "feat: add Mini Program sharing and analytics"
```

---

### Task 8: Complete Documentation, CI Coverage, and Manual Acceptance

**Files:**
- Create: `wechat/README.md`
- Modify: `README.md:1-93`
- Modify: `scripts/check.sh`
- Modify if needed: `.github/workflows/ci.yml`
- Regenerate: `web/data/baijiu.json`
- Regenerate: `web/shared/recommender.js`
- Regenerate: `wechat/miniprogram/data/baijiu.js`
- Regenerate: `wechat/miniprogram/shared/recommender.js`

**Interfaces:**
- Produces documented commands: `bash scripts/build.sh`, `bash scripts/check.sh`.
- Produces developer-tool import path: `/Users/yhe/Work/wineer/wechat`.
- Produces AppID replacement instruction for `wechat/project.config.json`.

- [ ] **Step 1: Expand `scripts/check.sh` to cover all Mini Program JavaScript**

After the existing checks, add explicit syntax checks:

```bash
node --check wechat/miniprogram/app.js
node --check wechat/miniprogram/utils/navigation.js
node --check wechat/miniprogram/utils/result.js
node --check wechat/miniprogram/utils/analytics.js
node --check wechat/miniprogram/utils/poster.js
node --check wechat/miniprogram/pages/home/home.js
node --check wechat/miniprogram/pages/quiz/quiz.js
node --check wechat/miniprogram/pages/result/result.js
node --check wechat/miniprogram/components/wine-card/wine-card.js
```

Keep the single `node --test tests/*.test.js` invocation so CI runs every Node test.

- [ ] **Step 2: Document the root workflow**

Add a `微信小程序 MVP` section to `README.md` containing:

```bash
bash scripts/build.sh
bash scripts/check.sh
```

Document that developers import `wechat/` in WeChat Developer Tools, replace `touristappid` with their AppID when available, and edit only `data/baijiu.json` for wine data.

Update the existing Mini Program checklist entry to completed only after the manual acceptance below passes.

- [ ] **Step 3: Write the focused Mini Program guide**

Create `wechat/README.md` with:

- Prerequisites: WeChat Developer Tools, Node.js 22, Python 3.
- Build and check commands from the repository root.
- Import directory: `wineer/wechat`.
- Placeholder AppID replacement path.
- Generated-file warning for `miniprogram/data/baijiu.js` and `miniprogram/shared/recommender.js`.
- Page map and supported MVP features.
- The exact manual acceptance checklist from Step 5.
- Explicit non-features: login, cloud backend, favorites, e-commerce jump, payment, live price.

- [ ] **Step 4: Run a clean generated-file and CI-equivalent check**

Run:

```bash
bash scripts/build.sh
bash scripts/check.sh
git diff --exit-code -- web/data/baijiu.json web/shared/recommender.js \
  wechat/miniprogram/data/baijiu.js wechat/miniprogram/shared/recommender.js
```

Expected: build succeeds, every test and syntax check passes, and generated files have no post-build diff.

- [ ] **Step 5: Perform manual acceptance in WeChat Developer Tools**

Import `/Users/yhe/Work/wineer/wechat` and verify:

1. Home renders and `我已满 18 岁，开始` opens the quiz.
2. All six sliders update their numeric value and explanatory text.
3. Default answers render exactly three different wines in this order: `kouzijiao`, `qinghua20`, `shuanggou-shengfang`.
4. The low-budget profile renders `jiujiang-shuangzheng`, `yubingshao`, `fenjiu-bofen`.
5. A shared result path reopens with the same six answers and ranking.
6. Every result card shows rank, recommendation percentage, tags, reason, taste, caution, and reference-price wording.
7. Copy purchase keyword places `<酒名> 京东搜索` on the clipboard and reports failure if clipboard access fails.
8. Poster generation displays a preview; saving handles success and denied album permission distinctly.
9. Restart returns to a fresh quiz.
10. Invalid result parameters normalize safely, and invalid wine data shows an error state without retry loops.

- [ ] **Step 6: Verify Web behavior after the Mini Program work**

Serve the Web app:

```bash
cd /Users/yhe/Work/wineer/web
python3 -m http.server 8000
```

Open `http://localhost:8000/` and verify age gate, sliders, the four golden recommendation profiles, result link sharing, poster download, and purchase link still work. Stop the server by its exact PID after verification.

- [ ] **Step 7: Commit documentation and final quality wiring**

```bash
git add README.md wechat/README.md scripts/check.sh .github/workflows/ci.yml \
  web/data/baijiu.json web/shared/recommender.js \
  wechat/miniprogram/data/baijiu.js wechat/miniprogram/shared/recommender.js
git commit -m "docs: document Wineer Mini Program workflow"
```

- [ ] **Step 8: Run final repository verification**

Run:

```bash
git status --short
bash scripts/build.sh
bash scripts/check.sh
git diff --exit-code
```

Expected: no uncommitted changes, all checks PASS, and the build is reproducible.
