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
return Controller.extend("claims.Entrego.view.Appraise", {
  onInit: function(){
    var that = this;
    that.oModel=new JSONModel("model/data.json");
    that.getView().setModel(this.oModel,"oModel");
      this.formArray = [];
      this.ImageTop = "";
      this.ImageFront = "";
      this.ImageRear = "";
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

      },


      onUploadTop: async function(oEvent){
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();
            var formData = new FormData();
            formData.append("file", oEvent.mParameters.files[0]);
            this.ImageTop = await APPui5.onUploadFile(formData,"Image","TopImage");
            this.getView().byId("TopImageId").setSrc("");
            this.getView().byId("TopImageId").setSrc("http://13.251.57.230/Images/" +  this.ImageTop);
            this.oModel.refresh();
           busyDialog.close();
      },

      onUploadFront: async function(oEvent){
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();
            var formData = new FormData();
            formData.append("file", oEvent.mParameters.files[0]);
            this.ImageFront = await APPui5.onUploadFile(formData,"Image","TopImage");
            this.getView().byId("FrontImageID").setSrc("");
            this.getView().byId("FrontImageID").setSrc("http://13.251.57.230/Images/" +  this.ImageFront);
            this.oModel.refresh();
           busyDialog.close();
      },

      onUploadRear: async function(oEvent){
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();
            var formData = new FormData();
            formData.append("file", oEvent.mParameters.files[0]);
            this.ImageRear = await APPui5.onUploadFile(formData,"Image","TopImage");
            this.getView().byId("RearImageID").setSrc("");
            this.getView().byId("RearImageID").setSrc("http://13.251.57.230/Images/" +  this.ImageRear);
            this.oModel.refresh();
           busyDialog.close();
      },


      onPostAppraisal: async function(){

        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();


        var iTop = this.ImageTop;
        var iFront = this.ImageFront;
        var iRear = this.ImageRear;
        
        var Desc = this.getView().byId("DescId").getValue();
        var aValue = this.getView().byId("AppraiseValue").getValue();
        var Price = this.getView().byId("Price").getValue();
        var Category = this.getView().byId("category").getValue();

        // if(iTop === "./resources/img/template.jpg"){
        //     MessageBox.error(`Please upload top image of the jewelry`);
        //     return;
        // }

        // if(iFront === "./resources/img/template.jpg"){
        //     MessageBox.error(`Please upload front image of the jewelry`);
        //     return;
        // }

        // if(iRear === "./resources/img/template.jpg"){
        //     MessageBox.error(`Please upload rear image of the jewelry`);
        //     return;
        // }

        // if(Desc == ""){
        //     MessageBox.error(`Please enter Description of the jewelry`);
        //     return;
        // }

        // if(aValue == ""){
        //     MessageBox.error(`Please enter Appraise value of the jewelry`);
        //     return;
        // }

        // if(Price == ""){
        //     MessageBox.error(`Please enter Price of the jewelry`);
        //     return;
        // }

        // if(Category == ""){
        //     MessageBox.error(`Please enter Category of the jewelry`);
        //     return;
        // }
        
        var ControlID = await APPui5.ExecQuery("getControlId","Array","","","","",false);
        var insertId = "";
        if(ControlID.length !== 0 && ControlID[0].id !== null){
            var intNum = parseInt(ControlID[0].id) + 1;
            insertId = "APR" + APPui5.zeroPad(intNum, 4);
        }else{
            insertId = "APR0001"
        }
      
        var oData = {};
        var oHeader = {};
        oData.OPRD= [];
        oHeader.O = "I";
        oHeader.ControlId = insertId;
        oHeader.Description = Desc;
        oHeader.AValue = aValue;
        oHeader.Price = APPui5.onRound(Price, 2);
        oHeader.CurrencyCode = 'PHP'
        oHeader.Category = Category;
        oHeader.Status = "Appraised";
        oHeader.Img1 = iTop;
        oHeader.Img2 = iFront;
        oHeader.Img3 = iRear;
        
        oData.OPRD.push(oHeader);
        var message = await APPui5.postQuery(oData,"Apprasid","Product");
          if(message === 0){
            MessageBox.success("Jewelry Appraise successfully.");
          }else{
            MessageBox.error(`${message}. Data not saved.`);
          }
          busyDialog.close();
      },


     


    });
});
