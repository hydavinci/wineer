/* Wineer 白酒推荐引擎 v0.2 - 0~10 维度选择 */
const Wineer = (() => {
  let DB = [];
  let answers = {
    scene: 3,
    budget: 4,
    aroma: 4,
    drinker: 3
  };

  const DIMENSIONS = [
    {
      key: "scene",
      title: "使用场景",
      left: "自己喝",
      right: "高规格",
      hint: v => {
        if (v <= 2) return "自饮 / 日常口粮";
        if (v <= 5) return "家庭聚餐 / 朋友小聚";
        if (v <= 7) return "商务宴请";
        if (v <= 9) return "送礼";
        return "收藏 / 投资";
      }
    },
    {
      key: "budget",
      title: "预算档位",
      left: "口粮价",
      right: "高端价",
      hint: v => {
        if (v <= 2) return "150 元以内";
        if (v <= 5) return "150 – 600 元";
        if (v <= 8) return "600 – 1500 元";
        return "1500 元以上";
      }
    },
    {
      key: "aroma",
      title: "口味偏好",
      left: "清淡干净",
      right: "酱香厚重",
      hint: v => {
        if (v <= 2) return "清香 / 米香，清淡好入口";
        if (v <= 5) return "浓香 / 兼香，醇厚但不极端";
        if (v <= 7) return "浓郁、有层次";
        return "酱香、回味长、风味重";
      }
    },
    {
      key: "drinker",
      title: "饮者经验",
      left: "新手少喝",
      right: "老酒客",
      hint: v => {
        if (v <= 2) return "新手 / 平时少喝，要柔和低刺激";
        if (v <= 6) return "常喝，有一定基础";
        return "老酒客，接受高度数和个性风味";
      }
    }
  ];

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
    answers = { scene: 3, budget: 4, aroma: 4, drinker: 3 };
    renderTuner();
    if (DB.length === 0) load();
  }

  function renderTuner() {
    const html = `
      <div class="tuner-head">
        <div class="q-title">调一下你的偏好</div>
        <div class="q-sub">每个维度 0–10，越往右代表需求越强</div>
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
      <button class="btn primary" onclick="Wineer.recommend()">生成推荐</button>
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
    if (v <= 5) return ["家庭聚餐", "朋友小聚"];
    if (v <= 7) return ["商务宴请", "家庭聚餐"];
    if (v <= 9) return ["送礼", "商务宴请"];
    return ["收藏", "送礼"];
  }

  function budgetTier(v) {
    if (v <= 2) return "口粮";
    if (v <= 5) return "中端";
    if (v <= 8) return "高端";
    return "超高端";
  }

  function aromaTargets(v) {
    if (v <= 2) return ["清香", "米香"];
    if (v <= 5) return ["浓香", "兼香"];
    if (v <= 7) return ["浓香", "酱香", "兼香"];
    return ["酱香"];
  }

  // 打分匹配
  function scoreItem(item) {
    let s = 0; const why = [];

    // 场景：连续分值映射到一个或两个目标场景
    const scenes = sceneTargets(answers.scene);
    if (scenes.some(sc => item.scene.includes(sc))) {
      s += 30; why.push("场景匹配");
    }

    // 预算：同档满分，相邻给部分分，差远扣分
    const tiers = ["口粮", "中端", "高端", "超高端"];
    const targetTier = budgetTier(answers.budget);
    const di = Math.abs(tiers.indexOf(item.priceTier) - tiers.indexOf(targetTier));
    if (di === 0) { s += 32; why.push("预算契合"); }
    else if (di === 1) { s += 12; }
    else { s -= 12; }

    // 香型：0 清淡，10 酱香；中段兼容浓香/兼香
    const aromas = aromaTargets(answers.aroma);
    if (aromas.includes(item.aroma)) {
      s += 24;
      if (["清香", "米香"].includes(item.aroma)) why.push("清淡好入口");
      else why.push(item.aroma + "型对味");
    }

    // 饮者经验：新手奖励 beginner，老酒客奖励高度数/个性款
    if (answers.drinker <= 2) {
      s += (item.beginner - 3) * 9;
      if (item.abv >= 55) s -= 18;
      if (item.beginner >= 5) why.push("新手友好");
    } else if (answers.drinker >= 7) {
      if (item.abv >= 53) s += 10;
      if (item.beginner <= 2) s += 8;
      if (["酱香", "凤香", "其他"].includes(item.aroma)) s += 5;
    } else {
      s += (item.beginner - 2) * 3;
    }

    return { item, score: s, why };
  }

  function recommend() {
    if (DB.length === 0) {
      load().then(recommend);
      return;
    }
    const ranked = DB.map(scoreItem).sort((a,b)=>b.score-a.score);
    renderResult(ranked.slice(0, 3));
    switchScreen("result");
  }

  function renderResult(top3) {
    const maxScore = 96;
    const html = `
      <div class="result-head">
        <div class="lead">为你推荐</div>
        <div class="bottle">🍶</div>
        <div class="r-name">Top 3 白酒选择</div>
      </div>
      <div class="top3-list">
        ${top3.map((r, index) => {
          const it = r.item;
          const pct = Math.max(40, Math.min(99, Math.round(r.score / maxScore * 100)));
          const buyUrl = "https://search.jd.com/Search?keyword=" + encodeURIComponent(it.name);
          const whyText = r.why.length ? [...new Set(r.why)].join(" · ") : "综合条件最优";
          return `
            <div class="top-card ${index === 0 ? "top-card-main" : ""}">
              <div class="top-rank">TOP ${index + 1}</div>
              <div class="top-name">${it.name}</div>
              <div class="match-score">匹配度 ${pct}% · ${whyText}</div>
              <div class="r-tags">
                <span class="tag">${it.aroma}型</span>
                <span class="tag">${it.abv}度</span>
                <span class="tag">约 ¥${it.price}</span>
                <span class="tag">${it.priceTier}</span>
                <span class="tag">${it.region}</span>
              </div>
              <div class="r-block">
                <h4>💡 推荐理由</h4>
                <p>${it.highlight}</p>
              </div>
              <div class="r-block">
                <h4>👅 口感特点</h4>
                <p>${it.taste.join("、")}</p>
              </div>
              <div class="r-block r-caution">
                <h4>⚠️ 选购提示</h4>
                <p>${it.caution}</p>
              </div>
              <a class="btn-buy" href="${buyUrl}" target="_blank" rel="noopener">去看看 / 比价 →</a>
            </div>
          `;
        }).join("")}
      </div>
    `;
    document.getElementById("resultArea").innerHTML = html;
  }

  function switchScreen(id) {
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0,0);
  }

  function restart() { switchScreen("ageGate"); }

  load();

  return { startQuiz, setDim, recommend, restart };
})();
