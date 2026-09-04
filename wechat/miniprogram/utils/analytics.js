const STORAGE_KEY = "wineer_events";
const MAX_EVENTS = 200;

function track(event, payload = {}, wxApi = wx, logger = console) {
  try {
    const existing = wxApi.getStorageSync(STORAGE_KEY);
    const events = Array.isArray(existing) ? existing : [];
    events.push({
      event,
      payload,
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
