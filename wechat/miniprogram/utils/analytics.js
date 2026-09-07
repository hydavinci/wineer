const config = require("../config");
const STORAGE_KEY = "wineer_events";
const MAX_EVENTS = 200;
const CONSENT_KEY = "wineer_analytics_consent_v1";
const inFlight = new WeakMap();
let sequence = 0;

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
      id: `${Date.now().toString(36)}-${++sequence}-${Math.random().toString(36).slice(2, 10)}`,
      schemaVersion: 1,
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

function readEvents(wxApi) {
  const stored = wxApi.getStorageSync(STORAGE_KEY);
  if (!stored) return [];
  if (!Array.isArray(stored)) throw new Error("Invalid analytics storage");
  return stored;
}

function isPending(entry) {
  return entry && typeof entry.id === "string" && entry.schemaVersion === 1 && !entry.uploaded;
}

function reportingState(wxApi = wx, endpoint = config.analyticsEndpoint) {
  return {
    configured: Boolean(endpoint),
    enabled: wxApi.getStorageSync(CONSENT_KEY) === true,
    pending: readEvents(wxApi).filter(isPending).length
  };
}

function setReportingConsent(enabled, wxApi = wx) {
  wxApi.setStorageSync(CONSENT_KEY, enabled === true);
  if (!enabled) inFlight.get(wxApi)?.request?.abort();
}

function flushEvents(wxApi = wx, endpoint = config.analyticsEndpoint) {
  if (inFlight.has(wxApi)) return inFlight.get(wxApi).promise;
  const operation = { request: null };
  operation.promise = Promise.resolve().then(() => {
    if (!endpoint) return { status: "local", sent: 0 };
    if (wxApi.getStorageSync(CONSENT_KEY) !== true) return { status: "disabled", sent: 0 };
    if (!/^https:\/\/[^/\s]+(?:\/[^\s]*)?$/.test(endpoint)) {
      throw new Error("Analytics endpoint must be an HTTPS URL");
    }
    const events = readEvents(wxApi).filter(isPending).slice(-MAX_EVENTS)
      .map(({ id, schemaVersion, event, payload, path, ts }) => ({ id, schemaVersion, event, payload, path, ts }));
    if (!events.length) return { status: "sent", sent: 0 };
    return new Promise((resolve, reject) => {
      operation.request = wxApi.request({
        url: endpoint,
        method: "POST",
        header: { "content-type": "application/json" },
        data: { events },
        timeout: 10000,
        success: response => {
          if (response.statusCode < 200 || response.statusCode >= 300 || !Number.isInteger(response.statusCode)) {
            reject(new Error(`Analytics HTTP ${response.statusCode}`));
            return;
          }
          resolve();
        },
        fail: error => reject(new Error(error.errMsg || error.message || "Analytics request failed"))
      });
    }).then(() => {
      const sentIds = new Set(events.map(({ id }) => id));
      const current = readEvents(wxApi);
      wxApi.setStorageSync(STORAGE_KEY, current.map(entry =>
        sentIds.has(entry.id) ? { ...entry, uploaded: true } : entry
      ));
      return { status: "sent", sent: events.length };
    });
  }).finally(() => inFlight.delete(wxApi));
  inFlight.set(wxApi, operation);
  return operation.promise;
}

module.exports = {
  MAX_EVENTS, STORAGE_KEY, CONSENT_KEY, track, flushEvents, reportingState, setReportingConsent
};
