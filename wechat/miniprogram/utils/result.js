function uniqueWhy(why) {
  return [...new Set(Array.isArray(why) ? why : [])];
}

function toWhyText(why) {
  const reasons = uniqueWhy(why);
  return reasons.length > 0 ? reasons.slice(0, 4).join(" · ") : "综合条件最优";
}

function buildResultView(ranked) {
  return ranked.map(({ item, why, matchPercent }, index) => ({
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
    matchPercent,
    whyText: toWhyText(why)
  }));
}

function purchaseKeyword(item) {
  return `${item.name} 京东搜索`;
}

function shareTitle(ranked) {
  return ranked.length > 0
    ? `Wineer 推荐：${ranked[0].item.name}`
    : "Wineer 白酒推荐";
}

module.exports = { buildResultView, purchaseKeyword, shareTitle };
