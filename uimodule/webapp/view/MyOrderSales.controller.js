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
  "claims/Entrego/controller/APPui5"
], function(Controller,MessageToast, JSONModel, Filter, FilterOperator, Token, MessageBox,Fragment,Core,APPui5) {
"use strict";
var todates;
var oDelivery;
var oDetails;
return Controller.extend("claims.Entrego.view.MyOrderSales", {
  onInit: function(){
    var that = this;
    that.oModel=new JSONModel("model/data.json");
    that.getView().setModel(this.oModel,"oModel");
      var oView = that.getView();
      this.Idkey = "";
        oView.addEventDelegate({
            onAfterHide: function(evt) {
                //This event is fired every time when the NavContainer has made this child control invisible.
            },
            onAfterShow: async function(evt) {
                //This event is fired every time when the NavContainer has made this child control visible.
                await oView.getController().onloadData();
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
        this.onloadData();
      },

      onloadData: async function(){
        this.oModel.getData().DataRecords = await APPui5.ExecQuery("getMyOrder","Array",localStorage.getItem("RFIDuserName"),"","","",false);
        this.oModel.refresh();
      },

      onShowProduct: function(oEvent){
        var myInputControl = oEvent.getSource(); // e.g. the first item
        var boundData = myInputControl.getBindingContext('oModel').getObject();
        if (!this.oPrd) {
          this.oPrd = sap.ui.xmlfragment("claims.Entrego.view.fragment.ViewProducts", this);
          this.getView().addDependent(this.oPrd);
        }
        this.oPrd.open();
        this.Idkey = boundData.Id;
        
        sap.ui.getCore().byId("viewAddId").setVisible(false);
        sap.ui.getCore().byId("TypeContainer").setVisible(false);
        sap.ui.getCore().byId("bidDetails").setVisible(false);
        sap.ui.getCore().byId("ViewProdId").setTitle(boundData.Description + " - " + boundData.Category);
        sap.ui.getCore().byId("TopImageIdFrag").setSrc("http://13.251.57.230/Images/" + boundData.Img1);
        sap.ui.getCore().byId("FrontImageIdFrag").setSrc("http://13.251.57.230/Images/" + boundData.Img2);
        sap.ui.getCore().byId("RearImageIdFrag").setSrc("http://13.251.57.230/Images/" + boundData.Img3);
        this.oModel.refresh();
      },

      onCloseProduct: function(){
        if(this.oPrd){
          this.oPrd.close();
        }
      },

    });
});
