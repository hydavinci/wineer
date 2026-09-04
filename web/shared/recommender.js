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
    }
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

    const targetTier = budgetTier(answers.budget);
    const ceiling = budgetCeiling(answers.budget);
    const di = Math.abs(PRICE_TIERS.indexOf(item.priceTier) - PRICE_TIERS.indexOf(targetTier));
    if (di === 0) {
      s += 30;
      why.push("预算匹配");
    } else if (di === 1) {
      s += 12;
    } else {
      s -= 14;
    }

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

    const scenes = sceneTargets(answers.occasion);
    if (scenes.some(sc => item.scene.includes(sc))) {
      s += 24;
      if (answers.occasion >= 7) why.push("适合宴请送礼");
      else if (answers.occasion <= 2) why.push("适合自饮");
      else why.push("场景合适");
    }

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

    const aromas = aromaTargets(answers.flavorWeight);
    if (aromas.includes(item.aroma)) {
      s += 22;
      if (["清香", "米香"].includes(item.aroma)) why.push("清爽干净");
      else if (item.aroma === "浓香") why.push("香气浓郁");
      else why.push("风味有辨识度");
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

  function recommend(items, inputAnswers, limit = 3) {
    validateItems(items);
    const answers = normalizeAnswers(inputAnswers);
    const resultLimit = Math.max(0, Math.floor(Number(limit) || 0));
    const ceiling = budgetCeiling(answers.budget);
    const ranked = items
      .map((item, index) => ({ ...scoreItem(item, answers), index }))
      .sort((left, right) => right.score - left.score || left.index - right.index);
    const withinBudget = Number.isFinite(ceiling)
      ? ranked.filter(({ item }) => item.price <= ceiling * 1.15)
      : ranked;
    const selected = (withinBudget.length >= resultLimit ? withinBudget : ranked)
      .slice(0, resultLimit);
    const bestScore = Math.max(...selected.map(({ score }) => score), 1);
    return selected.map(({ index, ...entry }) => ({
      ...entry,
      matchPercent: Math.max(60, Math.min(99, Math.round(entry.score / bestScore * 96)))
    }));
  }

  return {
    DIMENSIONS,
    RecommendationDataError,
    defaultAnswers,
    normalizeAnswers,
    scoreItem,
    recommend
  };
});
