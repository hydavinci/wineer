const {
  DIMENSIONS,
  budgetOptions,
  defaultAnswers,
  normalizeAnswers
} = require("../../shared/recommender");
const { track } = require("../../utils/analytics");
const { encodeAnswers } = require("../../utils/navigation");
const { ensureAdult } = require("../../utils/age");

const BUDGET_OPTIONS = budgetOptions();
const OCCASION_OPTIONS = [
  { value: 1, end: 2, label: "日常自饮" },
  { value: 4, end: 4, label: "熟人小聚" },
  { value: 5, end: 6, label: "家宴聚餐" },
  { value: 8, end: 8, label: "商务宴请" },
  { value: 10, end: 10, label: "送礼 / 收藏" }
];
const ENTRY_SOURCES = ["home", "adjust", "restart", "feedback"];
const FOCUS_DIMENSIONS = ["budget", "softness", "flavorWeight"];

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
    resultBusy: false,
    agePending: true,
    advanced: false,
    budgetOptions: BUDGET_OPTIONS,
    occasionOptions: OCCASION_OPTIONS,
    budgetSelected: 4,
    occasionSelected: 4,
    focusDimension: ""
  },

  onLoad(options = {}) {
    this._initialAnswers = normalizeAnswers(options);
    this._entrySource = ENTRY_SOURCES.includes(options.from) ? options.from : "direct";
    const focusDimension = this._entrySource === "feedback" && FOCUS_DIMENSIONS.includes(options.focus)
      ? options.focus : "";
    this.setData({
      focusDimension,
      advanced: focusDimension !== "" && focusDimension !== "budget"
    });
    this.confirmAge();
  },

  confirmAge() {
    ensureAdult(this, () => {
      this.refreshDimensions(this._initialAnswers);
      this.setData({ agePending: false });
      track("quiz_view", {
        source: this._entrySource,
        editing: ["adjust", "feedback"].includes(this._entrySource)
      });
    });
  },

  onUnload() {
    this._unloaded = true;
  },

  toggleAdvanced() {
    this.setData({ advanced: !this.data.advanced });
  },

  selectOption(event) {
    if (this.data.agePending || this.data.resultBusy) return;
    const key = event.currentTarget.dataset.key;
    const options = key === "budget" ? BUDGET_OPTIONS : key === "occasion" ? OCCASION_OPTIONS : [];
    const option = options.find(item => String(item.value) === String(event.detail.value));
    if (!option) {
      console.error("invalid quiz option", key, event.detail.value);
      wx.showToast({ title: "选项无效，请重试", icon: "none" });
      return;
    }
    this.refreshDimensions({ ...this.data.answers, [key]: option.value });
  },

  resetAnswers() {
    this.refreshDimensions(defaultAnswers());
  },

  onSliderChange(event) {
    const { key } = event.currentTarget.dataset;
    const index = DIMENSIONS.findIndex(dimension => dimension.key === key);
    if (index < 0) {
      console.error("unknown quiz dimension", key);
      wx.showToast({ title: "选项不存在，请重试", icon: "none" });
      return;
    }
    const answers = normalizeAnswers({
      ...this.data.answers,
      [key]: event.detail.value
    });

    if (answers[key] === this.data.answers[key]) return;
    this.setData({
      [`answers.${key}`]: answers[key],
      [`dimensions[${index}].value`]: answers[key],
      [`dimensions[${index}].hint`]: DIMENSIONS[index].hint(answers[key])
    });
  },

  refreshDimensions(answers) {
    this.setData({
      answers,
      dimensions: toViewDimensions(answers),
      budgetSelected: BUDGET_OPTIONS.find(option => answers.budget <= option.end).value,
      occasionSelected: OCCASION_OPTIONS.find(option => answers.occasion <= option.end).value
    });
  },

  showResults() {
    if (this.data.agePending || this.data.resultBusy) {
      return;
    }

    const answers = normalizeAnswers(this.data.answers);
    const query = encodeAnswers(answers);
    this.setData({ resultBusy: true });
    track("recommend_attempt", { answers: { ...answers } });
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
