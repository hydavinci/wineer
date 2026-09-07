const { budgetOptions, budgetBand, validateItems, RecommendationDataError } = require("../shared/recommender");

function priceOptions() {
  let lower = 0;
  return [
    { value: "all", label: "全部价位", min: 0, max: Infinity },
    ...budgetOptions().map((option, index) => {
      const max = budgetBand(option.value).max;
      const label = !Number.isFinite(max) ? `${lower}元以上`
        : lower === 0 ? `${max}元及以下` : `${lower}–${max}元（不含${lower}）`;
      const range = { value: String(index), label, min: lower, max };
      lower = max;
      return range;
    })
  ];
}

function aromaOptions(items) {
  return [
    { value: "all", label: "全部香型" },
    ...[...new Set(items.map(item => item.aroma))].sort().map(aroma => ({
      value: aroma, label: `${aroma}型`
    }))
  ];
}

function normalizeSearch(value) {
  return value.normalize("NFKC").toLowerCase().trim();
}

function filterCatalog(items, { query = "", priceBand = "all", aroma = "all" } = {}) {
  validateItems(items);
  if (typeof query !== "string") throw new RecommendationDataError("Invalid catalog query");
  const range = priceOptions().find(option => option.value === priceBand);
  if (!range) throw new RecommendationDataError("Invalid catalog price band");
  if (!aromaOptions(items).some(option => option.value === aroma)) {
    throw new RecommendationDataError("Invalid catalog aroma");
  }
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return items.filter(item => {
    const text = normalizeSearch([
      item.name, item.brand, `${item.abv}度`,
      item.volumeMl ? `${item.volumeMl}ml` : "", item.edition || ""
    ].join(" "));
    return item.price > range.min && item.price <= range.max
      && (aroma === "all" || item.aroma === aroma)
      && tokens.every(token => text.includes(token));
  }).sort((left, right) => left.price - right.price
    || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0));
}

module.exports = { priceOptions, aromaOptions, filterCatalog };
