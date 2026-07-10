sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("bookstore.admin.authors.controller.Authors", {

    onInit: function () {
      this._oDialogModel = new JSONModel({ title: "", data: {} });
      this.getView().setModel(this._oDialogModel, "dialog");
    },

    // ── Helpers ────────────────────────────────────────────────────────────

    _emptyAuthor: function () {
      return { name: "", country: "", about: "" };
    },

    // ── Toolbar ────────────────────────────────────────────────────────────

    onNew: function () {
      this._editMode = "create";
      this._oContext  = null;
      this._oDialogModel.setData({ title: "Create New Author", data: this._emptyAuthor() });
      this.byId("authorDialog").open();
    },

    // ── Row actions ────────────────────────────────────────────────────────

    onEdit: function (oEvent) {
      this._editMode = "edit";
      this._oContext  = oEvent.getSource().getParent().getBindingContext();
      var o = this._oContext.getObject();
      this._oDialogModel.setData({
        title: "Edit Author",
        data: {
          name:    o.name    || "",
          country: o.country || "",
          about:   o.about   || ""
        }
      });
      this.byId("authorDialog").open();
    },

    onDelete: function (oEvent) {
      var oCtx  = oEvent.getSource().getParent().getBindingContext();
      var sName = oCtx.getProperty("name");
      MessageBox.confirm('Delete author "' + sName + '"?\nThis will also affect linked books.', {
        onClose: function (sAction) {
          if (sAction !== "OK") { return; }
          oCtx.delete("$auto")
            .then(function ()    { MessageToast.show("Author deleted."); })
            .catch(function (e)  { MessageBox.error("Delete failed: " + e.message); });
        }
      });
    },

    // ── Dialog ─────────────────────────────────────────────────────────────

    onSave: function () {
      var oData = this._oDialogModel.getProperty("/data");

      if (!oData.name) { MessageToast.show("Please enter the author's name."); return; }

      if (this._editMode === "create") {
        var oBinding = this.byId("authorsTable").getBinding("items");
        oBinding.create({
          name:    oData.name,
          country: oData.country || null,
          about:   oData.about   || null
        }).created()
          .then(function ()   { MessageToast.show("Author created!"); this.byId("authorDialog").close(); }.bind(this))
          .catch(function (e) { MessageBox.error("Create failed: " + e.message); });
      } else {
        this._oContext.setProperty("name",    oData.name);
        this._oContext.setProperty("country", oData.country || null);
        this._oContext.setProperty("about",   oData.about   || null);
        MessageToast.show("Author saved.");
        this.byId("authorDialog").close();
      }
    },

    onCancel: function () {
      this.byId("authorDialog").close();
    }

  });
});
