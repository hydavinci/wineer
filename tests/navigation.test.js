const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { DIMENSIONS, defaultAnswers } = require("../shared/recommender");
const { createWx, setPageData } = require("./helpers/miniprogram");

test.beforeEach(() => { global.wx = createWx(); });
test.afterEach(() => { delete global.wx; });

const root = path.resolve(__dirname, "..");

function loadPageDefinition(relativePath) {
  const modulePath = require.resolve(relativePath);
  delete require.cache[modulePath];

  let definition;
  global.Page = page => {
    definition = page;
  };

  try {
    require(relativePath);
  } finally {
    delete global.Page;
    delete require.cache[modulePath];
  }

  return definition;
}

function createPageContext(definition, initialData = {}) {
  return {
    ...definition,
    data: { ...structuredClone(definition.data), agePending: false, ...initialData },
    setData: setPageData
  };
}

test("round-trips all six answer values", () => {
  const {
    decodeAnswers,
    encodeAnswers
  } = require("../wechat/miniprogram/utils/navigation");

  const answers = {
    budget: 1,
    occasion: 2,
    softness: 3,
    flavorWeight: 4,
    brandFace: 5,
    adventure: 6
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
  const { decodeAnswers } = require("../wechat/miniprogram/utils/navigation");

  assert.deepEqual(decodeAnswers({ budget: "99", occasion: "bad" }), {
    ...defaultAnswers(),
    budget: 10
  });
});

test("quiz page loads all shared dimensions with default values and hints", () => {
  const quizPage = loadPageDefinition("../wechat/miniprogram/pages/quiz/quiz");
  const page = createPageContext(quizPage, {
    answers: defaultAnswers(),
    dimensions: []
  });

  quizPage.onLoad.call(page);

  assert.deepEqual(page.data.answers, defaultAnswers());
  assert.deepEqual(
    page.data.dimensions,
    DIMENSIONS.map(dimension => ({
      key: dimension.key,
      title: dimension.title,
      left: dimension.left,
      right: dimension.right,
      value: defaultAnswers()[dimension.key],
      hint: dimension.hint(defaultAnswers()[dimension.key])
    }))
  );
});

test("quiz page updates a slider with normalized values and refreshed hints", () => {
  const quizPage = loadPageDefinition("../wechat/miniprogram/pages/quiz/quiz");
  const page = createPageContext(quizPage, {
    answers: defaultAnswers(),
    dimensions: []
  });

  quizPage.onLoad.call(page);
  quizPage.onSliderChange.call(page, {
    currentTarget: { dataset: { key: "softness" } },
    detail: { value: 8.6 }
  });

  assert.equal(page.data.answers.softness, 9);
  assert.equal(
    page.data.dimensions.find(dimension => dimension.key === "softness").hint,
    DIMENSIONS.find(dimension => dimension.key === "softness").hint(9)
  );
  assert.equal(page.data.answers.budget, defaultAnswers().budget);
});

test("quiz redirects to the encoded result route so restart keeps the page stack bounded", () => {
  const quizPage = loadPageDefinition("../wechat/miniprogram/pages/quiz/quiz");
  const page = createPageContext(quizPage, {
    answers: {
      budget: 1,
      occasion: 2,
      softness: 3,
      flavorWeight: 4,
      brandFace: 5,
      adventure: 6
    }
  });
  const navigations = [];
  let stored = [];

  global.wx = {
    getStorageSync() {
      return stored;
    },
    setStorageSync(_key, value) {
      stored = value;
    },
    navigateTo({ url }) {
      navigations.push(["navigateTo", url]);
    },
    redirectTo({ url }) {
      navigations.push(["redirectTo", url]);
    }
  };
  global.getCurrentPages = () => [{ route: "pages/quiz/quiz" }];

  try {
    quizPage.showResults.call(page);
  } finally {
    delete global.wx;
    delete global.getCurrentPages;
  }

  assert.deepEqual(navigations, [[
    "redirectTo",
    "/pages/result/result?budget=1&occasion=2&softness=3&flavorWeight=4&brandFace=5&adventure=6"
  ]]);
  // Quiz -> result and result -> fresh quiz both replace the current layer,
  // keeping the native stack at [home, current page] while Back still returns home.
  assert.deepEqual(stored.at(-1), {
    id: stored.at(-1).id,
    schemaVersion: 1,
    event: "recommend_attempt",
    payload: {
      answers: {
        budget: 1,
        occasion: 2,
        softness: 3,
        flavorWeight: 4,
        brandFace: 5,
        adventure: 6
      }
    },
    path: "/pages/quiz/quiz",
    ts: stored.at(-1).ts
  });
});

test("quiz ignores duplicate result taps while redirect navigation is in flight", () => {
  const quizPage = loadPageDefinition("../wechat/miniprogram/pages/quiz/quiz");
  const page = createPageContext(quizPage, {
    answers: defaultAnswers(),
    resultBusy: false
  });
  let navigationCalls = 0;
  let stored = [];

  global.wx = {
    getStorageSync() {
      return stored;
    },
    setStorageSync(_key, value) {
      stored = value;
    },
    navigateTo() {
      navigationCalls += 1;
    },
    redirectTo() {
      navigationCalls += 1;
    }
  };

  try {
    quizPage.showResults.call(page);
    quizPage.showResults.call(page);
  } finally {
    delete global.wx;
  }

  assert.equal(navigationCalls, 1);
  assert.equal(page.data.resultBusy, true);
  assert.equal(stored.filter(({ event }) => event === "recommend_attempt").length, 1);
});

test("quiz resets the result busy state and reports redirect failures", () => {
  const quizPage = loadPageDefinition("../wechat/miniprogram/pages/quiz/quiz");
  const page = createPageContext(quizPage, {
    answers: defaultAnswers(),
    resultBusy: false
  });
  const toasts = [];
  const originalConsoleError = console.error;
  let stored = [];

  global.wx = {
    getStorageSync() {
      return stored;
    },
    setStorageSync(_key, value) {
      stored = value;
    },
    navigateTo(options) {
      options.fail?.(new Error("navigation failed"));
    },
    redirectTo(options) {
      options.fail?.(new Error("navigation failed"));
    },
    showToast(payload) {
      toasts.push(payload);
    }
  };
  console.error = () => {};

  try {
    quizPage.showResults.call(page);
  } finally {
    console.error = originalConsoleError;
    delete global.wx;
  }

  assert.equal(page.data.resultBusy, false);
  assert.deepEqual(toasts, [{ title: "跳转失败，请重试", icon: "none" }]);
});

test("quiz WXML wires continuous slider updates and disables a busy submit", () => {
  const source = fs.readFileSync(
    path.join(root, "wechat/miniprogram/pages/quiz/quiz.wxml"),
    "utf8"
  );
  const slider = source.match(/<slider[\s\S]*?\/>/)?.[0] || "";
  const submit = source.match(/<button\b[^>]*\bbindtap="showResults"[^>]*>/)?.[0] || "";

  assert.match(slider, /\bbindchanging="onSliderChange"/);
  assert.match(submit, /\bloading="{{resultBusy}}"/);
  assert.match(submit, /\bdisabled="{{resultBusy}}"/);
});

test("home page starts the quiz route", () => {
  const homePage = loadPageDefinition("../wechat/miniprogram/pages/home/home");
  const urls = [];
  const api = createWx();

  global.wx = {
    ...api,
    navigateTo({ url }) {
      urls.push(url);
    }
  };

  try {
    homePage.startQuiz.call(createPageContext(homePage));
  } finally {
    delete global.wx;
  }

  assert.deepEqual(urls, ["/pages/quiz/quiz?from=home"]);
  const stored = api.storage.get("wineer_events");
  assert.equal(stored.at(-1).event, "start_quiz");
  assert.deepEqual(stored.at(-1).payload, { fromShare: false });
});
