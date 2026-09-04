const STORAGE_KEY = "wineer_events";
const MAX_EVENTS = 200;

function currentPagePath(getPages, logger) {
  if (typeof getPages !== "function") {
    return "";
  }

  try {
    const pages = getPages();
    const page = Array.isArray(pages) ? pages[pages.length - 1] : null;
    const route = page && (page.route || page.__route__);
    return typeof route === "string" && route
      ? `/${route.replace(/^\/+/, "")}`
      : "";
  } catch (error) {
    logger.error("analytics page path failed", error);
    return "";
  }
}

function track(
  event,
  payload = {},
  wxApi = wx,
  logger = console,
  getPages = typeof getCurrentPages === "function" ? getCurrentPages : null
) {
  try {
    const existing = wxApi.getStorageSync(STORAGE_KEY);
    const events = Array.isArray(existing) ? existing : [];
    events.push({
      event,
      payload,
      path: currentPagePath(getPages, logger),
      ts: new Date().toISOString()
    });
    wxApi.setStorageSync(STORAGE_KEY, events.slice(-MAX_EVENTS));
    return true;
  } catch (error) {
    logger.error("analytics storage failed", error);
    return false;
  }
}

module.exports = { MAX_EVENTS, STORAGE_KEY, track };
