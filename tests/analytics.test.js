const assert = require("node:assert/strict");
const test = require("node:test");
const { track } = require("../wechat/miniprogram/utils/analytics");

test("appends an event and keeps the newest 200", () => {
  let stored = Array.from({ length: 200 }, (_, index) => ({ event: `old-${index}` }));
  const wxApi = {
    getStorageSync: () => stored,
    setStorageSync: (_key, value) => { stored = value; }
  };

  assert.equal(track("recommend", { count: 3 }, wxApi), true);
  assert.equal(stored.length, 200);
  assert.equal(stored.at(-1).event, "recommend");
  assert.equal(stored.at(-1).payload.count, 3);
});

test("reports Storage failures without throwing into the user flow", () => {
  const errors = [];
  const wxApi = {
    getStorageSync() { throw new Error("storage unavailable"); }
  };

  assert.equal(track("start_quiz", {}, wxApi, {
    error: (...args) => errors.push(args)
  }), false);
  assert.equal(errors.length, 1);
});
