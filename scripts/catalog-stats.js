const fs = require("node:fs");
const path = require("node:path");
const { budgetOptions, budgetBand, validateItems } = require("../shared/recommender");

function priceSummary(items) {
  const counts = { estimate: 0, retail: 0, msrp: 0, listing: 0, unspecified: 0 };
  let unverifiedPrices = 0;
  for (const item of items) {
    const basis = item.priceBasis || "unspecified";
    counts[basis] += 1;
    if (basis === "estimate" || basis === "unspecified" || !item.priceSource || !item.priceUpdated) {
      unverifiedPrices += 1;
    }
  }
  return { priceBasisCounts: counts, unverifiedPrices };
}

function summarizeCatalog(items, targets) {
  validateItems(items);
  const budgets = budgetOptions().map(option => budgetBand(option.value));
  if (!targets || !Array.isArray(targets.bands) || targets.bands.length !== budgets.length) {
    throw new Error("Target bands must match quiz budget bands");
  }
  if (!Number.isInteger(targets.total) || targets.total <= 0
    || targets.bands.some(band => !Number.isInteger(band.target) || band.target < 0)
    || targets.bands.reduce((sum, band) => sum + band.target, 0) !== targets.total) {
    throw new Error("Target total must equal the sum of nonnegative band targets");
  }
  let lower = 0;
  const bands = budgets.map((budget, index) => {
    const max = Number.isFinite(budget.max) ? budget.max : null;
    const config = targets.bands[index];
    if (config.max !== max) throw new Error("Target boundaries differ from quiz budgets");
    const wines = items.filter(item => item.price > lower && item.price <= budget.max);
    const label = max === null ? `>${lower}元` : lower === 0 ? `≤${max}元` : `>${lower}–${max}元`;
    const band = {
      minExclusive: lower, max, label, count: wines.length,
      percent: Math.round(wines.length / items.length * 10000) / 100,
      target: config.target, gap: Math.max(0, config.target - wines.length),
      ...priceSummary(wines)
    };
    lower = budget.max;
    return band;
  });
  return {
    total: items.length, targetTotal: targets.total,
    gap: Math.max(0, targets.total - items.length),
    ...priceSummary(items), bands
  };
}

if (require.main === module) {
  const root = path.resolve(__dirname, "..");
  const data = JSON.parse(fs.readFileSync(process.argv[2] || path.join(root, "data/baijiu.json"), "utf8"));
  const targets = JSON.parse(fs.readFileSync(path.join(root, "data/catalog-targets.json"), "utf8"));
  console.log(JSON.stringify(summarizeCatalog(data.items, targets), null, 2));
}

module.exports = { summarizeCatalog };
