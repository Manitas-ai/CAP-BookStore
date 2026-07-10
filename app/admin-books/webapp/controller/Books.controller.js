sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/core/ListItem"
], function (Controller, JSONModel, MessageToast, MessageBox, ListItem) {
  "use strict";

  return Controller.extend("bookstore.admin.books.controller.Books", {

    onInit: function () {
      this._oDialogModel = new JSONModel({ title: "", data: {} });
      this.getView().setModel(this._oDialogModel, "dialog");
    },

    // ── Helpers ────────────────────────────────────────────────────────────

    _emptyBook: function () {
      return { title: "", author_ID: "", publishedDate: "", publishHouse: "", abstract: "", stock: 10 };
    },

    _loadAuthors: function (sSelectedKey) {
      var oSelect  = this.byId("selAuthor");
      var oBinding = this.getView().getModel().bindList("/Authors", null, [], [], {
        $select: "ID,name"
      });
      oBinding.requestContexts(0, 200).then(function (aCtx) {
        var aItems = aCtx.map(function (c) {
          return new ListItem({ key: c.getProperty("ID"), text: c.getProperty("name") });
        });
        oSelect.destroyItems();
        aItems.forEach(function (i) { oSelect.addItem(i); });
        if (sSelectedKey) { oSelect.setSelectedKey(sSelectedKey); }
      });
    },

    // ── Toolbar ────────────────────────────────────────────────────────────

    onNew: function () {
      this._editMode = "create";
      this._oContext  = null;
      this._oDialogModel.setData({ title: "Create New Book", data: this._emptyBook() });
      this._loadAuthors();
      this.byId("bookDialog").open();
    },

    // ── Row actions ────────────────────────────────────────────────────────

    onEdit: function (oEvent) {
      this._editMode = "edit";
      this._oContext  = oEvent.getSource().getParent().getBindingContext();
      var o = this._oContext.getObject();
      this._oDialogModel.setData({
        title: "Edit Book",
        data: {
          title:         o.title         || "",
          author_ID:     o.author_ID     || "",
          publishedDate: o.publishedDate || "",
          publishHouse:  o.publishHouse  || "",
          abstract:      o.abstract      || "",
          stock:         o.stock         || 0
        }
      });
      this._loadAuthors(o.author_ID);
      this.byId("bookDialog").open();
    },

    onDelete: function (oEvent) {
      var oCtx   = oEvent.getSource().getParent().getBindingContext();
      var sTitle = oCtx.getProperty("title");
      MessageBox.confirm('Delete "' + sTitle + '"?', {
        onClose: function (sAction) {
          if (sAction !== "OK") { return; }
          oCtx.delete("$auto")
            .then(function ()    { MessageToast.show("Book deleted."); })
            .catch(function (e)  { MessageBox.error("Delete failed: " + e.message); });
        }
      });
    },

    // ── Dialog ─────────────────────────────────────────────────────────────

    onSave: function () {
      var oData = this._oDialogModel.getProperty("/data");
      oData.author_ID = this.byId("selAuthor").getSelectedKey();

      if (!oData.title)     { MessageToast.show("Please enter a title.");    return; }
      if (!oData.author_ID) { MessageToast.show("Please select an author."); return; }

      if (this._editMode === "create") {
        var oBinding = this.byId("booksTable").getBinding("items");
        oBinding.create({
          title:         oData.title,
          author_ID:     oData.author_ID,
          publishedDate: oData.publishedDate || null,
          publishHouse:  oData.publishHouse  || null,
          abstract:      oData.abstract      || null,
          stock:         parseInt(oData.stock, 10) || 0
        }).created()
          .then(function ()   { MessageToast.show("Book created!"); this.byId("bookDialog").close(); }.bind(this))
          .catch(function (e) { MessageBox.error("Create failed: " + e.message); });
      } else {
        var aFields = ["title", "author_ID", "publishedDate", "publishHouse", "abstract"];
        aFields.forEach(function (f) { this._oContext.setProperty(f, oData[f] || null); }, this);
        this._oContext.setProperty("stock", parseInt(oData.stock, 10) || 0);
        MessageToast.show("Book saved.");
        this.byId("bookDialog").close();
      }
    },

    onCancel: function () {
      this.byId("bookDialog").close();
    }

  });
});
