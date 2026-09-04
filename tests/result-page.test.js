const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const defaultAnswers = {
  budget: 4,
  occasion: 4,
  softness: 3,
  flavorWeight: 4,
  brandFace: 4,
  adventure: 3
};
const topWineName = "口子窖 10年兼香型50度";

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

function loadComponentDefinition(relativePath) {
  const modulePath = require.resolve(relativePath);
  delete require.cache[modulePath];

  let definition;
  global.Component = component => {
    definition = component;
  };

  try {
    require(relativePath);
  } finally {
    delete global.Component;
    delete require.cache[modulePath];
  }

  return definition;
}

function createPageContext(definition, initialData = {}) {
  return {
    ...definition,
    data: { ...initialData },
    setData(nextData) {
      this.data = { ...this.data, ...nextData };
    }
  };
}

function withMockedModules(mocks, run) {
  const originals = [];

  try {
    for (const [relativePath, exports] of Object.entries(mocks)) {
      const modulePath = require.resolve(path.join(root, relativePath));
      originals.push([modulePath, require.cache[modulePath]]);
      require.cache[modulePath] = {
        id: modulePath,
        filename: modulePath,
        loaded: true,
        exports
      };
    }

    return run();
  } finally {
    for (const [modulePath, original] of originals.reverse()) {
      if (original) require.cache[modulePath] = original;
      else delete require.cache[modulePath];
    }
  }
}

function withMutedConsoleError(run) {
  const original = console.error;
  console.error = () => {};
  try {
    return run();
  } finally {
    console.error = original;
  }
}

test("result page restores answers and builds ranked result cards", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  });

  resultPage.onLoad.call(page, Object.fromEntries(new URLSearchParams(
    "budget=4&occasion=4&softness=3&flavorWeight=4&brandFace=4&adventure=3"
  )));

  assert.deepEqual(page.data.answers, defaultAnswers);
  assert.equal(page.data.errorMessage, "");
  assert.equal(page.data.isLoading, false);
  assert.deepEqual(page.data.wines.map(({ id }) => id), [
    "kouzijiao",
    "qinghua20",
    "shuanggou-shengfang"
  ]);
  assert.equal(page.data.wines[0].matchPercent, page.data.ranked[0].matchPercent);
});

test("result page shows an explicit message when recommendation data is invalid", () => {
  const resultPage = withMockedModules({
    "wechat/miniprogram/data/baijiu.js": { items: null }
  }, () => loadPageDefinition("../wechat/miniprogram/pages/result/result"));
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [{ item: { id: "stale" } }],
    wines: [{ id: "stale" }],
    errorMessage: "",
    isLoading: true
  });

  withMutedConsoleError(() => resultPage.onLoad.call(page, {}));

  assert.equal(page.data.isLoading, false);
  assert.equal(page.data.errorMessage, "推荐数据异常，请稍后重试");
  assert.deepEqual(page.data.ranked, []);
  assert.deepEqual(page.data.wines, []);
});

test("result page shows a generic message when recommendation generation throws", () => {
  const RecommendationDataError = require("../shared/recommender").RecommendationDataError;
  const resultPage = withMockedModules({
    "wechat/miniprogram/shared/recommender.js": {
      RecommendationDataError,
      recommend() {
        throw new Error("boom");
      }
    }
  }, () => loadPageDefinition("../wechat/miniprogram/pages/result/result"));
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  });

  withMutedConsoleError(() => resultPage.onLoad.call(page, {}));

  assert.equal(page.data.errorMessage, "生成推荐失败，请稍后重试");
  assert.equal(page.data.isLoading, false);
});

test("result page shares the top wine and the normalized answer query", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  });

  resultPage.onLoad.call(page, {});

  assert.deepEqual(resultPage.onShareAppMessage.call(page), {
    title: `Wineer 推荐：${topWineName}`,
    path: "/pages/result/result?budget=4&occasion=4&softness=3&flavorWeight=4&brandFace=4&adventure=3"
  });
});

test("result page restarts the quiz flow", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const redirects = [];

  global.wx = {
    redirectTo(payload) {
      redirects.push(payload);
    }
  };

  try {
    resultPage.restart();
  } finally {
    delete global.wx;
  }

  assert.deepEqual(redirects, [{ url: "/pages/quiz/quiz" }]);
});

test("result page copies the exact purchase keyword and explains the next step", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  });
  const clipboard = [];
  const toasts = [];

  resultPage.onLoad.call(page, {});
  global.wx = {
    setClipboardData({ data, success }) {
      clipboard.push(data);
      success();
    },
    showToast(payload) {
      toasts.push(payload);
    }
  };

  try {
    resultPage.copyPurchaseKeyword.call(page, {
      detail: { id: page.data.ranked[0].item.id }
    });
  } finally {
    delete global.wx;
  }

  assert.deepEqual(clipboard, [`${topWineName} 京东搜索`]);
  assert.deepEqual(toasts, [{ title: "已复制，请打开京东搜索", icon: "none" }]);
});

test("result page reports clipboard failures without pretending success", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  });
  const toasts = [];

  resultPage.onLoad.call(page, {});
  global.wx = {
    setClipboardData({ fail }) {
      fail(new Error("clipboard unavailable"));
    },
    showToast(payload) {
      toasts.push(payload);
    }
  };

  try {
    withMutedConsoleError(() => resultPage.copyPurchaseKeyword.call(page, {
      detail: { id: page.data.ranked[0].item.id }
    }));
  } finally {
    delete global.wx;
  }

  assert.deepEqual(toasts, [{ title: "复制失败，请重试", icon: "none" }]);
});

test("result page reports a missing wine instead of copying stale data", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  });
  let attemptedCopy = false;
  const toasts = [];

  resultPage.onLoad.call(page, {});
  global.wx = {
    setClipboardData() {
      attemptedCopy = true;
    },
    showToast(payload) {
      toasts.push(payload);
    }
  };

  try {
    resultPage.copyPurchaseKeyword.call(page, { detail: { id: "missing" } });
  } finally {
    delete global.wx;
  }

  assert.equal(attemptedCopy, false);
  assert.deepEqual(toasts, [{ title: "酒款信息不存在", icon: "none" }]);
});

test("wine card emits a buy event with the wine identity", () => {
  const wineCard = loadComponentDefinition("../wechat/miniprogram/components/wine-card/wine-card");
  const events = [];

  wineCard.methods.copyPurchaseKeyword.call({
    data: {
      wine: {
        id: "kouzijiao",
        name: "口子窖 兼香518 41度"
      }
    },
    triggerEvent(name, detail) {
      events.push([name, detail]);
    }
  });

  assert.deepEqual(events, [[
    "buy",
    { id: "kouzijiao", name: "口子窖 兼香518 41度" }
  ]]);
});
