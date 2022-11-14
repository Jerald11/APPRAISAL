sap.ui.define([
    "claims/Entrego/controller/BaseController",
      "sap/m/MessageToast",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/Token",
      "sap/m/MessageBox",
      "sap/ui/core/Fragment",
      "sap/ui/core/Core",
    "claims/Entrego/controller/APPui5",
    "sap/ui/export/Spreadsheet",
    'sap/ui/export/library'
  ], function(Controller,MessageToast, JSONModel, Filter, FilterOperator, Token, MessageBox,Fragment,Core,APPui5,Spreadsheet,exportLibrary) {
    "use strict";
    var todates;
    var oDelivery;
    var oDetails;
    var ImportData = [];
    var EdmType = exportLibrary.EdmType;
    var counter;
    return Controller.extend("claims.Entrego.view.Customer", {
      onInit: function(){
        var that = this;
        that.oModel=new JSONModel("model/data.json");
        that.oModel.setSizeLimit(100000);
        that.getView().setModel(this.oModel,"oModel");
        that.getView().byId("ShelluserName").setText(localStorage.getItem("RFIDuserName"));
        that.oModel.refresh();
        var oView = that.getView();
          oView.addEventDelegate({
            onAfterHide: function(evt) {
              //This event is fired every time when the NavContainer has made this child control invisible.
            },
            onAfterShow: function(evt) {
              //This event is fired every time when the NavContainer has made this child control visible.
              // oView.getController().onLoadApprovalStagesRecords();
            },
            onBeforeFirstShow: function(evt) {
  
              //This event is fired before the NavContainer shows this child control for the first time.
            },
            onBeforeHide: function(evt) {
  
            },
            onBeforeShow: function(evt) {
              //This event is fired every time before the NavContainer shows this child control.
              that.initialize();
  
            }
          });
        },
  
      initialize: function(){
        todates = new Date();
        this.onDashBoard();
        
        },
  
      onDashBoard: function(){
        this.router = this.getOwnerComponent().getRouter();
        this.router.navTo("CustomerDashBoard");
      },
  
      onLogout: function(){
          var that = this;
          MessageBox.information("Are you sure you want to logout??", {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          title: "",
          icon: MessageBox.Icon.QUESTION,
          styleClass:"sapUiSizeCompact",
          onClose: function (sButton) {
            if(sButton === "YES"){
            that.router = that.getOwnerComponent().getRouter();
            that.router.navTo("Routelogin");
            }
          }
        });
      },
  
        onRootItemSelect: function(oEvent) {
          var oMenuGroup = oEvent.getSource();
  
          if (oMenuGroup.getExpanded()) {
          oMenuGroup.collapse();
          } else {
          oMenuGroup.expand();
          }
        },
  
        onProduct: function(){
          this.router = this.getOwnerComponent().getRouter();
          this.router.navTo("Product");
          this.onMenuButtonPress()
        },
  
        
        onAppraise: function(){
          this.router = this.getOwnerComponent().getRouter();
          this.router.navTo("Appraise");
          this.onMenuButtonPress()
        },
  
        onMenuButtonPress: function () {
          var toolPage = this.byId("toolPage1");
          toolPage.setSideExpanded(!toolPage.getSideExpanded());
        },
        
        onSaleProduct: function(){
          this.router = this.getOwnerComponent().getRouter();
          this.router.navTo("SalesProduct");
          this.onMenuButtonPress()
        },
        
        onBiddingProduct: function(){
          this.router = this.getOwnerComponent().getRouter();
          this.router.navTo("Bidding");
          this.onMenuButtonPress()
        },
        
        onMyOrderSales: function(){
          this.router = this.getOwnerComponent().getRouter();
          this.router.navTo("MyOrderSales");
          this.onMenuButtonPress()
        },

        onMyOrderBid: function(){
          this.router = this.getOwnerComponent().getRouter();
          this.router.navTo("myOrderBid");
          this.onMenuButtonPress()
        },
  
  
    
    });
  });
  