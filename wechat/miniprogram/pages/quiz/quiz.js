const {
  DIMENSIONS,
  defaultAnswers,
  normalizeAnswers
} = require("../../shared/recommender");
const { track } = require("../../utils/analytics");
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
    dimensions: [],
    resultBusy: false
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
    if (this.data.resultBusy) {
      return;
    }

    const answers = normalizeAnswers(this.data.answers);
    const query = encodeAnswers(answers);
    this.setData({ resultBusy: true });
    track("recommend", { answers: { ...answers } });
    wx.redirectTo({
      url: `/pages/result/result?${query}`,
      fail: error => {
        console.error("result navigation failed", error);
        this.setData({ resultBusy: false });
        wx.showToast({ title: "跳转失败，请重试", icon: "none" });
      }
    });
  }
});
