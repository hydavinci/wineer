const {
  DIMENSIONS,
  normalizeAnswers
} = require("../shared/recommender");

const ANSWER_KEYS = DIMENSIONS.map(({ key }) => key);

function encodeAnswers(input) {
  const answers = normalizeAnswers(input);
  return ANSWER_KEYS
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(answers[key])}`)
    .join("&");
}

function decodeAnswers(options = {}) {
  return normalizeAnswers(options);
}

function navigate(page, url, method = "redirectTo") {
  if (page.data.navigationBusy) return;
  page.setData({ navigationBusy: true });
  wx[method]({
    url,
    fail: error => {
      console.error("page navigation failed", error);
      if (!page._unloaded) page.setData({ navigationBusy: false });
      wx.showToast({ title: "跳转失败，请重试", icon: "none" });
    }
  });
}

module.exports = { ANSWER_KEYS, decodeAnswers, encodeAnswers, navigate };
