const { flushEvents } = require("./utils/analytics");

App({
  onShow() {
    flushEvents().catch(error => console.error("analytics upload failed; records retained locally", error));
  }
});
