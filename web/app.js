/* Wineer 白酒推荐引擎 v0.4 - 具体化 0~10 条目选择 */
const Wineer = (() => {
  const {
    DIMENSIONS,
    defaultAnswers,
    normalizeAnswers,
    recommend: rankWines
  } = WineerRecommender;

  let DB = [];
  let answers = defaultAnswers();
  let sharedAnswers = readAnswersFromUrl();
  let lastTop3 = [];

  function readAnswersFromUrl() {
    const params = new URLSearchParams(location.search);
    if (params.get("w") !== "1") return null;
    const next = defaultAnswers();
    let hasAny = false;
    for (const key of Object.keys(next)) {
      const raw = params.get(key);
      if (raw === null) continue;
      const value = Number(raw);
      if (Number.isInteger(value) && value >= 0 && value <= 10) {
        next[key] = value;
        hasAny = true;
      }
    }
    return hasAny ? next : null;
  }

  function buildShareUrl() {
    const url = new URL(location.href);
    url.search = "";
    url.hash = "";
    const params = new URLSearchParams({ w: "1" });
    Object.entries(answers).forEach(([key, value]) => params.set(key, String(value)));
    url.search = params.toString();
    return url.toString();
  }

  function track(event, payload = {}) {
    const data = {
      event,
      payload,
      ts: new Date().toISOString(),
      path: location.pathname
    };

    try {
      const key = "wineer_events";
      const events = JSON.parse(localStorage.getItem(key) || "[]");
      events.push(data);
      localStorage.setItem(key, JSON.stringify(events.slice(-200)));
    } catch (_) {}

    const endpoint = window.WINEER_ANALYTICS_ENDPOINT;
    if (!endpoint) return;
    try {
      const body = JSON.stringify(data);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      } else {
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
      }
    } catch (_) {}
  }

  async function load() {
    const cacheBuster = Date.now();
    const urls = [
      `data/baijiu.json?v=${cacheBuster}`,
      `baijiu.json?v=${cacheBuster}`
    ];
    const errors = [];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load ${url}: HTTP ${res.status || "unknown"}`);
        }
        const json = await res.json();
        if (!Array.isArray(json.items)) {
          throw new Error(`Failed to load ${url}: invalid items payload`);
        }
        DB = json.items;
        return true;
      } catch (error) {
        errors.push(error);
      }
    }

    DB = [];
    errors.forEach(error => console.error("data load failed", error));
    alert("数据加载失败，请稍后再试");
    return false;
  }

  function startQuiz() {
    switchScreen("quiz");
    answers = sharedAnswers || defaultAnswers();
    sharedAnswers = null;
    renderTuner();
    track("start_quiz", { fromShare: Boolean(new URLSearchParams(location.search).get("w")) });
    if (DB.length === 0) load();
  }

  function renderTuner() {
    const html = `
      <div class="tuner-head">
        <div class="q-title">按真实需求打分</div>
        <div class="q-sub">每项 0–10，按“这瓶酒要拿来干嘛、谁来喝、愿意花多少钱”来调</div>
      </div>
      <div class="sliders">
        ${DIMENSIONS.map(d => `
          <div class="slider-card">
            <div class="slider-top">
              <div>
                <div class="slider-title">${d.title}</div>
                <div id="${d.key}Hint" class="slider-hint">${d.hint(answers[d.key])}</div>
              </div>
              <div id="${d.key}Value" class="slider-value">${answers[d.key]}</div>
            </div>
            <input class="range" type="range" min="0" max="10" step="1" value="${answers[d.key]}"
              oninput="Wineer.setDim('${d.key}', this.value)">
            <div class="scale-labels"><span>${d.left}</span><span>${d.right}</span></div>
          </div>
        `).join("")}
      </div>
      <button class="btn primary" onclick="Wineer.recommend()">生成 Top 3 推荐</button>
    `;
    document.getElementById("questionArea").innerHTML = html;
  }

  function setDim(key, value) {
    const v = Number(value);
    answers[key] = v;
    const dim = DIMENSIONS.find(d => d.key === key);
    document.getElementById(`${key}Value`).textContent = v;
    document.getElementById(`${key}Hint`).textContent = dim.hint(v);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function recommend() {
    if (DB.length === 0) {
      alert("数据尚未加载完成，请稍后重试");
      return;
    }

    answers = normalizeAnswers(answers);
    let top3;
    try {
      top3 = rankWines(DB, answers, 3);
    } catch (error) {
      console.error("recommendation failed", error);
      alert("推荐数据异常，请稍后再试");
      return;
    }

    lastTop3 = top3;
    track("recommend", {
      answers: { ...answers },
      top3: top3.map(({ item, score }) => ({
        id: item.id,
        name: item.name,
        score,
        price: item.price
      }))
    });
    renderResult(top3);
    switchScreen("result");
  }

  function renderResult(top3) {
    const html = `
      <div class="result-head">
        <div class="lead">为你推荐</div>
        <div class="bottle">🍶</div>
        <div class="r-name">Top 3 白酒选择</div>
      </div>
      <div class="share-box">
        <button class="btn secondary" onclick="Wineer.shareResult()">分享结果链接</button>
        <button class="btn secondary" onclick="Wineer.downloadPoster()">生成分享海报</button>
      </div>
      <div class="top3-list">
        ${top3.map((r, index) => {
          const it = r.item;
          const pct = r.matchPercent;
          const buyUrl = "https://search.jd.com/Search?keyword=" + encodeURIComponent(it.name);
          const whyText = r.why.length ? [...new Set(r.why)].slice(0, 4).map(escapeHtml).join(" · ") : "综合条件最优";
          return `
            <div class="top-card ${index === 0 ? "top-card-main" : ""}">
              <div class="top-rank">TOP ${index + 1}</div>
              <div class="top-name">${escapeHtml(it.name)}</div>
              <div class="match-score">推荐指数 ${pct}% · ${whyText}</div>
              <div class="r-tags">
                <span class="tag">${escapeHtml(it.aroma)}型</span>
                <span class="tag">${escapeHtml(it.abv)}度</span>
                <span class="tag">约 ¥${escapeHtml(it.price)}</span>
                <span class="tag">${escapeHtml(it.priceTier)}</span>
                <span class="tag">${escapeHtml(it.region)}</span>
              </div>
              <div class="r-block">
                <h4>💡 推荐理由</h4>
                <p>${escapeHtml(it.highlight)}</p>
              </div>
              <div class="r-block">
                <h4>👅 口感特点</h4>
                <p>${it.taste.map(escapeHtml).join("、")}</p>
              </div>
              <div class="r-block r-caution">
                <h4>⚠️ 选购提示</h4>
                <p>${escapeHtml(it.caution)}</p>
              </div>
              <a class="btn-buy" href="${buyUrl}" target="_blank" rel="noopener" onclick="Wineer.trackBuy('${escapeHtml(it.id)}')">去看看 / 比价 →</a>
            </div>
          `;
        }).join("")}
      </div>
    `;
    document.getElementById("resultArea").innerHTML = html;
  }

  async function shareResult() {
    const url = buildShareUrl();
    track("share_click", { mode: navigator.share ? "native" : "copy", url });
    if (navigator.share) {
      try {
        await navigator.share({ title: "Wineer 白酒推荐", text: "这是我的 Wineer 白酒推荐结果", url });
        return;
      } catch (_) {}
    }
    try {
      await navigator.clipboard.writeText(url);
      alert("分享链接已复制");
    } catch (_) {
      prompt("复制这个分享链接", url);
    }
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
    const chars = String(text).split("");
    let line = "";
    let lines = [];
    for (const ch of chars) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = ch;
        if (lines.length >= maxLines) break;
      } else {
        line = test;
      }
    }
    if (line && lines.length < maxLines) lines.push(line);
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
    return y + lines.length * lineHeight;
  }

  function downloadPoster() {
    if (!lastTop3.length) return;
    track("share_poster", { top3: lastTop3.map(r => r.item.id) });
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1400;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#2e211d");
    gradient.addColorStop(1, "#1a1210");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#e0be6a";
    ctx.font = "700 54px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🍶 Wineer 白酒推荐", canvas.width / 2, 110);
    ctx.fillStyle = "#a99a8c";
    ctx.font = "28px sans-serif";
    ctx.fillText("按真实需求生成的 Top 3 选择", canvas.width / 2, 160);

    let y = 240;
    lastTop3.forEach((r, index) => {
      const it = r.item;
      ctx.fillStyle = index === 0 ? "rgba(224,190,106,.16)" : "rgba(255,255,255,.05)";
      roundRect(ctx, 70, y, 760, 255, 28);
      ctx.fill();
      ctx.strokeStyle = index === 0 ? "rgba(224,190,106,.55)" : "rgba(255,255,255,.12)";
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = "#c9a24b";
      ctx.font = "700 26px sans-serif";
      ctx.fillText(`TOP ${index + 1}`, 110, y + 52);
      ctx.fillStyle = "#f2e9df";
      ctx.font = "700 36px sans-serif";
      drawWrappedText(ctx, it.name, 110, y + 105, 680, 44, 2);
      ctx.fillStyle = "#e0be6a";
      ctx.font = "26px sans-serif";
      ctx.fillText(`${it.aroma}型 · ${it.abv}度 · 约 ¥${it.price} · ${it.priceTier}`, 110, y + 178);
      ctx.fillStyle = "#a99a8c";
      ctx.font = "24px sans-serif";
      drawWrappedText(ctx, it.highlight, 110, y + 220, 680, 32, 1);
      y += 295;
    });

    ctx.textAlign = "center";
    ctx.fillStyle = "#a99a8c";
    ctx.font = "24px sans-serif";
    ctx.fillText("价格为市场参考，非实时报价。请理性饮酒。", canvas.width / 2, 1195);
    ctx.fillStyle = "#e0be6a";
    ctx.font = "28px sans-serif";
    ctx.fillText(new URL(location.href).host || "Wineer", canvas.width / 2, 1245);

    const a = document.createElement("a");
    a.download = "wineer-recommendation.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  function trackBuy(id) {
    const item = lastTop3.find(r => r.item.id === id)?.item;
    track("buy_click", { id, name: item?.name, answers: { ...answers } });
    return true;
  }

  function switchScreen(id) {
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0,0);
  }

  function restart() {
    track("restart", { from: "result" });
    switchScreen("ageGate");
  }

  load();

  return { startQuiz, setDim, recommend, restart, shareResult, downloadPoster, trackBuy };
})();
