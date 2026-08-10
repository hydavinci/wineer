/* Wineer 白酒推荐引擎 v0.4 - 具体化 0~10 条目选择 */
const Wineer = (() => {
  let DB = [];
  let answers = defaultAnswers();

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
    answers = defaultAnswers();
    renderTuner();
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

    // 预算
    const tiers = ["口粮", "中端", "高端", "超高端"];
    const targetTier = budgetTier(answers.budget);
    const di = Math.abs(tiers.indexOf(item.priceTier) - tiers.indexOf(targetTier));
    if (di === 0) { s += 30; why.push("预算匹配"); }
    else if (di === 1) { s += 12; }
    else { s -= 14; }

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
    const ranked = DB.map(scoreItem).sort((a,b)=>b.score-a.score);
    renderResult(ranked.slice(0, 3));
    switchScreen("result");
  }

  function renderResult(top3) {
    const maxScore = 125;
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
          const whyText = r.why.length ? [...new Set(r.why)].slice(0, 4).join(" · ") : "综合条件最优";
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
