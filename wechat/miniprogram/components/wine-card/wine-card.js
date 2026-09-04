Component({
  properties: {
    wine: {
      type: Object,
      value: null
    }
  },

  methods: {
    copyPurchaseKeyword() {
      const wine = this.data.wine || {};
      this.triggerEvent("buy", {
        id: wine.id,
        name: wine.name
      });
    }
  }
});
