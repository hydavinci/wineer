const assert = require("node:assert/strict");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const wineData = require("../wechat/miniprogram/data/baijiu");
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

function createCanvas() {
  const context = {
    beginPath() {},
    closePath() {},
    fill() {},
    fillRect() {},
    fillText() {},
    lineTo() {},
    measureText(text) {
      return { width: String(text).length * 20 };
    },
    moveTo() {},
    quadraticCurveTo() {},
    scaleCalls: [],
    scale(...args) {
      this.scaleCalls.push(args);
    }
  };

  return {
    context,
    getContext() {
      return context;
    }
  };
}

function createStoredWx(overrides = {}) {
  let stored = [];
  return {
    api: {
      getStorageSync() {
        return stored;
      },
      setStorageSync(_key, value) {
        stored = value;
      },
      ...overrides
    },
    events() {
      return stored;
    }
  };
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

test("result page classifies malformed result view data as a recommendation data error", () => {
  const resultPage = withMockedModules({
    "wechat/miniprogram/data/baijiu.js": {
      ...wineData,
      items: wineData.items.map(item => (
        item.id === "kouzijiao"
          ? { ...item, taste: undefined }
          : item
      ))
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

  const wxStorage = createStoredWx();
  global.wx = wxStorage.api;

  try {
    resultPage.onLoad.call(page, {});

    assert.deepEqual(resultPage.onShareAppMessage.call(page), {
      title: `Wineer 推荐：${topWineName}`,
      path: "/pages/result/result?budget=4&occasion=4&softness=3&flavorWeight=4&brandFace=4&adventure=3"
    });
  } finally {
    delete global.wx;
  }

  assert.equal(wxStorage.events().at(-1).event, "share_click");
  assert.deepEqual(wxStorage.events().at(-1).payload, { mode: "mini_program" });
});

test("result page redirects to a fresh quiz, completing the bounded restart pair", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const redirects = [];
  const wxStorage = createStoredWx({
    redirectTo(payload) {
      redirects.push(payload);
    }
  });

  global.wx = wxStorage.api;

  try {
    resultPage.restart();
  } finally {
    delete global.wx;
  }

  assert.deepEqual(redirects, [{ url: "/pages/quiz/quiz" }]);
  // redirectTo replaces the result layer; paired with quiz -> result redirect,
  // repeated restarts cannot retain stale quiz or result pages.
  assert.equal(wxStorage.events().at(-1).event, "restart");
  assert.deepEqual(wxStorage.events().at(-1).payload, { from: "result" });
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
  const wxStorage = createStoredWx({
    setClipboardData({ data, success }) {
      clipboard.push(data);
      success();
    },
    showToast(payload) {
      toasts.push(payload);
    }
  });
  global.wx = wxStorage.api;

  try {
    resultPage.copyPurchaseKeyword.call(page, {
      detail: { id: page.data.ranked[0].item.id }
    });
  } finally {
    delete global.wx;
  }

  assert.deepEqual(clipboard, [`${topWineName} 京东搜索`]);
  assert.deepEqual(toasts, [{ title: "已复制，请打开京东搜索", icon: "none" }]);
  assert.deepEqual(wxStorage.events().at(-1).payload, {
    id: "kouzijiao",
    name: topWineName,
    answers: defaultAnswers
  });
  assert.equal(wxStorage.events().at(-1).event, "buy_click");
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

test("result page generates a DPR-scaled poster, previews it, and records the event", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true,
    posterBusy: false,
    posterPath: ""
  });
  const canvas = createCanvas();
  const previews = [];
  const wxStorage = createStoredWx({
    getWindowInfo() {
      return { pixelRatio: 3 };
    },
    canvasToTempFilePath({ canvas: suppliedCanvas, fileType, success }) {
      assert.equal(suppliedCanvas, canvas);
      assert.equal(fileType, "png");
      success({ tempFilePath: "poster.png" });
    },
    previewImage(payload) {
      previews.push(payload);
    }
  });

  page.createSelectorQuery = () => ({
    select(selector) {
      assert.equal(selector, "#posterCanvas");
      return this;
    },
    fields(options) {
      assert.deepEqual(options, { node: true, size: true });
      return this;
    },
    exec(callback) {
      callback([{ node: canvas, width: 300, height: 480 }]);
    }
  });

  resultPage.onLoad.call(page, {});
  global.wx = wxStorage.api;

  try {
    resultPage.generatePoster.call(page);
  } finally {
    delete global.wx;
  }

  assert.equal(canvas.width, 853);
  assert.equal(canvas.height, 1365);
  assert.deepEqual(canvas.context.scaleCalls, [[1365 / 480, 1365 / 480]]);
  assert.equal(page.data.posterPath, "poster.png");
  assert.equal(page.data.posterBusy, false);
  assert.equal(previews.length, 1);
  assert.equal(previews[0].current, "poster.png");
  assert.deepEqual(previews[0].urls, ["poster.png"]);
  assert.equal(wxStorage.events().at(-1).event, "share_poster");
  assert.deepEqual(wxStorage.events().at(-1).payload, {
    top3: ["kouzijiao", "qinghua20", "shuanggou-shengfang"]
  });
});

test("result page rejects duplicate poster generation while busy", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  let queried = false;
  const page = createPageContext(resultPage, {
    posterBusy: true
  });
  page.createSelectorQuery = () => {
    queried = true;
  };

  resultPage.generatePoster.call(page);

  assert.equal(queried, false);
});

test("result page resets poster state and explains generation failures", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    ranked: [],
    posterBusy: false,
    posterPath: ""
  });
  const toasts = [];
  const wxStorage = createStoredWx({
    showToast(payload) {
      toasts.push(payload);
    }
  });
  page.createSelectorQuery = () => ({
    select() {
      return this;
    },
    fields() {
      return this;
    },
    exec(callback) {
      callback([]);
    }
  });
  global.wx = wxStorage.api;

  try {
    withMutedConsoleError(() => resultPage.generatePoster.call(page));
  } finally {
    delete global.wx;
  }

  assert.equal(page.data.posterBusy, false);
  assert.deepEqual(toasts, [{ title: "生成海报失败，请重试", icon: "none" }]);
});

