/* Wineer 白酒推荐引擎 v0.1 */
const Wineer = (() => {
  let DB = [];
  let answers = {};
  let current = 0;

  // 问卷定义。每题的选项携带打分权重，映射到酒款字段。
  const QUESTIONS = [
    {
      key: "scene", title: "这瓶酒主要用来做什么？", sub: "场景决定档次和品牌需求",
      options: [
        {emoji:"🍜", label:"自己小酌 / 日常口粮", sub:"实惠、纯粮、好入口", val:"自饮"},
        {emoji:"👨‍👩‍👧", label:"家庭聚餐 / 朋友小聚", sub:"性价比 + 场面兼顾", val:"家庭聚餐"},
        {emoji:"💼", label:"商务宴请", sub:"要有牌面、拿得出手", val:"商务宴请"},
        {emoji:"🎁", label:"送礼", sub:"包装体面、品牌认知高", val:"送礼"},
        {emoji:"🏆", label:"收藏 / 投资", sub:"看重品牌与升值", val:"收藏"}
      ]
    },
    {
      key: "budget", title: "预算大概多少（每瓶）？", sub: "价格决定档次",
      options: [
        {emoji:"💵", label:"150 元以内", sub:"口粮档", val:"口粮"},
        {emoji:"💴", label:"150 – 600 元", sub:"中端主力", val:"中端"},
        {emoji:"💰", label:"600 – 1500 元", sub:"高端", val:"高端"},
        {emoji:"💎", label:"1500 元以上", sub:"超高端 / 名酒", val:"超高端"}
      ]
    },
    {
      key: "aroma", title: "偏好什么香型口感？", sub: "不确定就选“交给你推荐”",
      options: [
        {emoji:"🌾", label:"清淡干净，好入口", sub:"清香 / 米香 · 新手友好", val:"清淡"},
        {emoji:"🔥", label:"浓郁醇厚，有层次", sub:"浓香型", val:"浓香"},
        {emoji:"🍯", label:"酱香酱味，回味长", sub:"酱香型 · 偏老练", val:"酱香"},
        {emoji:"⚖️", label:"兼顾几种，平衡协调", sub:"兼香型", val:"兼香"},
        {emoji:"🎲", label:"不懂，交给你推荐", sub:"按其它条件匹配", val:"any"}
      ]
    },
    {
      key: "drinker", title: "喝的人酒量/经验如何？", sub: "决定度数与上手难度",
      options: [
        {emoji:"🌱", label:"新手 / 平时少喝", sub:"要柔和、低刺激", val:"beginner"},
        {emoji:"🍺", label:"常喝，有一定基础", sub:"接受多数风味", val:"regular"},
        {emoji:"🥃", label:"老酒客，重口不怕烈", sub:"要够劲、有个性", val:"pro"}
      ]
    }
  ];

  async function load() {
    try {
      const res = await fetch("data/baijiu.json?v=" + Date.now());
      const json = await res.json();
      DB = json.items;
    } catch (e) {
      // 部署到同目录时的回退路径
      try {
        const res2 = await fetch("baijiu.json?v=" + Date.now());
        DB = (await res2.json()).items;
      } catch (e2) { alert("数据加载失败，请稍后再试"); }
    }
  }

  function startQuiz() {
    switchScreen("quiz");
    answers = {}; current = 0;
    if (DB.length === 0) load().then(renderQuestion); else renderQuestion();
  }

  function renderQuestion() {
    const q = QUESTIONS[current];
    document.getElementById("progressBar").style.width =
      ((current) / QUESTIONS.length * 100) + "%";
    const html = `
      <div class="q-title">${q.title}</div>
      <div class="q-sub">${q.sub}</div>
      <div class="options">
        ${q.options.map((o,i)=>`
          <div class="opt" onclick="Wineer.answer('${q.key}','${o.val}')">
            <span class="emoji">${o.emoji}</span>
            <span class="opt-main">
              <span>${o.label}</span>
              <span class="opt-sub">${o.sub}</span>
            </span>
          </div>`).join("")}
      </div>`;
    document.getElementById("questionArea").innerHTML = html;
  }

  function answer(key, val) {
    answers[key] = val;
    current++;
    if (current < QUESTIONS.length) renderQuestion();
    else { document.getElementById("progressBar").style.width = "100%"; recommend(); }
  }

  // 打分匹配
  function scoreItem(item) {
    let s = 0; const why = [];
    // 场景
    if (item.scene.includes(answers.scene)) { s += 30; why.push("场景匹配"); }
    // 预算（同档满分，相邻档半分）
    const tiers = ["口粮","中端","高端","超高端"];
    const di = Math.abs(tiers.indexOf(item.priceTier) - tiers.indexOf(answers.budget));
    if (di === 0) { s += 30; why.push("预算契合"); }
    else if (di === 1) { s += 12; }
    else { s -= 10; }
    // 香型
    if (answers.aroma === "any") { s += 8; }
    else if (answers.aroma === "清淡") {
      if (["清香","米香"].includes(item.aroma)) { s += 22; why.push("清淡好入口"); }
    } else if (item.aroma === answers.aroma) { s += 22; why.push(item.aroma + "型对味"); }
    // 饮者
    if (answers.drinker === "beginner") {
      s += (item.beginner - 3) * 8;
      if (item.abv >= 55) s -= 15;
      if (item.beginner >= 5) why.push("新手友好");
    } else if (answers.drinker === "pro") {
      if (item.abv >= 53) s += 8;
      if (item.beginner <= 2) s += 6;
    } else {
      s += (item.beginner - 2) * 3;
    }
    return { item, score: s, why };
  }

  function recommend() {
    const ranked = DB.map(scoreItem).sort((a,b)=>b.score-a.score);
    const top = ranked[0];
    const runners = ranked.slice(1,4);
    renderResult(top, runners);
    switchScreen("result");
  }

  function renderResult(top, runners) {
    const it = top.item;
    const maxScore = 90;
    const pct = Math.max(40, Math.min(99, Math.round(top.score / maxScore * 100)));
    // 购买跳转：京东搜索占位（未来替换为联盟返佣链接）
    const buyUrl = "https://search.jd.com/Search?keyword=" + encodeURIComponent(it.name);
    const whyText = top.why.length ? top.why.join(" · ") : "综合条件最优";
    const html = `
      <div class="result-head">
        <div class="lead">为你推荐</div>
        <div class="bottle">🍶</div>
        <div class="r-name">${it.name}</div>
      </div>
      <div class="match-score">匹配度 ${pct}% · ${whyText}</div>
      <div class="r-tags">
        <span class="tag">${it.aroma}型</span>
        <span class="tag">${it.abv}度</span>
        <span class="tag">约 ¥${it.price}</span>
        <span class="tag">${it.priceTier}</span>
        <span class="tag">${it.region}</span>
      </div>
      <div class="r-block">
        <h4>💡 为什么推荐它</h4>
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
      ${runners.length ? `
      <div class="runner-up">
        <div class="ru-title">你也可以考虑</div>
        ${runners.map(r=>`
          <div class="ru-item">
            <span>${r.item.name} · ${r.item.aroma}型</span>
            <span class="ru-price">¥${r.item.price}</span>
          </div>`).join("")}
      </div>` : ""}
    `;
    document.getElementById("resultArea").innerHTML = html;
  }

  function switchScreen(id) {
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    window.scrollTo(0,0);
  }

  function restart() { switchScreen("ageGate"); }

  // 预加载数据
  load();

  return { startQuiz, answer, restart };
})();
