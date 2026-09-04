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
