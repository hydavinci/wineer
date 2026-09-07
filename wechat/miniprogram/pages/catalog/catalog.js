const wineData = require("../../data/baijiu");
const { ensureAdult } = require("../../utils/age");
const { filterCatalog, priceOptions, aromaOptions } = require("../../utils/catalog");
const { buildWineView } = require("../../utils/result");
const { copyWineKeyword } = require("../../utils/purchase");

const PAGE_SIZE = 20;

Page({
  data: {
    agePending: true, query: "", priceIndex: 0, aromaIndex: 0,
    priceOptions: [], aromaOptions: [], wines: [],
    total: 0, resultCount: 0, hasMore: false, errorMessage: ""
  },

  onLoad() {
    this._filtered = [];
    this.confirmAge();
  },

  onUnload() {
    this._unloaded = true;
  },

  confirmAge() {
    ensureAdult(this, () => {
      this.setData({ agePending: false });
      this.refreshCatalog();
    });
  },

  refreshCatalog() {
    if (this.data.agePending) return;
    try {
      const prices = priceOptions();
      const aromas = aromaOptions(wineData.items);
      this._filtered = filterCatalog(wineData.items, {
        query: this.data.query,
        priceBand: prices[this.data.priceIndex].value,
        aroma: aromas[this.data.aromaIndex].value
      });
      this._visibleCount = PAGE_SIZE;
      this.setData({
        priceOptions: prices.map(({ value, label }) => ({ value, label })),
        aromaOptions: aromas, total: wineData.items.length, errorMessage: ""
      });
      this.showVisibleWines();
    } catch (error) {
      this.showCatalogError(error);
    }
  },

  showCatalogError(error) {
    console.error("catalog loading failed", error);
    this._filtered = [];
    this.setData({ wines: [], resultCount: 0, hasMore: false, errorMessage: "酒库暂时无法加载，请重试" });
  },

  showVisibleWines() {
    try {
      const wines = this._filtered.slice(0, this._visibleCount).map(buildWineView);
      this.setData({
        wines, resultCount: this._filtered.length,
        hasMore: wines.length < this._filtered.length
      });
    } catch (error) {
      this.showCatalogError(error);
    }
  },

  onSearchInput(event) {
    if (this.data.agePending) return;
    this.setData({ query: event.detail.value });
    this.refreshCatalog();
  },

  onPriceChange(event) {
    this.selectFilter("priceIndex", this.data.priceOptions, event.detail.value);
  },

  onAromaChange(event) {
    this.selectFilter("aromaIndex", this.data.aromaOptions, event.detail.value);
  },

  selectFilter(key, options, value) {
    if (this.data.agePending) return;
    const index = Number(value);
    if (!Number.isInteger(index) || !options[index]) {
      console.error("invalid catalog filter", key, value);
      wx.showToast({ title: "筛选选项无效，请重试", icon: "none" });
      return;
    }
    this.setData({ [key]: index });
    this.refreshCatalog();
  },

  resetFilters() {
    if (this.data.agePending) return;
    this.setData({ query: "", priceIndex: 0, aromaIndex: 0 });
    this.refreshCatalog();
  },

  onReachBottom() {
    if (this.data.agePending || !this.data.hasMore) return;
    this._visibleCount += PAGE_SIZE;
    this.showVisibleWines();
  },

  copyPurchaseKeyword(event) {
    if (this.data.agePending) return;
    const visible = this.data.wines.some(item => item.id === event.detail.id);
    const item = visible ? this._filtered.find(item => item.id === event.detail.id) : null;
    copyWineKeyword(item, { source: "catalog" });
  }
});
