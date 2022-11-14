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
return Controller.extend("claims.Entrego.view.Orders", {
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

      },

      onloadData: async function(){
        this.oModel.getData().DataRecords = await APPui5.ExecQuery("getAllProd","Array","","","","",false);
        this.oModel.refresh();
      },

      onShowProduct: function(oEvent){
        var myInputControl = oEvent.getSource(); // e.g. the first item
        var boundData = myInputControl.getBindingContext('oModel').getObject();
        if(boundData.Status === "Ordered"){
          MessageBox.error(`Unable to update Type of sale`);
          return;
        }
        if (!this.oPrd) {
          this.oPrd = sap.ui.xmlfragment("claims.Entrego.view.fragment.ViewProducts", this);
          this.getView().addDependent(this.oPrd);
        }
        this.oPrd.open();
        this.Idkey = boundData.Id;
        sap.ui.getCore().byId("viewAddId").setVisible(true);
        sap.ui.getCore().byId("TypeContainer").setVisible(true);
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

      onChangeType: function(){
        console.log(sap.ui.getCore().byId("TypeId").getSelectedKey())
        if(sap.ui.getCore().byId("TypeId").getSelectedKey() === "Bid"){
          sap.ui.getCore().byId("bidDetails").setVisible(true);
        }else{
          sap.ui.getCore().byId("bidDetails").setVisible(false);
        }
      },

      onUpdateProduct: async function(){
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();


        if(sap.ui.getCore().byId("TypeId").getSelectedKey() == ""){
          MessageBox.error(`Please Select Type of sales`);
          busyDialog.close();
          return;
        }

        var oData = {};
        var oHeader = {};
        oData.OPRD= [];
        oHeader.O = "U";
        oHeader.Id = this.Idkey;
        if(sap.ui.getCore().byId("bidDetails").getVisible() === true){
          if(sap.ui.getCore().byId("BidTime").getSelectedKey() === ""){
            MessageBox.error(`Please Select bid duration`);
            busyDialog.close();
            return;
          }

          if(sap.ui.getCore().byId("MinId").getValue() === "" || sap.ui.getCore().byId("MinId").getValue() === 0){
            MessageBox.error(`Please Enter Mininum bid amount for this jewelry`);
            busyDialog.close();
            return;
          }

          if(sap.ui.getCore().byId("MaxId").getValue() === "" || sap.ui.getCore().byId("MaxId").getValue() === 0){
            MessageBox.error(`Please Enter Maximum bid amount for this jewelry`);
            busyDialog.close();
            return;
          }

          if(parseInt(sap.ui.getCore().byId("MinId").getValue()) > parseInt(sap.ui.getCore().byId("MaxId").getValue())){
            MessageBox.error(`Maximum Bid Amount shoud be greater than Minimum Bid Amount`);
            busyDialog.close();
            return;
          }

          oHeader.BidDuration = sap.ui.getCore().byId("BidTime").getSelectedKey();
          oHeader.MinBid = sap.ui.getCore().byId("MinId").getValue();
          oHeader.MaxBid = sap.ui.getCore().byId("MaxId").getValue();
        }

        oHeader.Status = sap.ui.getCore().byId("TypeId").getSelectedKey();
        oData.OPRD.push(oHeader);
        var message = await APPui5.postQuery(oData,"Apprasid","Product");
          if(message === 0){
            MessageBox.success("Jewelry successfully Updated.");
            await this.onloadData();
            this.onCloseProduct();
          }else{
            MessageBox.error(`${message}. Data not saved.`);
          }
          busyDialog.close();
      }
    });
});
