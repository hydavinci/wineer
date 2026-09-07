const AGE_KEY = "wineer_adult_confirmed_v1";

function confirmAdult(wxApi = wx) {
  try {
    wxApi.setStorageSync(AGE_KEY, true);
    return true;
  } catch (error) {
    console.error("age confirmation storage failed", error);
    wxApi.showToast({ title: "无法保存确认，请重试", icon: "none" });
    return false;
  }
}

function ensureAdult(page, onAccepted, wxApi = wx) {
  if (page._agePromptBusy || page._unloaded) return;
  try {
    if (wxApi.getStorageSync(AGE_KEY) === true) {
      onAccepted();
      return;
    }
  } catch (error) {
    console.error("age confirmation read failed", error);
  }
  page._agePromptBusy = true;
  const fail = error => {
    page._agePromptBusy = false;
    console.error("age confirmation failed", error);
    if (!page._unloaded) wxApi.showToast({ title: "确认失败，请重试", icon: "none" });
  };
  wxApi.showModal({
    title: "仅供年满 18 岁人士浏览",
    content: "内容涉及酒精饮品。请确认已满 18 岁；过量饮酒有害健康，请理性饮酒。",
    confirmText: "我已成年",
    cancelText: "返回首页",
    success: ({ confirm }) => {
      page._agePromptBusy = false;
      if (page._unloaded) return;
      if (confirm) {
        if (confirmAdult(wxApi)) onAccepted();
      } else {
        wxApi.reLaunch({ url: "/pages/home/home", fail });
      }
    },
    fail
  });
}

module.exports = { AGE_KEY, confirmAdult, ensureAdult };