test("result page reports poster preview failures", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, {
    ranked: [],
    posterBusy: false,
    posterPath: ""
  });
  const canvas = createCanvas();
  const toasts = [];
  let previewOptions;
  const wxStorage = createStoredWx({
    getWindowInfo() {
      return { pixelRatio: 1 };
    },
    canvasToTempFilePath({ success }) {
      success({ tempFilePath: "poster.png" });
    },
    previewImage(options) {
      previewOptions = options;
    },
    showToast(payload) {
      toasts.push(payload);
    }
  });
  page.createSelectorQuery = () => ({
    select() {
      return this;
    },
    fields() {
      return this;
    },
    exec(callback) {
      callback([{ node: canvas, width: 300, height: 480 }]);
    }
  });
  global.wx = wxStorage.api;

  try {
    resultPage.generatePoster.call(page);
    withMutedConsoleError(() => previewOptions.fail(new Error("preview unavailable")));
  } finally {
    delete global.wx;
  }

  assert.equal(page.data.posterBusy, false);
  assert.deepEqual(toasts, [{ title: "生成海报失败，请重试", icon: "none" }]);
});

test("result page requires a generated poster before saving", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, { posterPath: "" });
  const toasts = [];
  global.wx = {
    showToast(payload) {
      toasts.push(payload);
    }
  };

  try {
    withMutedConsoleError(() => resultPage.savePoster.call(page));
  } finally {
    delete global.wx;
  }

  assert.deepEqual(toasts, [{ title: "请先生成海报", icon: "none" }]);
});

test("result page reports successful album saves only from the success callback", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, { posterPath: "poster.png" });
  const toasts = [];
  global.wx = {
    saveImageToPhotosAlbum({ filePath, success }) {
      assert.equal(filePath, "poster.png");
      success();
    },
    showToast(payload) {
      toasts.push(payload);
    }
  };

  try {
    withMutedConsoleError(() => resultPage.savePoster.call(page));
  } finally {
    delete global.wx;
  }

  assert.deepEqual(toasts, [{ title: "已保存到相册", icon: "success" }]);
});

test("result page explains denied album permission and opens settings on confirmation", () => {
  const resultPage = loadPageDefinition("../wechat/miniprogram/pages/result/result");
  const page = createPageContext(resultPage, { posterPath: "poster.png" });
  const modals = [];
  let openedSettings = 0;
  global.wx = {
    saveImageToPhotosAlbum({ fail }) {
      fail({ errMsg: "saveImageToPhotosAlbum:fail auth deny" });
    },
    showModal(payload) {
      modals.push(payload);
      payload.success({ confirm: true });
    },
    openSetting() {
      openedSettings += 1;
    }
  };

  try {
    withMutedConsoleError(() => resultPage.savePoster.call(page));
  } finally {
    delete global.wx;
  }

  assert.equal(modals.length, 1);
  assert.match(modals[0].content, /相册权限/);
  assert.equal(openedSettings, 1);
});
