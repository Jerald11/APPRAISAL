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
return Controller.extend("claims.Entrego.view.SalesProduct", {
  onInit: function(){
    var that = this;
    this.ControlId = "";
    this.Idkey = "";
    that.oModel=new JSONModel("model/data.json");
    that.getView().setModel(this.oModel,"oModel");
      var oView = that.getView();
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
        this.oModel.getData().DataRecords = await APPui5.ExecQuery("getAllSaleProd","Array","Sales","","","",false);
        this.oModel.refresh();
      },

      onShowProduct: function(oEvent){
        var myInputControl = oEvent.getSource(); // e.g. the first item
        var boundData = myInputControl.getBindingContext('oModel').getObject();
        
        if (!this.oPrdSale) {
          this.oPrdSale = sap.ui.xmlfragment("claims.Entrego.view.fragment.BuyProduct", this);
          this.getView().addDependent(this.oPrdSale);
        }
        this.oPrdSale.open();
        this.Idkey = boundData.Id;
        this.ControlId = boundData.ControlId;
        sap.ui.getCore().byId("sViewProdId").setTitle(boundData.Description + " - " + boundData.Category);
        sap.ui.getCore().byId("STopImageIdFrag").setSrc("http://13.251.57.230/Images/" + boundData.Img1);
        sap.ui.getCore().byId("SFrontImageIdFrag").setSrc("http://13.251.57.230/Images/" + boundData.Img2);
        sap.ui.getCore().byId("SRearImageIdFrag").setSrc("http://13.251.57.230/Images/" + boundData.Img3);
        this.oModel.refresh();
      },

      onCloseProduct: function(){
        if(this.oPrdSale){
          this.oPrdSale.close();
        }
      },

      onOrderedItem: function(){
        var that = this;
        MessageBox.information("Are you sure you want to order this??", {
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        title: "",
        icon: MessageBox.Icon.QUESTION,
        styleClass:"sapUiSizeCompact",
        onClose: async function (sButton) {
                if(sButton === "YES"){
                    await that.onUpdateOrder();
                }
            }
        });
      },

      onUpdateOrder: async function(){
        //Insert 
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();
        var oData = {};
        var oHeader = {};
        oData.ORDR= [];
        oHeader.O = "I";
       
        oHeader.ControlId = this.ControlId;
        oHeader.UserName = localStorage.getItem("RFIDuserName");
        oHeader.Status = "Ordered";

        oData.ORDR.push(oHeader);
        var message = await APPui5.postQuery(oData,"Order","Sales");
        if(message === 0){
            // Update Product;
            var uData = {};
            var uHeader = {};
            uData.OPRD= [];
            uHeader.O = "U";
            uHeader.Id = this.Idkey;
            uHeader.Status = "Ordered";
            uData.OPRD.push(uHeader);
            var message1 = await APPui5.postQuery(uData,"Order","Sales");
            if(message1 === 0){
                MessageBox.success("Jewelry Ordered Successfully.");
                this.onCloseProduct();
            }else{
               MessageBox.error(`${message}. Data not saved.`);
            }
        }else{
          MessageBox.error(`${message}. Data not saved.`);
        }
        busyDialog.close();
      },


    });
});
