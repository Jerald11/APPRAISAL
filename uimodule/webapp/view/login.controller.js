sap.ui.define([
  "sap/ui/core/mvc/Controller",
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

  return Controller.extend("claims.Entrego.view.login", {
    onInit: function(){
      var that = this;
      that.oModel=new JSONModel("model/data.json");
      that.getView().setModel(this.oModel,"oModel");
    
      var oView = that.getView();
        oView.addEventDelegate({
            onAfterHide: function(evt) {
                //This event is fired every time when the NavContainer has made this child control invisible.
            },
            onAfterShow: function(evt) {
                //This event is fired every time when the NavContainer has made this child control visible.
                // oView.getController().onreloader();
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
        // APPui5.loadAIP();
    },

    onMain: function(){
        this.router = this.getOwnerComponent().getRouter();
        this.router.navTo("Main");
    },

    onPressRegister: function(){
      if (!this.oReg) {
        this.oReg = sap.ui.xmlfragment("claims.Entrego.view.fragment.Registration", this);
        this.getView().addDependent(this.oReg);
      }
      this.oReg.open();
      sap.ui.getCore().byId("Fname").setValue("");
      sap.ui.getCore().byId("MName").setValue("");
      sap.ui.getCore().byId("LName").setValue("");
      sap.ui.getCore().byId("UserName").setValue("");
      sap.ui.getCore().byId("oPassword").setValue("");
      sap.ui.getCore().byId("EmailAdd").setValue("");
      sap.ui.getCore().byId("oHouseNo").setValue("");
      sap.ui.getCore().byId("oStreet").setValue("");
      sap.ui.getCore().byId("oBrgy").setValue("");
      sap.ui.getCore().byId("oCity").setValue("");
      sap.ui.getCore().byId("oProvince").setValue("");
    },
    onCloseRegistration: function(){
      if(this.oReg){
          this.oReg.close();
      }
    },



  });
});
