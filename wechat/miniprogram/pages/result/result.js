const wineData = require("../../data/baijiu");
const {
  RecommendationDataError,
  budgetBand,
  recommend
} = require("../../shared/recommender");
const { track, flushEvents, reportingState, setReportingConsent } = require("../../utils/analytics");
const { decodeAnswers, encodeAnswers, navigate } = require("../../utils/navigation");
const { ensureAdult } = require("../../utils/age");
const { buildPosterModel, drawPoster } = require("../../utils/poster");
const { buildResultView, shareTitle } = require("../../utils/result");
const { copyWineKeyword } = require("../../utils/purchase");

const MAX_CANVAS_SIZE = 1365;

Page({
  data: {
    answers: null,
    wines: [],
    errorMessage: "",
    isLoading: true,
    posterBusy: false,
    posterPath: "",
    saveBusy: false,
    navigationBusy: false,
    agePending: true,
    budgetLabel: "",
    reportingAvailable: false,
    reportingEnabled: false,
    reportingBusy: false,
    reportStatus: "使用记录默认只保存在本机"
  },

  onLoad(options = {}) {
    this.ranked = [];
    this._options = options;
    this.confirmAge();
  },

  confirmAge() {
    ensureAdult(this, () => {
      this.setData({ agePending: false });
      this.loadRecommendations();
    });
  },

  onUnload() {
    this._unloaded = true;
  },

  onShow() {
    this.setData({ navigationBusy: false });
  },

  openCatalog() {
    if (this.data.agePending) return;
    navigate(this, "/pages/catalog/catalog", "navigateTo");
  },

  loadRecommendations() {
    const answers = decodeAnswers(this._options);

    try {
      const ranked = recommend(wineData.items, answers, 3);
      const wines = buildResultView(ranked);
      this.ranked = ranked;
      this.setData({
        answers,
        wines,
        budgetLabel: budgetBand(answers.budget).label,
        errorMessage: "",
        isLoading: false
      });
      track("result_view", {
        answers,
        top3: ranked.map(({ item }) => item.id),
        fromShare: this._options.from === "share",
        dataVersion: wineData.meta.version
      });
      this.refreshReportingState();
    } catch (error) {
      console.error("recommendation failed", error);
      this.ranked = [];
      this.setData({
        answers,
        wines: [],
        errorMessage: error instanceof RecommendationDataError
          ? "推荐数据异常，请稍后重试"
          : "生成推荐失败，请稍后重试",
        isLoading: false
      });
    }
  },

  restart() {
    if (this.data.navigationBusy) return;
    track("restart", { from: "result" });
    navigate(this, "/pages/quiz/quiz?from=restart");
  },

  adjustPreferences() {
    if (this.data.navigationBusy) return;
    track("adjust_preferences", { answers: this.data.answers });
    navigate(this, `/pages/quiz/quiz?${encodeAnswers(this.data.answers)}&from=adjust`);
  },

  refreshReportingState() {
    try {
      const state = reportingState();
      this.setData({
        reportingAvailable: state.configured,
        reportingEnabled: state.enabled
      });
    } catch (error) {
      console.error("analytics state unavailable", error);
      this.setData({ reportStatus: "无法读取本机记录，请重试" });
    }
  },

  toggleReporting(event) {
    const enabled = event.detail.value === true;
    if (this._reportPromptBusy) return;
    const apply = allow => {
      try {
        setReportingConsent(allow);
        this.setData({
          reportingEnabled: allow,
          reportStatus: allow ? "已允许上报本机记录" : "已关闭上报，记录只保留在本机"
        });
        if (allow) return this.uploadEvents();
      } catch (error) {
        console.error("analytics consent storage failed", error);
        wx.showToast({ title: "设置未保存，请重试", icon: "none" });
        this.refreshReportingState();
      }
    };
    if (!enabled) return apply(false);
    this._reportPromptBusy = true;
    wx.showModal({
      title: "允许发送使用记录？",
      content: "将把本机最近 200 条偏好、推荐酒款、操作时间及历史反馈发送给开发者，用于改进推荐；不包含姓名或微信身份字段。你可随时关闭，已发送的数据不会因此撤回。",
      confirmText: "允许上报",
      success: ({ confirm }) => {
        this._reportPromptBusy = false;
        if (this._unloaded) return;
        if (confirm) return apply(true);
        this.setData({ reportingEnabled: false });
      },
      fail: error => {
        this._reportPromptBusy = false;
        console.error("analytics consent prompt failed", error);
        if (!this._unloaded) {
          this.setData({ reportingEnabled: false });
          wx.showToast({ title: "确认失败，尚未开启上报", icon: "none" });
        }
      }
    });
  },

  async uploadEvents() {
    if (this.data.reportingBusy) return;
    this.setData({ reportingBusy: true });
    try {
      const result = await flushEvents();
      if (this._unloaded) return;
      this.setData({
        reportStatus: result.status === "sent"
          ? `已上报 ${result.sent} 条记录`
          : "未开启上报，记录仍在本机"
      });
    } catch (error) {
      console.error("analytics upload failed", error);
      if (!this._unloaded) this.setData({ reportStatus: "上报未确认，记录仍保留在本机，可重试" });
    } finally {
      if (!this._unloaded) this.setData({ reportingBusy: false });
    }
  },

  copyPurchaseKeyword(event) {
    const item = this.ranked
      .map(({ item: rankedItem }) => rankedItem)
      .find(({ id }) => id === event.detail.id);

    copyWineKeyword(item, { answers: { ...this.data.answers } });
  },

  generatePoster() {
    if (this.data.posterBusy) {
      return;
    }
    if (this.data.agePending || !this.ranked || !this.ranked.length) {
      wx.showToast({ title: "请先生成推荐", icon: "none" });
      return;
    }

    this.setData({ posterBusy: true });
    const payload = { top3: this.ranked.map(({ item }) => item.id) };
    track("poster_generation_attempt", payload);

    const failPoster = error => {
      console.error("poster generation failed", error);
      if (this._unloaded) return;
      this.setData({ posterBusy: false });
      track("poster_generation_failed", payload);
      wx.showToast({ title: "生成海报失败，请重试", icon: "none" });
    };

    try {
      this.createSelectorQuery()
        .select("#posterCanvas")
        .fields({ node: true, size: true })
        .exec(results => {
          if (this._unloaded) return;
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
            drawPoster(canvas, width, height, buildPosterModel(this.ranked));

            wx.canvasToTempFilePath({
              canvas,
              fileType: "png",
              success: ({ tempFilePath }) => {
                if (this._unloaded) return;
                try {
                  if (!tempFilePath) {
                    throw new Error("poster path missing");
                  }
                  this.setData({
                    posterBusy: false,
                    posterPath: tempFilePath
                  });
                  track("poster_generated", payload);
                  wx.previewImage({
                    current: tempFilePath,
                    urls: [tempFilePath],
                    fail: error => {
                      console.error("poster preview failed", error);
                      if (!this._unloaded) wx.showToast({ title: "预览失败，可尝试保存海报", icon: "none" });
                    }
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
    if (this.data.saveBusy) return;
    if (!this.data.posterPath) {
      wx.showToast({ title: "请先生成海报", icon: "none" });
      return;
    }

    this.setData({ saveBusy: true });
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterPath,
      success: () => {
        if (this._unloaded) return;
        this.setData({ saveBusy: false });
        track("poster_saved");
        wx.showToast({ title: "已保存到相册", icon: "success" });
      },
      fail: error => {
        console.error("poster save failed", error);
        if (this._unloaded) return;
        this.setData({ saveBusy: false });
        const message = String(error && (error.errMsg || error.message || error));
        if (/auth deny|auth denied|authorize:fail/i.test(message)) {
          wx.showModal({
            title: "需要相册权限",
            content: "请在设置中允许相册权限，再重新保存海报。",
            confirmText: "去设置",
            success: ({ confirm }) => {
              if (confirm) {
                wx.openSetting({
                  fail: error => {
                    console.error("album settings failed", error);
                    wx.showToast({ title: "打开设置失败，请重试", icon: "none" });
                  }
                });
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
    if (this.data.agePending || !this.ranked || !this.ranked.length) {
      return { title: "Wineer 白酒推荐", path: "/pages/home/home" };
    }
    track("share_click", { mode: "mini_program" });
    return {
      title: shareTitle(this.ranked),
      path: `/pages/result/result?${encodeAnswers(this.data.answers)}&from=share`
    };
  }
});
