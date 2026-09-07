const path = require("node:path");

function createPage(relativePath, initialData = {}) {
  const modulePath = require.resolve(path.resolve(__dirname, "../..", relativePath));
  delete require.cache[modulePath];
  let definition;
  const previous = global.Page;
  global.Page = value => { definition = value; };
  try {
    require(modulePath);
  } finally {
    if (previous) global.Page = previous;
    else delete global.Page;
    delete require.cache[modulePath];
  }
  return {
    ...definition,
    data: { ...structuredClone(definition.data || {}), ...initialData },
    patches: [],
    setData: setPageData
  };
}

function setPageData(patch, callback) {
  this.patches?.push(patch);
  for (const [key, value] of Object.entries(patch)) {
    const parts = key.replace(/\[(\d+)\]/g, ".$1").split(".");
    let target = this.data;
    for (const part of parts.slice(0, -1)) target = target[part];
    target[parts.at(-1)] = value;
  }
  callback?.();
}

function createWx(accepted = true) {
  const storage = new Map([["wineer_adult_confirmed_v1", accepted]]);
  const modals = [];
  const routes = [];
  const toasts = [];
  return {
    storage, modals, routes, toasts,
    getStorageSync: key => storage.get(key) ?? "",
    setStorageSync: (key, value) => storage.set(key, structuredClone(value)),
    showModal(options) {
      if (["confirmText", "cancelText"].some(key => options[key] && Array.from(options[key]).length > 4)) {
        options.fail?.({ errMsg: "showModal:fail button text exceeds four characters" });
        return;
      }
      modals.push(options);
    },
    showToast: options => toasts.push(options),
    redirectTo: options => routes.push(options),
    navigateTo: options => routes.push(options),
    reLaunch: options => routes.push(options)
  };
}

module.exports = { createPage, createWx, setPageData };
