/* Wineer 白酒推荐引擎 v0.4 - 具体化 0~10 条目选择 */
const Wineer = (() => {
  let DB = [];
  let answers = defaultAnswers();
  let sharedAnswers = readAnswersFromUrl();
  let lastTop3 = [];

  const FAMOUS_BRANDS = new Set(["茅台", "五粮液", "泸州老窖", "汾酒", "剑南春", "郎酒", "习酒", "洋河", "舍得", "水井坊", "古井贡", "今世缘", "口子窖", "西凤", "董酒", "金沙", "国台", "珍酒", "全兴", "双沟", "宝丰", "酒鬼酒"]);
  const STEADY_AROMAS = new Set(["浓香", "清香", "米香", "兼香"]);
  const CHARACTER_AROMAS = new Set(["酱香", "凤香", "其他"]);

  const DIMENSIONS = [
    {
      key: "budget",
      title: "这瓶酒准备花多少钱？",
      left: "百元内",
      right: "1500+",
      hint: v => {
        if (v <= 1) return "100 元以内：日常口粮";
        if (v <= 3) return "100–200 元：朋友小聚/家宴口粮";
        if (v <= 5) return "200–500 元：中端宴请主力";
        if (v <= 7) return "500–900 元：商务/送礼比较体面";
        if (v <= 9) return "900–1500 元：高端名酒";
        return "1500 元以上：超高端/硬通货";
      }
    },
    {
      key: "occasion",
      title: "这瓶酒要多有“场面”？",
      left: "自己喝",
      right: "送礼商务",
      hint: v => {
        if (v <= 2) return "自己喝：酒质/性价比优先，包装不重要";
        if (v <= 4) return "熟人聚餐：好喝、别踩雷就行";
        if (v <= 6) return "家庭聚餐/朋友局：要兼顾口碑和价格";
        if (v <= 8) return "商务宴请：品牌认知和档次要够";
        return "送礼/收藏：名气、包装、流通性优先";
      }
    },
    {
      key: "softness",
      title: "能接受多冲、多烈？",
      left: "越柔越好",
      right: "高度够劲",
      hint: v => {
        if (v <= 2) return "要柔和低刺激，尽量别辣喉";
        if (v <= 5) return "能接受 50 度左右，入口别太冲";
        if (v <= 7) return "可以接受 53 度和更明显酒劲";
        return "喜欢高度、劲道、风味冲击";
      }
    },
    {
      key: "flavorWeight",
      title: "想要多重的香味？",
      left: "清爽干净",
      right: "厚重回味",
      hint: v => {
        if (v <= 2) return "清香/米香：干净、轻盈、好入口";
        if (v <= 5) return "浓香/兼香：香气明显但大众接受度高";
        if (v <= 7) return "更浓郁、有层次，能接受一点酱味";
        return "酱香/陈香/药香：风味厚、回味长";
      }
    },
    {
      key: "brandFace",
      title: "品牌名气/包装重要吗？",
      left: "只看酒质",
      right: "必须有面子",
      hint: v => {
        if (v <= 2) return "只看酒质和性价比，包装名气无所谓";
        if (v <= 5) return "希望品牌靠谱，但不用太贵太高调";
        if (v <= 8) return "需要大多数人认识，摆上桌有分量";
        return "送礼/商务优先：名酒、硬通货、包装体面";
      }
    },
    {
      key: "adventure",
      title: "愿不愿意尝试小众/个性款？",
      left: "稳妥不踩雷",
      right: "越特别越好",
      hint: v => {
        if (v <= 2) return "稳妥大众款，最好大家都容易接受";
        if (v <= 5) return "可以有一点特色，但不要太怪";
        if (v <= 7) return "愿意尝试酱香/凤香等更有辨识度的风格";
        return "小众香型、老酒客取向、个性风味都可以";
      }
    }
  ];

  function defaultAnswers() {
    return {
      budget: 4,
      occasion: 4,
      softness: 3,
      flavorWeight: 4,
      brandFace: 4,
      adventure: 3
    };
  }

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
    try {
      const res = await fetch("data/baijiu.json?v=" + Date.now());
      const json = await res.json();
      DB = json.items;
    } catch (e) {
      try {
        const res2 = await fetch("baijiu.json?v=" + Date.now());
        DB = (await res2.json()).items;
      } catch (e2) { alert("数据加载失败，请稍后再试"); }
    }
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

  function sceneTargets(v) {
    if (v <= 2) return ["自饮"];
    if (v <= 4) return ["朋友小聚", "自饮"];
    if (v <= 6) return ["家庭聚餐", "朋友小聚"];
    if (v <= 8) return ["商务宴请", "家庭聚餐"];
    return ["送礼", "收藏", "商务宴请"];
  }

  function budgetTier(v) {
    if (v <= 2) return "口粮";
    if (v <= 5) return "中端";
    if (v <= 8) return "高端";
    return "超高端";
  }

  function aromaTargets(v) {
    if (v <= 2) return ["清香", "米香"];
    if (v <= 5) return ["浓香", "兼香", "清香"];
    if (v <= 7) return ["浓香", "酱香", "兼香", "凤香"];
    return ["酱香", "其他", "凤香"];
  }

  function budgetCeiling(v) {
    if (v <= 1) return 100;
    if (v <= 3) return 200;
    if (v <= 5) return 500;
    if (v <= 7) return 900;
    if (v <= 9) return 1500;
    return Infinity;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function brandScore(item) {
    let s = 0;
    if (FAMOUS_BRANDS.has(item.brand)) s += 12;
    if (item.priceTier === "高端") s += 5;
    if (item.priceTier === "超高端") s += 10;
    if (item.scene.includes("送礼")) s += 4;
    if (item.scene.includes("商务宴请")) s += 4;
    return s;
  }

  // 打分匹配
  function scoreItem(item) {
    let s = 0; const why = [];

    // 预算：先按价位档加分，再对明显超预算做强惩罚，避免低预算推荐高端酒
    const tiers = ["口粮", "中端", "高端", "超高端"];
    const targetTier = budgetTier(answers.budget);
    const ceiling = budgetCeiling(answers.budget);
    const di = Math.abs(tiers.indexOf(item.priceTier) - tiers.indexOf(targetTier));
    if (di === 0) { s += 30; why.push("预算匹配"); }
    else if (di === 1) { s += 12; }
    else { s -= 14; }

    if (Number.isFinite(ceiling) && item.price > ceiling) {
      const overRatio = item.price / ceiling;
      if (overRatio <= 1.15) {
        s -= 8;
        why.push("略超预算");
      } else if (overRatio <= 1.5) {
        s -= 22;
      } else {
        s -= 45;
      }
    }

    // 场面/用途
    const scenes = sceneTargets(answers.occasion);
    if (scenes.some(sc => item.scene.includes(sc))) {
      s += 24;
      if (answers.occasion >= 7) why.push("适合宴请送礼");
      else if (answers.occasion <= 2) why.push("适合自饮");
      else why.push("场景合适");
    }

    // 柔和度/酒劲承受
    if (answers.softness <= 2) {
      s += (item.beginner - 3) * 7;
      if (item.abv <= 42) s += 6;
      if (item.abv >= 55) s -= 16;
      if (item.beginner >= 5) why.push("入口友好");
    } else if (answers.softness <= 5) {
      s += (item.beginner - 2) * 3;
      if (item.abv >= 60) s -= 10;
    } else if (answers.softness <= 7) {
      if (item.abv >= 50 && item.abv <= 53) s += 7;
    } else {
      if (item.abv >= 53) s += 10;
      if (item.abv >= 56) s += 5;
      why.push("酒劲够");
    }

    // 香味厚重程度
    const aromas = aromaTargets(answers.flavorWeight);
    if (aromas.includes(item.aroma)) {
      s += 22;
      if (["清香", "米香"].includes(item.aroma)) why.push("清爽干净");
      else if (item.aroma === "浓香") why.push("香气浓郁");
      else why.push("风味有辨识度");
    }

    // 品牌/面子需求
    if (answers.brandFace <= 2) {
      if (item.priceTier === "口粮" || item.priceTier === "中端") s += 6;
      if (!FAMOUS_BRANDS.has(item.brand)) s += 3;
    } else if (answers.brandFace <= 5) {
      if (FAMOUS_BRANDS.has(item.brand)) s += 6;
    } else {
      const b = brandScore(item);
      s += Math.round(b * (answers.brandFace / 10));
      if (b >= 18) why.push("品牌有面子");
    }

    // 尝新/个性程度
    if (answers.adventure <= 2) {
      if (STEADY_AROMAS.has(item.aroma)) s += 10;
      if (item.beginner >= 4) s += 5;
      if (CHARACTER_AROMAS.has(item.aroma) && item.beginner <= 2) s -= 10;
      why.push("稳妥不踩雷");
    } else if (answers.adventure <= 5) {
      if (item.aroma === "兼香" || item.aroma === "酱香") s += 4;
    } else {
      if (CHARACTER_AROMAS.has(item.aroma)) s += 12;
      if (item.beginner <= 2) s += 6;
      why.push("个性风味");
    }

    return { item, score: s, why };
  }

  function recommend() {
    if (DB.length === 0) {
      load().then(recommend);
      return;
    }
    const ceiling = budgetCeiling(answers.budget);
    const ranked = DB.map(scoreItem).sort((a,b)=>b.score-a.score);
    const withinBudget = Number.isFinite(ceiling)
      ? ranked.filter(r => r.item.price <= ceiling * 1.15)
      : ranked;
    // 优先保证推荐不明显超预算；若可选项不足，再回退到全库排序。
    const top3 = (withinBudget.length >= 3 ? withinBudget : ranked).slice(0, 3);
    lastTop3 = top3;
    track("recommend", {
      answers: { ...answers },
      top3: top3.map(r => ({ id: r.item.id, name: r.item.name, score: r.score, price: r.item.price }))
    });
    renderResult(top3);
    switchScreen("result");
  }

  function renderResult(top3) {
    const bestScore = Math.max(...top3.map(r => r.score), 1);
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
          const pct = Math.max(60, Math.min(99, Math.round(r.score / bestScore * 96)));
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
