const { track } = require("../../utils/analytics");

Page({
  startQuiz() {
    track("start_quiz", { fromShare: false });
    wx.navigateTo({ url: "/pages/quiz/quiz" });
  }
});
