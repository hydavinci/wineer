const wineData = require("../../data/baijiu");
const {
  RecommendationDataError,
  recommend
} = require("../../shared/recommender");
const { decodeAnswers, encodeAnswers } = require("../../utils/navigation");
const { buildResultView, purchaseKeyword, shareTitle } = require("../../utils/result");

Page({
  data: {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true
  },

  onLoad(options) {
    const answers = decodeAnswers(options);

    try {
      const ranked = recommend(wineData.items, answers, 3);
      this.setData({
        answers,
        ranked,
        wines: buildResultView(ranked),
        errorMessage: "",
        isLoading: false
      });
    } catch (error) {
      console.error("recommendation failed", error);
      this.setData({
        answers,
        ranked: [],
        wines: [],
        errorMessage: error instanceof RecommendationDataError
          ? "推荐数据异常，请稍后重试"
          : "生成推荐失败，请稍后重试",
        isLoading: false
      });
    }
  },

  restart() {
    wx.redirectTo({ url: "/pages/quiz/quiz" });
  },

  copyPurchaseKeyword(event) {
    const item = this.data.ranked
      .map(({ item: rankedItem }) => rankedItem)
      .find(({ id }) => id === event.detail.id);

    if (!item) {
      wx.showToast({ title: "酒款信息不存在", icon: "none" });
      return;
    }

    wx.setClipboardData({
      data: purchaseKeyword(item),
      success: () => {
        wx.showToast({ title: "已复制，请打开京东搜索", icon: "none" });
      },
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
