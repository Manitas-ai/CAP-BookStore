sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("bookstore.shop.controller.BookDetail", {

    onInit: function () {
      this.getOwnerComponent().getRouter()
        .getRoute("bookDetail")
        .attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      var sBookID = oEvent.getParameter("arguments").bookID;
      var oView   = this.getView();

      oView.setBusy(true);
      oView.bindElement({
        path: "/Books(" + sBookID + ")",
        events: {
          dataReceived: function () { oView.setBusy(false); },
          dataRequested: function () { oView.setBusy(true); }
        }
      });

      this._sBookID = sBookID;
      this.byId("customerName").setValue("");
      this.byId("customerEmail").setValue("");
    },

    onNavBack: function () {
      this.getOwnerComponent().getRouter().navTo("books");
    },

    onPlaceOrder: function () {
      var sName  = this.byId("customerName").getValue().trim();
      var sEmail = this.byId("customerEmail").getValue().trim();

      if (!sName) {
        MessageBox.error("Please enter your name.");
        return;
      }
      if (!sEmail || !sEmail.includes("@")) {
        MessageBox.error("Please enter a valid email address.");
        return;
      }

      var oOrdersBinding = this.getView().getModel().bindList("/Orders");

      var oContext = oOrdersBinding.create({
        book_ID:       this._sBookID,
        customerName:  sName,
        customerEmail: sEmail
      });

      oContext.created()
        .then(function () {
          MessageBox.success(
            "Your order has been placed!\nWe will contact you at: " + sEmail,
            { title: "Order Confirmed" }
          );
          this.byId("customerName").setValue("");
          this.byId("customerEmail").setValue("");
          // Refresh the book binding to show updated stock
          this.getView().getElementBinding().refresh();
        }.bind(this))
        .catch(function (oError) {
          var sMsg = "Failed to place order.";
          try {
            var oResp = JSON.parse(oError.responseText || oError.message);
            sMsg = (oResp.error && oResp.error.message) ? oResp.error.message : sMsg;
          } catch (e) {
            sMsg = oError.message || sMsg;
          }
          MessageBox.error(sMsg);
        });
    }

  });
});
