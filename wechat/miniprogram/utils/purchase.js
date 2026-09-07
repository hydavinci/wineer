const { track } = require("./analytics");
const { purchaseKeyword } = require("./result");

function copyWineKeyword(item, context = {}) {
  if (!item) {
    wx.showToast({ title: "酒款信息不存在", icon: "none" });
    return;
  }
  const payload = { id: item.id, name: item.name, ...context };
  track("copy_keyword_attempt", payload);
  wx.setClipboardData({
    data: purchaseKeyword(item),
    success: () => {
      track("copy_keyword_success", payload);
      wx.showToast({ title: "已复制，可在平台搜索比价", icon: "none" });
    },
    fail: error => {
      console.error("clipboard failed", error);
      track("copy_keyword_failed", { id: item.id, ...context });
      wx.showToast({ title: "复制失败，请重试", icon: "none" });
    }
  });
}

module.exports = { copyWineKeyword };
