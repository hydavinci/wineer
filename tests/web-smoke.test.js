const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const data = require("../data/baijiu.json");
const { DIMENSIONS } = require("../shared/recommender");

const root = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(root, "web/index.html"), "utf8");
const sharedSource = fs.readFileSync(path.join(root, "web/shared/recommender.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "web/app.js"), "utf8");
const wineIdsByName = new Map(data.items.map((item) => [item.name, item.id]));

test("Web bundle preserves the default ranking through the shared core", async () => {
  const context = await bootWebBundle();

  context.Wineer.startQuiz();
  context.Wineer.recommend();

  assert.equal(context.sharedRecommendCalls, 1);
  assert.doesNotMatch(context.document.getElementById("resultArea").innerHTML, /推荐指数\s*\d+%/);
  assert.match(context.document.getElementById("resultArea").innerHTML, /优先推荐/);
  assert.deepEqual(extractRenderedWineIds(context), [
    "kouzijiao",
    "fenjiu-laobaifen10",
    "shuanggou-shengfang"
  ]);
});

test("Web bundle restores shared answer parameters", async () => {
  const context = await bootWebBundle(
    "?w=1&budget=0&occasion=1&softness=2&flavorWeight=2&brandFace=1&adventure=1"
  );

  context.Wineer.startQuiz();
  context.Wineer.recommend();

  assert.equal(context.sharedRecommendCalls, 1);
  assert.deepEqual(extractRenderedWineIds(context), [
    "jiujiang-shuangzheng",
    "yubingshao",
    "fenjiu-huanggaibofen"
  ]);
});

test("Web quiz renders six sliders and refreshes value and hint text", async () => {
  const context = await bootWebBundle();

  context.Wineer.startQuiz();
  const quiz = context.document.getElementById("quiz");
  const questionHtml = context.document.getElementById("questionArea").innerHTML;
  assert.equal(quiz.classList.contains("active"), true);
  assert.equal([...questionHtml.matchAll(/type="range"/g)].length, 6);

  const values = {
    budget: 0,
    occasion: 2,
    softness: 4,
    flavorWeight: 6,
    brandFace: 8,
    adventure: 10
  };
  for (const [key, value] of Object.entries(values)) {
    assert.match(questionHtml, new RegExp(`Wineer\\.setDim\\('${key}', this\\.value\\)`));
    context.Wineer.setDim(key, value);
    assert.equal(context.document.getElementById(`${key}Value`).textContent, value);
    assert.equal(
      context.document.getElementById(`${key}Hint`).textContent,
      DIMENSIONS.find(dimension => dimension.key === key).hint(value)
    );
  }
});

for (const profile of [
  {
    name: "business gift",
    answers: { budget: 9, occasion: 10, softness: 6, flavorWeight: 7, brandFace: 10, adventure: 2 },
    ids: ["gujing-gu20", "guojiao1573", "wuliangye-pujing"]
  },
  {
    name: "adventurous",
    answers: { budget: 6, occasion: 3, softness: 9, flavorWeight: 10, brandFace: 1, adventure: 10 },
    ids: ["hengshui-gufa20", "dongjiu-baicao", "dongjiu"]
  }
]) {
  test(`Web bundle preserves the ${profile.name} ranking`, async () => {
    const context = await bootWebBundle();

    context.Wineer.startQuiz();
    for (const [key, value] of Object.entries(profile.answers)) {
      context.Wineer.setDim(key, value);
    }
    context.Wineer.recommend();

    assert.deepEqual(extractRenderedWineIds(context), profile.ids);
  });
}

test("Web result sharing copies the normalized answer URL", async () => {
  const context = await bootWebBundle();

  context.Wineer.startQuiz();
  context.Wineer.recommend();
  await context.Wineer.shareResult();

  assert.equal(context.clipboardWrites.length, 1);
  const shared = new URL(context.clipboardWrites[0]);
  assert.equal(shared.searchParams.get("w"), "1");
  assert.deepEqual(
    Object.fromEntries(DIMENSIONS.map(({ key }) => [key, Number(shared.searchParams.get(key))])),
    { budget: 4, occasion: 4, softness: 3, flavorWeight: 4, brandFace: 4, adventure: 3 }
  );
  assert.equal(context.alerts.at(-1), "分享链接已复制");
});

test("Web result renders purchase links and downloads a PNG poster", async () => {
  const context = await bootWebBundle();

  context.Wineer.startQuiz();
  context.Wineer.recommend();

  const expectedPurchaseUrl = "https://search.jd.com/Search?keyword="
    + encodeURIComponent("口子窖 10年兼香型50度");
  assert.match(
    context.document.getElementById("resultArea").innerHTML,
    new RegExp(expectedPurchaseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  );

  context.Wineer.downloadPoster();

  const download = context.createdElements.find(({ tagName }) => tagName === "a");
  assert.equal(download.download, "wineer-recommendation.png");
  assert.match(download.href, /^data:image\/png;base64,/);
  assert.equal(download.clicked, true);
});

test("Web index loads the shared recommender before the app bundle", () => {
  const scripts = [...indexHtml.matchAll(/<script\s+src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(scripts.slice(-2), [
    "shared/recommender.js?v=0.5",
    "app.js?v=0.5"
  ]);
});

test("Web bundle falls back when the primary data response is not ok", async () => {
  const context = await bootWebBundle("", {
    fetchPlan: [
      () => createResponse({ items: data.items }, { ok: false, status: 500 }),
      () => createResponse({ items: data.items })
    ]
  });

  context.Wineer.startQuiz();
  context.Wineer.recommend();

  assert.equal(context.sharedRecommendCalls, 1);
  assert.deepEqual(stripCacheBusters(context.fetchUrls), [
    "data/baijiu.json",
    "baijiu.json"
  ]);
  assert.deepEqual(extractRenderedWineIds(context), [
    "kouzijiao",
    "fenjiu-laobaifen10",
    "shuanggou-shengfang"
  ]);
});

test("Web bundle falls back when the primary payload is invalid", async () => {
  const context = await bootWebBundle("", {
    fetchPlan: [
      () => createResponse({ items: null }),
      () => createResponse({ items: data.items })
    ]
  });

  assert.doesNotThrow(() => context.Wineer.startQuiz());
  context.Wineer.recommend();

  assert.equal(context.sharedRecommendCalls, 1);
  assert.deepEqual(stripCacheBusters(context.fetchUrls), [
    "data/baijiu.json",
    "baijiu.json"
  ]);
  assert.deepEqual(extractRenderedWineIds(context), [
    "kouzijiao",
    "fenjiu-laobaifen10",
    "shuanggou-shengfang"
  ]);
});

test("Web bundle does not recursively retry loading after both data paths fail", async () => {
  const primaryError = new Error("primary failed");
  const fallbackError = new Error("fallback failed");
  const context = await bootWebBundle("", {
    fetchPlan: [
      () => Promise.reject(primaryError),
      () => Promise.reject(fallbackError),
      () => new Promise(() => {})
    ]
  });

  assert.deepEqual(stripCacheBusters(context.fetchUrls), [
    "data/baijiu.json",
    "baijiu.json"
  ]);
  assert.equal(context.consoleErrors.length, 2);
  assert.equal(context.alerts.at(-1), "数据加载失败，请稍后再试");

  const beforeRecommend = context.fetchUrls.length;
  context.Wineer.recommend();
  await flushAsync();

  assert.equal(context.fetchUrls.length, beforeRecommend);
  assert.equal(context.alerts.at(-1), "数据尚未加载完成，请稍后重试");
});

async function bootWebBundle(query = "", options = {}) {
  const context = createBrowserContext(query, options.fetchPlan);
  vm.createContext(context);

  vm.runInContext(sharedSource, context, { filename: "web/shared/recommender.js" });
  const sharedRecommend = context.WineerRecommender.recommend;
  context.WineerRecommender.recommend = (...args) => {
    context.sharedRecommendCalls += 1;
    return sharedRecommend(...args);
  };

  vm.runInContext(`${appSource}\n;globalThis.Wineer = Wineer;`, context, { filename: "web/app.js" });
  await flushAsync();
  return context;
}

function createBrowserContext(query, fetchPlan = []) {
  const alerts = [];
  const prompts = [];
  const fetchUrls = [];
  const consoleErrors = [];
  const clipboardWrites = [];
  const createdElements = [];
  const localStorageState = new Map();
  const elements = new Map();
  const location = new URL(`https://wineer.example/${query.replace(/^\?/, "?")}`);

  const createElementNode = (id = "") => ({
    id,
    tagName: "",
    clicked: false,
    innerHTML: "",
    textContent: "",
    classList: {
      values: new Set(),
      add(value) {
        this.values.add(value);
      },
      remove(value) {
        this.values.delete(value);
      },
      contains(value) {
        return this.values.has(value);
      }
    },
    click() {
      this.clicked = true;
    },
    getContext() {
      return createCanvasContext();
    },
    toDataURL() {
      return "data:image/png;base64,";
    }
  });

  const ensureElement = (id) => {
    if (!elements.has(id)) {
      elements.set(id, createElementNode(id));
    }
    return elements.get(id);
  };

  for (const id of ["ageGate", "quiz", "result", "questionArea", "resultArea"]) {
    ensureElement(id);
  }
  ensureElement("ageGate").classList.add("screen");
  ensureElement("ageGate").classList.add("active");
  ensureElement("quiz").classList.add("screen");
  ensureElement("result").classList.add("screen");

  const plannedFetches = [...fetchPlan];
  const fetch = async (url) => {
    fetchUrls.push(String(url));
    const next = plannedFetches.length > 0
      ? plannedFetches.shift()
      : () => createResponse({ items: data.items });
    if (typeof next === "function") return next(url);
    if (next instanceof Error) throw next;
    return next;
  };

  const context = {
    URL,
    URLSearchParams,
    Blob,
    Date,
    JSON,
    Math,
    Promise,
    console: {
      error: (...args) => {
        consoleErrors.push(args);
      },
      log() {},
      warn() {},
      info() {}
    },
    window: null,
    self: null,
    globalThis: null,
    location,
    navigator: {
      clipboard: {
        async writeText(value) {
          clipboardWrites.push(value);
        }
      },
      sendBeacon: undefined,
      share: undefined
    },
    document: {
      getElementById: ensureElement,
      querySelectorAll(selector) {
        if (selector === ".screen") {
          return ["ageGate", "quiz", "result"].map((id) => ensureElement(id));
        }
        return [];
      },
      createElement(tagName) {
        const element = createElementNode(tagName);
        element.tagName = tagName;
        createdElements.push(element);
        return element;
      }
    },
    localStorage: {
      getItem(key) {
        return localStorageState.has(key) ? localStorageState.get(key) : null;
      },
      setItem(key, value) {
        localStorageState.set(key, String(value));
      }
    },
    fetch,
    alert(message) {
      alerts.push(message);
    },
    prompt(message, value) {
      prompts.push([message, value]);
      return value;
    },
    setTimeout,
    clearTimeout,
    sharedRecommendCalls: 0,
    alerts,
    prompts,
    fetchUrls,
    consoleErrors,
    clipboardWrites,
    createdElements
  };

  context.window = context;
  context.self = context;
  context.globalThis = context;
  context.window.scrollTo = () => {};
  return context;
}

function createResponse(payload, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    async json() {
      return payload;
    }
  };
}

function createCanvasContext() {
  return {
    fillStyle: "",
    font: "",
    textAlign: "",
    fillRect() {},
    fillText() {},
    beginPath() {},
    moveTo() {},
    arcTo() {},
    closePath() {},
    fill() {},
    stroke() {},
    createLinearGradient() {
      return { addColorStop() {} };
    },
    measureText(text) {
      return { width: String(text).length * 10 };
    }
  };
}

function extractRenderedWineIds(context) {
  const html = context.document.getElementById("resultArea").innerHTML;
  return [...html.matchAll(/<div class="top-name">([^<]+)<\/div>/g)].map((match) => {
    const id = wineIdsByName.get(match[1]);
    assert.ok(id, `Unknown wine rendered: ${match[1]}`);
    return id;
  });
}

function stripCacheBusters(urls) {
  return urls.map((url) => String(url).replace(/\?.*$/, ""));
}

async function flushAsync(turns = 5) {
  for (let index = 0; index < turns; index += 1) {
    await new Promise((resolve) => setImmediate(resolve));
  }
}
