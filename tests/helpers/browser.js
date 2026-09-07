const { spawn } = require("node:child_process");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

function dumpDom(chrome, file, directory) {
  return new Promise((resolve, reject) => {
    const child = spawn(chrome, [
      "--headless", "--disable-gpu", "--disable-background-networking", "--disable-component-update",
      "--disable-sync", "--no-first-run", "--no-default-browser-check", "--timeout=10000",
      `--user-data-dir=${path.join(directory, "profile")}`, "--dump-dom", pathToFileURL(file).href
    ], { stdio: ["ignore", "pipe", "pipe"] });
    let html = "";
    let diagnostics = "";
    let complete = false;
    let timedOut = false;
    let forceStop;
    const stop = () => {
      child.kill("SIGTERM");
      forceStop = setTimeout(() => child.kill("SIGKILL"), 1000);
    };
    const timer = setTimeout(() => {
      timedOut = true;
      stop();
    }, 30000);
    const cleanup = () => {
      clearTimeout(timer);
      clearTimeout(forceStop);
      child.stdout.destroy();
      child.stderr.destroy();
    };
    child.stdout.on("data", chunk => {
      html += chunk;
      if (!complete && html.includes("</html>")) {
        // macOS Chrome may linger after dumping the document; rendering is already complete.
        complete = true;
        clearTimeout(timer);
        stop();
      }
    });
    child.stderr.on("data", chunk => { diagnostics = (diagnostics + chunk).slice(-8000); });
    child.once("error", error => { cleanup(); reject(error); });
    child.once("exit", (code, signal) => {
      cleanup();
      if (timedOut || !complete || (code !== 0 && !["SIGTERM", "SIGKILL"].includes(signal))) {
        reject(new Error(`Chrome did not finish rendering (${timedOut ? "timeout" : signal || code}): ${diagnostics}`));
      } else {
        resolve(html);
      }
    });
  });
}

module.exports = { dumpDom };
