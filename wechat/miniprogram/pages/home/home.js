const { track } = require("../../utils/analytics");
const { confirmAdult } = require("../../utils/age");
const { navigate } = require("../../utils/navigation");

Page({
  data: { navigationBusy: false },

  onShow() {
    this.setData({ navigationBusy: false });
  },

  openCatalog() {
    navigate(this, "/pages/catalog/catalog", "navigateTo");
  },

  startQuiz() {
    if (this.data.navigationBusy || !confirmAdult()) return;
    track("start_quiz", { fromShare: false });
    navigate(this, "/pages/quiz/quiz?from=home", "navigateTo");
  }
});
