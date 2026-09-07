const assert = require("node:assert/strict");
const test = require("node:test");
const { createWx } = require("./helpers/miniprogram");
const { track, flushEvents, setReportingConsent, reportingState } = require("../wechat/miniprogram/utils/analytics");
const endpoint = "https://example.com/events";

test("reporting is local-only without both an endpoint and explicit consent", async () => {
  const api = createWx();
  api.request = () => assert.fail("unexpected network request");
  track("result_view", {}, api);
  assert.equal((await flushEvents(api, endpoint)).status, "disabled");
  setReportingConsent(true, api);
  assert.equal((await flushEvents(api, "")).status, "local");
});

test("successful upload marks only the transmitted events and keeps local history", async () => {
  const api = createWx();
  setReportingConsent(true, api);
  track("result_view", { top3: ["wine-a"] }, api);
  let request;
  api.request = options => { request = options; };
  const pending = flushEvents(api, endpoint);
  await Promise.resolve();
  assert.equal(request.method, "POST");
  assert.equal(request.url, endpoint);
  assert.equal(request.data.events.length, 1);
  assert.equal(request.data.events[0].event, "result_view");
  track("copy_keyword_success", { id: "wine-a" }, api);
  request.success({ statusCode: 204 });
  assert.deepEqual(await pending, { status: "sent", sent: 1 });
  const records = api.storage.get("wineer_events");
  assert.equal(records.length, 2);
  assert.equal(records[0].uploaded, true);
  assert.notEqual(records[1].uploaded, true);
  assert.equal(reportingState(api, endpoint).pending, 1);
});

test("HTTP and transport failures keep unsent events available for a deliberate retry", async () => {
  for (const failure of ["http", "network"]) {
    const api = createWx();
    setReportingConsent(true, api);
    track("recommendation_feedback", { choice: "helpful" }, api);
    api.request = options => {
      if (failure === "http") options.success({ statusCode: 503 });
      else options.fail({ errMsg: "network unavailable" });
    };
    await assert.rejects(flushEvents(api, endpoint), /503|network unavailable/);
    assert.equal(reportingState(api, endpoint).pending, 1);
    api.request = options => options.success({ statusCode: 200 });
    assert.equal((await flushEvents(api, endpoint)).sent, 1);
  }
});

test("concurrent flushes share one request and revoke aborts in-flight reporting", async () => {
  const api = createWx();
  setReportingConsent(true, api);
  track("result_view", {}, api);
  let requestCount = 0;
  let aborted = false;
  api.request = options => {
    requestCount++;
    return { abort() {
      aborted = true;
      options.fail({ errMsg: "request aborted" });
    } };
  };
  const first = flushEvents(api, endpoint);
  const second = flushEvents(api, endpoint);
  await Promise.resolve();
  assert.equal(requestCount, 1);
  setReportingConsent(false, api);
  await Promise.all([assert.rejects(first, /aborted/), assert.rejects(second, /aborted/)]);
  assert.equal(aborted, true);
  assert.equal((await flushEvents(api, endpoint)).status, "disabled");
});

test("a malformed endpoint and storage failures do not become success-shaped results", async () => {
  const api = createWx();
  setReportingConsent(true, api);
  track("result_view", {}, api);
  api.request = () => assert.fail("invalid endpoint must not be used");
  await assert.rejects(flushEvents(api, "http://example.com/events"), /HTTPS/);
  api.getStorageSync = () => { throw new Error("storage unavailable"); };
  await assert.rejects(flushEvents(api, endpoint), /storage unavailable/);
});
