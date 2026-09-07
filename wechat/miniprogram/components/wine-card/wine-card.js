Component({
  data: { expanded: false },
  properties: {
    wine: {
      type: Object,
      value: null
    }
  },

  methods: {
    toggleDetails() {
      this.setData({ expanded: !this.data.expanded });
    },

    copyPurchaseKeyword() {
      const wine = this.data.wine || {};
      this.triggerEvent("buy", {
        id: wine.id,
        name: wine.name
      });
    }
  }
});
