const assert = require("node:assert/strict");
const test = require("node:test");
const { DIMENSIONS, defaultAnswers } = require("../shared/recommender");

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
    data: { ...initialData },
    setData(nextData) {
      this.data = { ...this.data, ...nextData };
    }
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

test("quiz page encodes answers into the future result route", () => {
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
  const urls = [];
  let stored = [];

  global.wx = {
    getStorageSync() {
      return stored;
    },
    setStorageSync(_key, value) {
      stored = value;
    },
    navigateTo({ url }) {
      urls.push(url);
    }
  };

  try {
    quizPage.showResults.call(page);
  } finally {
    delete global.wx;
  }

  assert.deepEqual(urls, [
    "/pages/result/result?budget=1&occasion=2&softness=3&flavorWeight=4&brandFace=5&adventure=6"
  ]);
  assert.deepEqual(stored.at(-1), {
    event: "recommend",
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
    ts: stored.at(-1).ts
  });
});

test("home page starts the quiz route", () => {
  const homePage = loadPageDefinition("../wechat/miniprogram/pages/home/home");
  const urls = [];
  let stored = [];

  global.wx = {
    getStorageSync() {
      return stored;
    },
    setStorageSync(_key, value) {
      stored = value;
    },
    navigateTo({ url }) {
      urls.push(url);
    }
  };

  try {
    homePage.startQuiz();
  } finally {
    delete global.wx;
  }

  assert.deepEqual(urls, ["/pages/quiz/quiz"]);
  assert.equal(stored.at(-1).event, "start_quiz");
  assert.deepEqual(stored.at(-1).payload, { fromShare: false });
});
