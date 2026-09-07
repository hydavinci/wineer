const {
  RecommendationDataError,
  describeItem
} = require("../shared/recommender");

function uniqueWhy(why) {
  return [...new Set(Array.isArray(why) ? why : [])];
}

function toWhyText(why) {
  const reasons = uniqueWhy(why);
  return reasons.length > 0 ? reasons.slice(0, 4).join(" · ") : "按当前偏好综合排序";
}

function buildResultView(ranked) {
  return ranked.map(({ item, why, rankLabel, tradeoffs }, index) => {
    validateResultItem(item, index);

    return {
      id: item.id,
      rank: index + 1,
      name: item.name,
      brand: item.brand,
      aroma: item.aroma,
      abv: item.abv,
      price: item.price,
      priceTier: item.priceTier,
      region: item.region,
      tasteText: item.taste.join("、"),
      highlight: item.highlight,
      caution: item.caution,
      rankLabel,
      whyText: toWhyText(why),
      tradeoffText: tradeoffs.length ? tradeoffs.join(" · ") : "未发现明显偏好冲突，仍需留意口味和选购提示",
      ...describeItem(item)
    };
  });
}

function validateResultItem(item, index) {
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new RecommendationDataError(`Invalid item at index ${index}: expected object`);
  }

  validateStringArrayField(item, index, "taste");
  validateStringField(item, index, "region");
  validateStringField(item, index, "highlight");
  validateStringField(item, index, "caution");
}

function validateStringField(item, index, field) {
  if (typeof item[field] !== "string" || item[field].trim() === "") {
    throw new RecommendationDataError(`Invalid item at index ${index}: field ${field}`);
  }
}

function validateStringArrayField(item, index, field) {
  if (!Array.isArray(item[field]) || item[field].length === 0) {
    throw new RecommendationDataError(`Invalid item at index ${index}: field ${field}`);
  }

  item[field].forEach(value => {
    if (typeof value !== "string" || value.trim() === "") {
      throw new RecommendationDataError(`Invalid item at index ${index}: field ${field}`);
    }
  });
}

function purchaseKeyword(item) {
  return [
    item.name,
    item.volumeMl ? `${item.volumeMl}mL` : "",
    item.edition && !item.name.includes(item.edition) ? item.edition : ""
  ].filter(Boolean).join(" ");
}

function shareTitle(ranked) {
  return ranked.length > 0
    ? `Wineer 推荐：${ranked[0].item.name}`
    : "Wineer 白酒推荐";
}

module.exports = { buildResultView, purchaseKeyword, shareTitle };
