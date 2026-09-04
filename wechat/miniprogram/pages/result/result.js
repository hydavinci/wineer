const wineData = require("../../data/baijiu");
const {
  RecommendationDataError,
  recommend
} = require("../../shared/recommender");
const { track } = require("../../utils/analytics");
const { decodeAnswers, encodeAnswers } = require("../../utils/navigation");
const { buildPosterModel, drawPoster } = require("../../utils/poster");
const { buildResultView, purchaseKeyword, shareTitle } = require("../../utils/result");

const MAX_CANVAS_SIZE = 1365;

Page({
  data: {
    answers: null,
    ranked: [],
    wines: [],
    errorMessage: "",
    isLoading: true,
    posterBusy: false,
    posterPath: ""
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
    track("restart", { from: "result" });
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

    track("buy_click", {
      id: item.id,
      name: item.name,
      answers: { ...this.data.answers }
    });
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

  generatePoster() {
    if (this.data.posterBusy) {
      return;
    }

    this.setData({ posterBusy: true });
    track("share_poster", {
      top3: this.data.ranked.map(({ item }) => item.id)
    });

    const failPoster = error => {
      console.error("poster generation failed", error);
      this.setData({ posterBusy: false });
      wx.showToast({ title: "生成海报失败，请重试", icon: "none" });
    };

    try {
      this.createSelectorQuery()
        .select("#posterCanvas")
        .fields({ node: true, size: true })
        .exec(results => {
          try {
            const result = results && results[0];
            if (!result || !result.node || !result.width || !result.height) {
              throw new Error("poster canvas unavailable");
            }

            const { node: canvas, width, height } = result;
            const windowInfo = wx.getWindowInfo
              ? wx.getWindowInfo()
              : wx.getSystemInfoSync();
            const requestedDpr = windowInfo.pixelRatio || 1;
            const scale = Math.min(
              requestedDpr,
              MAX_CANVAS_SIZE / width,
              MAX_CANVAS_SIZE / height
            );
            canvas.width = Math.round(width * scale);
            canvas.height = Math.round(height * scale);
            canvas.getContext("2d").scale(scale, scale);
            drawPoster(canvas, width, height, buildPosterModel(this.data.ranked));

            wx.canvasToTempFilePath({
              canvas,
              fileType: "png",
              success: ({ tempFilePath }) => {
                try {
                  if (!tempFilePath) {
                    throw new Error("poster path missing");
                  }
                  this.setData({
                    posterBusy: false,
                    posterPath: tempFilePath
                  });
                  wx.previewImage({
                    current: tempFilePath,
                    urls: [tempFilePath],
                    fail: failPoster
                  });
                } catch (error) {
                  failPoster(error);
                }
              },
              fail: failPoster
            });
          } catch (error) {
            failPoster(error);
          }
        });
    } catch (error) {
      failPoster(error);
    }
  },

  savePoster() {
    if (!this.data.posterPath) {
      wx.showToast({ title: "请先生成海报", icon: "none" });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterPath,
      success: () => {
        wx.showToast({ title: "已保存到相册", icon: "success" });
      },
      fail: error => {
        console.error("poster save failed", error);
        const message = String(error && (error.errMsg || error.message || error));
        if (/auth deny|auth denied|authorize:fail/i.test(message)) {
          wx.showModal({
            title: "需要相册权限",
            content: "请在设置中允许相册权限，再重新保存海报。",
            confirmText: "去设置",
            success: ({ confirm }) => {
              if (confirm) {
                wx.openSetting();
              }
            }
          });
          return;
        }

        wx.showToast({ title: "保存失败，请重试", icon: "none" });
      }
    });
  },

  onShareAppMessage() {
    track("share_click", { mode: "mini_program" });
    return {
      title: shareTitle(this.data.ranked),
      path: `/pages/result/result?${encodeAnswers(this.data.answers)}`
    };
  }
});
