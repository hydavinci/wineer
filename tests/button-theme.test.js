const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { dumpDom } = require("./helpers/browser");

const chrome = process.env.WINEER_CHROME
  || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const available = Boolean(process.env.WINEER_CHROME) || fs.existsSync(chrome);

test("themed buttons retain their colors while loading or disabled despite native defaults", { skip: !available }, async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "wineer-button-theme-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const styles = [
    "app.wxss", "pages/quiz/quiz.wxss", "pages/catalog/catalog.wxss",
    "components/wine-card/wine-card.wxss"
  ].map(file => fs.readFileSync(path.resolve(__dirname, "../wechat/miniprogram", file), "utf8"))
    .join("\n").replace(/(-?\d+(?:\.\d+)?)rpx/g, "calc($1 * var(--rpx, .5px))");
  const buttons = ["primary", "secondary"].flatMap(theme =>
    ["", 'type="default"'].flatMap(type =>
      ["", "disabled", "loading", "disabled loading"].map(state =>
        `<button class="button-${theme}" data-theme="${theme}" ${type} ${state}>Button</button>`
      )
    )
  ).join("");
  const file = path.join(directory, "buttons.html");
  fs.writeFileSync(file, `<!doctype html><meta charset="utf-8">
    <style>body { margin: 0; } button { box-sizing: border-box; } ${styles}</style>
    <style>
      button[disabled]:not([type]), button[disabled][type="default"],
      button[loading]:not([type]), button[loading][type="default"] {
        background: #f7f7f7;
        color: rgba(0, 0, 0, .3);
      }
    </style>
    ${buttons}
    ${[320, 390].map(width => `<div class="sample" style="width:${width}px;--rpx:${width / 750}px">
      <div class="page"><div class="card option-card">
        <p class="muted">Price and specification uncertainty must remain readable.</p>
        <div class="option-list">
          ${["100元内", "200元内", "500元内", "900元内", "1500元内", "不限预算"].map(label =>
            `<label class="option-item">${label}</label>`).join("")}
        </div>
        <div class="wine-quality-notice">价格待核实；规格存在疑问，请核对后购买。</div>
      </div></div>
    </div>`).join("")}
    <pre id="computed"></pre><pre id="layout"></pre>
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
      document.getElementById("layout").textContent = JSON.stringify(
        Array.from(document.querySelectorAll(".sample"), sample => {
          const page = sample.querySelector(".page"), card = sample.querySelector(".card");
          const muted = sample.querySelector(".muted"), notice = sample.querySelector(".wine-quality-notice");
          const options = Array.from(sample.querySelectorAll(".option-item"), item => {
            const box = item.getBoundingClientRect();
            return { x: box.x, y: box.y, width: box.width, height: box.height };
          });
          return {
            overflow: page.scrollWidth > sample.clientWidth,
            pageColor: getComputedStyle(page).backgroundColor,
            cardColor: getComputedStyle(card).backgroundColor,
            shadow: getComputedStyle(card).boxShadow,
            mutedColor: getComputedStyle(muted).color,
            noticeColor: getComputedStyle(notice).color,
            noticeBackground: getComputedStyle(notice).backgroundColor,
            options
          };
        })
      );
    </script>`);
  const html = await dumpDom(chrome, file, directory);
  const match = html.match(/<pre id="computed">([\s\S]*?)<\/pre>/);
  assert.ok(match, "read computed styles from the actual browser");
  const computed = JSON.parse(match[1].replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&"));
  assert.equal(computed.length, 16);
  for (const button of computed) {
    if (button.theme === "primary") {
      assert.equal(button.color, "rgb(255, 255, 255)", button.state);
      assert.equal(button.background, "rgb(36, 39, 34)", button.state);
      assert.equal(button.image, "none", button.state);
    } else {
      assert.equal(button.color, "rgb(36, 39, 34)", button.state);
      assert.equal(button.background, "rgb(255, 255, 255)", button.state);
    }
  }
  const layoutMatch = html.match(/<pre id="layout">([\s\S]*?)<\/pre>/);
  assert.ok(layoutMatch);
  for (const layout of JSON.parse(layoutMatch[1])) {
    assert.equal(layout.pageColor, "rgb(247, 246, 242)");
    assert.equal(layout.cardColor, "rgb(255, 255, 255)");
    assert.equal(layout.shadow, "none");
    assert.equal(layout.overflow, false);
    assert.ok(contrast(layout.mutedColor, layout.cardColor) >= 4.5);
    assert.ok(contrast(layout.noticeColor, layout.noticeBackground) >= 4.5);
    assert.equal(layout.options[0].y, layout.options[1].y);
    assert.ok(layout.options[2].y > layout.options[0].y);
    assert.ok(layout.options.every(option => option.height >= 44));
    assert.ok(Math.abs(layout.options[0].width - layout.options[1].width) < 1);
  }
});

function contrast(foreground, background) {
  const luminance = color => {
    const channels = color.match(/\d+(?:\.\d+)?/g).slice(0, 3).map(value => {
      const channel = Number(value) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
