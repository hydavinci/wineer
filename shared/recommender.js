(function initRecommender(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.WineerRecommender = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createRecommender() {
  "use strict";

  const ANSWER_KEYS = [
    "budget", "occasion", "softness", "flavorWeight", "brandFace", "adventure"
  ];
  const DEFAULT_ANSWERS = {
    budget: 4,
    occasion: 4,
    softness: 3,
    flavorWeight: 4,
    brandFace: 4,
    adventure: 3
  };

  const FAMOUS_BRANDS = new Set(["茅台", "五粮液", "泸州老窖", "汾酒", "剑南春", "郎酒", "习酒", "洋河", "舍得", "水井坊", "古井贡", "今世缘", "口子窖", "西凤", "董酒", "金沙", "国台", "珍酒", "全兴", "双沟", "宝丰", "酒鬼酒"]);
  const STEADY_AROMAS = new Set(["浓香", "清香", "米香", "兼香"]);
  const CHARACTER_AROMAS = new Set(["酱香", "凤香", "其他"]);
  const PRICE_TIERS = ["口粮", "中端", "高端", "超高端"];
  const PRICE_BASES = {
    estimate: "未核实估值",
    retail: "商家报价",
    msrp: "官方指导价",
    listing: "挂牌价"
  };
  const BUDGET_BANDS = [
    { end: 1, max: 100, tier: "口粮", label: "每瓶最高 100 元" },
    { end: 3, max: 200, tier: "中端", label: "每瓶最高 200 元" },
    { end: 5, max: 500, tier: "中端", label: "每瓶最高 500 元" },
    { end: 7, max: 900, tier: "高端", label: "每瓶最高 900 元" },
    { end: 9, max: 1500, tier: "高端", label: "每瓶最高 1500 元" },
    { end: 10, max: Infinity, tier: "超高端", label: "预算不限，可接受 1500 元以上" }
  ];

  function budgetBand(value) {
    const budget = normalizeAnswers({ budget: value }).budget;
    return { ...BUDGET_BANDS.find(band => budget <= band.end) };
  }

  function budgetOptions() {
    return BUDGET_BANDS.map((band, index) => ({
      value: index === 0 ? 0 : BUDGET_BANDS[index - 1].end + 1,
      end: band.end,
      label: Number.isFinite(band.max) ? `${band.max} 元内` : "不限预算"
    }));
  }

  const DIMENSIONS = [
    {
      key: "budget",
      title: "每瓶最多愿意花多少钱？",
      left: "百元内",
      right: "不限",
      hint: v => `${budgetBand(v).label}；合适的低价款也会推荐`
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

  class RecommendationDataError extends Error {
    constructor(message) {
      super(message);
      this.name = "RecommendationDataError";
    }
  }

  function defaultAnswers() {
    return { ...DEFAULT_ANSWERS };
  }

  function normalizeAnswers(input = {}) {
    const normalized = defaultAnswers();
    if (!input || typeof input !== "object") return normalized;
    for (const key of ANSWER_KEYS) {
      const numeric = Number(input[key]);
      if (!Number.isFinite(numeric)) continue;
      normalized[key] = Math.max(0, Math.min(10, Math.round(numeric)));
    }
    return normalized;
  }

  function sceneTargets(v) {
    if (v <= 2) return ["自饮"];
    if (v <= 4) return ["朋友小聚", "自饮"];
    if (v <= 6) return ["家庭聚餐", "朋友小聚"];
    if (v <= 8) return ["商务宴请", "家庭聚餐"];
    return ["送礼", "收藏", "商务宴请"];
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

  function validateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new RecommendationDataError("Invalid items dataset: expected a non-empty array");
    }

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new RecommendationDataError(`Invalid item at index ${index}: expected object`);
      }

      validateStringField(item, index, "id");
      validateStringField(item, index, "name");
      validateStringField(item, index, "brand");
      validateStringField(item, index, "aroma");
      validateNumberField(item, index, "abv");
      validateNumberField(item, index, "price");
      if (item.price <= 0) {
        throw new RecommendationDataError(`Invalid item at index ${index}: field price`);
      }
      validateStringField(item, index, "priceTier");
      if (!PRICE_TIERS.includes(item.priceTier)) {
        throw new RecommendationDataError(`Invalid item at index ${index}: field priceTier`);
      }
      if (!Number.isInteger(item.beginner)) {
        throw new RecommendationDataError(`Invalid item at index ${index}: field beginner`);
      }
      if (!Array.isArray(item.scene)) {
        throw new RecommendationDataError(`Invalid item at index ${index}: field scene`);
      }
      validateCatalogFields(item, index);
    }
  }

  function validateCatalogFields(item, index) {
    const invalid = field => {
      throw new RecommendationDataError(`Invalid item at index ${index}: field ${field}`);
    };
    if (item.volumeMl != null && (!Number.isFinite(item.volumeMl) || item.volumeMl <= 0)) {
      invalid("volumeMl");
    }
    for (const field of ["edition", "source", "priceSource", "priceUpdated"]) {
      if (item[field] == null) continue;
      validateStringField(item, index, field);
      if (["source", "priceSource"].includes(field) && !/^https:\/\/[^/\s]+(?:\/[^\s]*)?$/.test(item[field])) {
        invalid(field);
      }
    }
    if (item.priceUpdated != null) {
      const date = new Date(`${item.priceUpdated}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(item.priceUpdated)
        || !Number.isFinite(date.getTime())
        || date.toISOString().slice(0, 10) !== item.priceUpdated) invalid("priceUpdated");
    }
    if (item.priceBasis != null) {
      validateStringField(item, index, "priceBasis");
      if (!Object.prototype.hasOwnProperty.call(PRICE_BASES, item.priceBasis)) invalid("priceBasis");
      if (item.priceBasis !== "estimate" && (!item.priceSource || !item.priceUpdated)) {
        invalid("priceBasis: a quote requires its source and observation date");
      }
    }
  }

  function describeItem(item) {
    const notices = [];
    if (!item.volumeMl || !item.edition) notices.push("规格或版本待核实");
    if (!item.source) notices.push("资料来源待核实");
    if (!item.priceSource || !item.priceUpdated || item.priceBasis === "estimate") {
      notices.push("参考价格待核实");
    }
    if (item.priceBasis === "msrp") notices.push("官方指导价，非成交价");
    if (item.priceBasis === "listing") notices.push("挂牌价，非成交价");
    if (item.priceBasis === "retail") notices.push("商家报价，以结算页为准");
    if (!item.priceBasis && item.priceSource && item.priceUpdated) notices.push("价格口径待核实");
    notices.push("非实时报价，成交价可能超出预算");
    return {
      qualityNotice: notices.join("；"),
      specText: `${item.volumeMl ? `${item.volumeMl}mL` : "容量待核实"} · ${item.edition || "版本待核实"}`,
      priceNote: [
        `价格口径：${PRICE_BASES[item.priceBasis] || "待核实"}`,
        item.priceUpdated ? `价格记录日期：${item.priceUpdated}` : "价格日期待核实",
        item.priceSource ? `价格来源：${item.priceSource}` : "价格来源待核实"
      ].join(" · "),
      sourceText: item.source ? `酒款资料：${item.source}` : "酒款资料来源待核实"
    };
  }

  function validateStringField(item, index, field) {
    if (typeof item[field] !== "string" || item[field].trim() === "") {
      throw new RecommendationDataError(`Invalid item at index ${index}: field ${field}`);
    }
  }

  function validateNumberField(item, index, field) {
    if (!Number.isFinite(item[field])) {
      throw new RecommendationDataError(`Invalid item at index ${index}: field ${field}`);
    }
  }

  function scoreItem(item, answers) {
    let s = 0;
    const why = [];
    const tradeoffs = [];

    const { tier: targetTier, max: ceiling } = budgetBand(answers.budget);
    const di = Math.abs(PRICE_TIERS.indexOf(item.priceTier) - PRICE_TIERS.indexOf(targetTier));
    if (di === 0) {
      s += 30;
    } else if (di === 1) {
      s += 12;
    } else {
      s -= 14;
    }
    if (item.price <= ceiling) why.push("参考价在预算内");

    if (Number.isFinite(ceiling) && item.price > ceiling) {
      const overRatio = item.price / ceiling;
      if (overRatio <= 1.15) {
        s -= 8;
      } else if (overRatio <= 1.5) {
        s -= 22;
      } else {
        s -= 45;
      }
      tradeoffs.push("参考价超出预算");
    }

    const scenes = sceneTargets(answers.occasion);
    if (scenes.some(sc => item.scene.includes(sc))) {
      s += 24;
      if (answers.occasion >= 9 && item.scene.includes("送礼")) why.push("适合送礼");
      else if (answers.occasion >= 7 && item.scene.includes("商务宴请")) why.push("适合商务宴请");
      else if (answers.occasion <= 2) why.push("适合自饮");
      else why.push("场景合适");
    } else {
      tradeoffs.push("并非所选场景的典型用酒");
    }

    if (answers.softness <= 2) {
      s += (item.beginner - 3) * 7;
      if (item.abv <= 42) s += 6;
      if (item.abv >= 55) s -= 16;
      if (item.beginner >= 5) why.push("入口友好");
      if (item.abv >= 50 || item.beginner <= 2) tradeoffs.push("度数或风味刺激感可能偏高");
    } else if (answers.softness <= 5) {
      s += (item.beginner - 2) * 3;
      if (item.abv >= 60) s -= 10;
    } else if (answers.softness <= 7) {
      if (item.abv >= 50 && item.abv <= 53) s += 7;
    } else {
      if (item.abv >= 53) s += 10;
      if (item.abv >= 56) s += 5;
      if (item.abv >= 53) why.push("酒劲够");
      else tradeoffs.push("度数偏低，可能不够浓烈");
    }

    const aromas = aromaTargets(answers.flavorWeight);
    if (aromas.includes(item.aroma)) {
      s += 22;
      if (["清香", "米香"].includes(item.aroma)) why.push("清爽干净");
      else if (item.aroma === "浓香") why.push("香气浓郁");
      else why.push("风味有辨识度");
    } else {
      tradeoffs.push("香型与偏好存在差异");
    }

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

    if (answers.adventure <= 2) {
      if (STEADY_AROMAS.has(item.aroma)) s += 10;
      if (item.beginner >= 4) s += 5;
      if (CHARACTER_AROMAS.has(item.aroma) && item.beginner <= 2) s -= 10;
      if (STEADY_AROMAS.has(item.aroma) && item.beginner >= 4) why.push("大众易接受");
      else if (item.beginner <= 2) tradeoffs.push("风味接受度因人而异");
    } else if (answers.adventure <= 5) {
      if (item.aroma === "兼香" || item.aroma === "酱香") s += 4;
    } else {
      if (CHARACTER_AROMAS.has(item.aroma)) s += 12;
      if (item.beginner <= 2) s += 6;
      if (CHARACTER_AROMAS.has(item.aroma) || item.beginner <= 2) why.push("个性风味");
      else tradeoffs.push("风味偏大众，尝新感可能有限");
    }

    return { item, score: s, why, tradeoffs };
  }

  function recommend(items, inputAnswers, limit = 3) {
    validateItems(items);
    const answers = normalizeAnswers(inputAnswers);
    const resultLimit = Math.max(0, Math.floor(Number(limit) || 0));
    const ceiling = budgetBand(answers.budget).max;
    const ranked = items
      .map(item => scoreItem(item, answers))
      .sort((left, right) =>
        right.score - left.score
        || left.tradeoffs.length - right.tradeoffs.length
        || left.item.price - right.item.price
        || (left.item.id < right.item.id ? -1 : left.item.id > right.item.id ? 1 : 0)
      );
    const withinBudget = Number.isFinite(ceiling)
      ? ranked.filter(({ item }) => item.price <= ceiling)
      : ranked;
    const selected = withinBudget.slice(0, resultLimit);
    const bestScore = Math.max(...selected.map(({ score }) => score), 1);
    return selected.map((entry, position) => ({
      ...entry,
      rankLabel: position === 0 ? "优先推荐" : `备选 ${position}`,
      matchPercent: Math.max(60, Math.min(99, Math.round(entry.score / bestScore * 96)))
    }));
  }

  return {
    DIMENSIONS,
    RecommendationDataError,
    defaultAnswers,
    budgetBand,
    budgetOptions,
    describeItem,
    validateItems,
    normalizeAnswers,
    scoreItem,
    recommend
  };
});
