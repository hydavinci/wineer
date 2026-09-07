const fs = require("node:fs");
const path = require("node:path");
const { recommend, budgetOptions, validateItems, priceConfidence } = require("../shared/recommender");

function reviewCatalog(items, { asOf = new Date().toISOString().slice(0, 10) } = {}) {
  validateItems(items);
  const date = new Date(`${asOf}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || !Number.isFinite(date.getTime())
    || date.toISOString().slice(0, 10) !== asOf) throw new Error("Invalid review date");
  const counts = new Map(items.map(item => [item.id, { top3Count: 0, firstChoiceCount: 0 }]));
  let profileCount = 0;
  let sameBrandTop3Profiles = 0;
  for (const { value: budget } of budgetOptions())
    for (const occasion of [1, 4, 5, 8, 10])
      for (const softness of [0, 5, 10])
        for (const flavorWeight of [0, 5, 10])
          for (const brandFace of [0, 5, 10])
            for (const adventure of [0, 5, 10]) {
              const ranked = recommend(items, { budget, occasion, softness, flavorWeight, brandFace, adventure });
              profileCount += 1;
              ranked.forEach(({ item }, index) => {
                counts.get(item.id).top3Count += 1;
                if (index === 0) counts.get(item.id).firstChoiceCount += 1;
              });
              if (ranked.length === 3 && new Set(ranked.map(({ item }) => item.brand)).size === 1) {
                sameBrandTop3Profiles += 1;
              }
            }
  const compareId = (left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  const exposure = items.map(item => ({ id: item.id, ...counts.get(item.id) })).sort(compareId);
  const priority = items.map(item => {
    const reasons = [];
    if (!priceConfidence(item)) reasons.push("price-unverified");
    for (const field of ["volumeMl", "edition", "source"]) {
      if (item[field] == null) reasons.push(`${field}-missing`);
    }
    if (item.priceUpdated) {
      const days = (date - new Date(`${item.priceUpdated}T00:00:00Z`)) / 86400000;
      if (days < 0) reasons.push("future-observation");
      if (days > 90) reasons.push("observation-older-than-90-days");
    }
    return { id: item.id, name: item.name, ...counts.get(item.id), reasons };
  }).filter(entry => entry.reasons.length)
    .sort((left, right) => right.top3Count - left.top3Count
      || right.reasons.length - left.reasons.length || compareId(left, right));
  const notSeenIds = exposure.filter(entry => !entry.top3Count).map(entry => entry.id);
  return {
    asOf, total: items.length, profileCount,
    note: "仅为固定偏好网格抽样，未出现不代表永不推荐；90天是人工复核提醒，观察日期不代表报价发布日期或成交日期。",
    coverage: { recommendedCount: items.length - notSeenIds.length, notSeenIds, sameBrandTop3Profiles },
    exposure, priority
  };
}

if (require.main === module) {
  const data = JSON.parse(fs.readFileSync(process.argv[2] || path.resolve(__dirname, "../data/baijiu.json"), "utf8"));
  console.log(JSON.stringify(reviewCatalog(data.items, { asOf: process.argv[3] }), null, 2));
}

module.exports = { reviewCatalog };
