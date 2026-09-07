const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

const chrome = process.env.WINEER_CHROME
  || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const available = Boolean(process.env.WINEER_CHROME) || fs.existsSync(chrome);

test("themed buttons retain their colors while loading or disabled despite native defaults", { skip: !available }, t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "wineer-button-theme-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const styles = fs.readFileSync(path.resolve(__dirname, "../wechat/miniprogram/app.wxss"), "utf8");
  const buttons = ["primary", "secondary"].flatMap(theme =>
    ["", 'type="default"'].flatMap(type =>
      ["", "disabled", "loading", "disabled loading"].map(state =>
        `<button class="button-${theme}" data-theme="${theme}" ${type} ${state}>Button</button>`
      )
    )
  ).join("");
  const file = path.join(directory, "buttons.html");
  fs.writeFileSync(file, `<!doctype html><meta charset="utf-8">
    <style>${styles}</style>
    <style>
      button[disabled]:not([type]), button[disabled][type="default"],
      button[loading]:not([type]), button[loading][type="default"] {
        background: #f7f7f7;
        color: rgba(0, 0, 0, .3);
      }
    </style>
    ${buttons}<pre id="computed"></pre>
    <script>
      document.getElementById("computed").textContent = JSON.stringify(
        Array.from(document.querySelectorAll("button"), button => {
          const style = getComputedStyle(button);
          return {
            theme: button.dataset.theme, state: button.outerHTML,
            color: style.color, background: style.backgroundColor,
            image: style.backgroundImage
          };
        })
      );
    </script>`);
  const outputPath = path.join(directory, "browser.html");
  const errorPath = path.join(directory, "browser.log");
  const output = fs.openSync(outputPath, "w");
  const error = fs.openSync(errorPath, "w");
  let result;
  try {
    // Files avoid waiting on pipe handles inherited by Chrome's child processes.
    result = spawnSync(chrome, [
      "--headless", "--disable-gpu", "--disable-background-networking", "--disable-component-update",
      "--disable-sync", "--no-first-run", "--no-default-browser-check",
      "--timeout=10000",
      `--user-data-dir=${path.join(directory, "profile")}`,
      "--dump-dom", pathToFileURL(file).href
    ], { timeout: 30000, stdio: ["ignore", output, error] });
  } finally {
    fs.closeSync(output);
    fs.closeSync(error);
  }
  assert.ifError(result.error);
  assert.equal(result.status, 0, fs.readFileSync(errorPath, "utf8"));
  const match = fs.readFileSync(outputPath, "utf8").match(/<pre id="computed">([\s\S]*?)<\/pre>/);
  assert.ok(match, "read computed styles from the actual browser");
  const computed = JSON.parse(match[1].replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&"));
  assert.equal(computed.length, 16);
  for (const button of computed) {
    if (button.theme === "primary") {
      assert.equal(button.color, "rgb(42, 29, 16)", button.state);
      assert.match(button.image, /linear-gradient/, button.state);
    } else {
      assert.equal(button.color, "rgb(224, 190, 106)", button.state);
      assert.equal(button.background, "rgba(201, 162, 75, 0.1)", button.state);
    }
  }
});
