sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
  "use strict";

  return Controller.extend("bookstore.shop.controller.BookList", {

    onInit: function () {
      this.getOwnerComponent().getRouter()
        .getRoute("books")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function () {
      var oBinding = this.byId("bookList").getBinding("items");
      if (oBinding) oBinding.refresh();
    },

    onSearch: function (oEvent) {
      var sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue") || "";
      var aFilters = [];

      if (sQuery.trim()) {
        aFilters = [new Filter({
          filters: [
            new Filter("title",      FilterOperator.Contains, sQuery),
            new Filter("authorName", FilterOperator.Contains, sQuery),
            new Filter("publishHouse", FilterOperator.Contains, sQuery)
          ],
          and: false
        })];
      }

      this.byId("bookList").getBinding("items").filter(aFilters);
    },

    onBookPress: function (oEvent) {
      var sBookID = oEvent.getSource().getBindingContext().getProperty("ID");
      this.getOwnerComponent().getRouter().navTo("bookDetail", { bookID: sBookID });
    }

  });
});
