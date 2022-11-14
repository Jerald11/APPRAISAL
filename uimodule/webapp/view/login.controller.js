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

      this.getView().byId("Username").setValue("");
      this.getView().byId("Password").setValue("");

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

    onCustomer: function(){
      this.router = this.getOwnerComponent().getRouter();
      this.router.navTo("Customer");
    },

    onPressRegister: function(){
      if (!this.oReg) {
        this.oReg = sap.ui.xmlfragment("claims.Entrego.view.fragment.Registration", this);
        this.getView().addDependent(this.oReg);
      }
      this.oReg.open();
      sap.ui.getCore().byId("CompleteName").setValue("");
      sap.ui.getCore().byId("Address").setValue("");
      sap.ui.getCore().byId("BillingAddress").setValue("");
      sap.ui.getCore().byId("City").setValue("");
      sap.ui.getCore().byId("Email").setValue("");
      sap.ui.getCore().byId("ZipCode").setValue("");
      sap.ui.getCore().byId("ContactNo").setValue("");
      sap.ui.getCore().byId("Username").setValue("");
      sap.ui.getCore().byId("UserType").setValue("");
      sap.ui.getCore().byId("UserType").setSelectedKey("");
      sap.ui.getCore().byId("LicenseKey").setValue("");
      sap.ui.getCore().byId("lblLicenseKey").setVisible(false);
    
    },
    onCloseRegistration: function(){
      if(this.oReg){
          this.oReg.close();
      }
    },

    onChangeType: function(){
      var oType = sap.ui.getCore().byId("UserType").getSelectedKey();
      if(oType === "Administrator"){
        sap.ui.getCore().byId("lblLicenseKey").setVisible(true);
      }else{
        sap.ui.getCore().byId("lblLicenseKey").setVisible(false);
      }
    },


    onRegister: async function(){
      var Email = sap.ui.getCore().byId("Email").getValue();
      var ContactNo = sap.ui.getCore().byId("ContactNo").getValue();
      var Username = sap.ui.getCore().byId("Username").getValue();

      if(Username === ""){
        MessageBox.error(`Please Enter UserName`);
        return;
      }

      if(Email === ""){
        MessageBox.error(`Please Enter Email`);
        return;
      }

      if(ContactNo === ""){
        MessageBox.error(`Please Enter Contact Number`);
        return;
      }


      var getUserName = await APPui5.ExecQuery("CheckUserName","Array",sap.ui.getCore().byId("Username").getValue(),"","","",false);
      if(getUserName.length !== 0){
        MessageBox.error(`User Name already exist, please enter another username`);
        return;
      }

      var getEmail = await APPui5.ExecQuery("CheckEmail","Array",sap.ui.getCore().byId("Username").getValue(),"","","",false);
      if(getEmail.length !== 0){
        MessageBox.error(`Email already exist, please enter another email`);
        return;
      }

      var getContact = await APPui5.ExecQuery("CheckContact","Array",sap.ui.getCore().byId("Username").getValue(),"","","",false);
      if(getContact.length !== 0){
        MessageBox.error(`Contact Number exist, please enter another email`);
        return;
      }
     
      var CompleteName = sap.ui.getCore().byId("CompleteName").getValue();
      var Address = sap.ui.getCore().byId("Address").getValue();
      var BillingAddress =  sap.ui.getCore().byId("BillingAddress").getValue();
      var City = sap.ui.getCore().byId("City").getValue();
      var ZipCode = sap.ui.getCore().byId("ZipCode").getValue();
      var UserType = sap.ui.getCore().byId("UserType").getSelectedKey();
      var LicenseKey = sap.ui.getCore().byId("LicenseKey").setValue();
      
      if(CompleteName === ""){
        MessageBox.error(`Please Enter Complete Name`);
        return;
      }

      if(Address === ""){
        MessageBox.error(`Please Enter Address`);
        return;
      }

      if(BillingAddress === ""){
        MessageBox.error(`Please Enter Billing Address`);
        return;
      }

      if(City === ""){
        MessageBox.error(`Please Enter City`);
        return;
      }

      if(ZipCode === ""){
        MessageBox.error(`Please Enter Zip Code`);
        return;
      }

      if(UserType === ""){
        MessageBox.error(`Please Select User Type`);
        return;
      }

      var getLicenseKey = [];
      if(UserType === "Administator"){
        if(LicenseKey === ""){
          MessageBox.error(`Please Enter LicenseKey`);
          return;
        }else{
          getLicenseKey = await APPui5.ExecQuery("getLicense","Array",LicenseKey,"","","",false);
          if(getLicenseKey.length === 0){
            MessageBox.error(`Invalid License Key`);
            return;
          }
        }
      }

      var IdKey =  APPui5.generateIDKey();
      var oData = {};
      var oHeader = {};
      oData.OUSR= [];
      oHeader.O = "I";
      oHeader.Username = Username;
      oHeader.CompleteName = CompleteName;
      oHeader.Address = Address;
      oHeader.BillingAddress = BillingAddress;
      oHeader.City = City;
      oHeader.Email = Email;
      oHeader.ZipCode = ZipCode;
      oHeader.ContactNo = ContactNo;
      oHeader.Status = "For Verification";
      oHeader.UserType = UserType;
      oHeader.UserAuth = IdKey;

      if(UserType === "Administrator"){
        oHeader.License = LicenseKey;
        var oDataL = {};
        var oHeaderL = {};
        oDataL.OLSN= [];
        oHeaderL.O = "U";
        oHeaderL.Id = getLicenseKey[0].Id;
        oHeaderL.Status = "Closed"; 
        oData.OLSN.push(oHeaderL);
        await APPui5.postQuery(oDataL,"OUSR","User");
      }
      
     
      oData.OUSR.push(oHeader);
      var message = await APPui5.postQuery(oData,"OUSR","User");
      if(message === 0){
        //Send Email Here;
        var oDataEmail = {};
        oDataEmail.Recipient= Email;
        oDataEmail.U_App_Subject = "OTP";
        oDataEmail.U_App_EmailDetails = "your otp is " + IdKey;

        await APPui5.postEmail(oDataEmail,"Emailnotif","User");

        MessageBox.success("you successfully register kindly check your email.");
        this.onCloseRegistration();
      }else{
        MessageBox.error(`${message}. Data not saved.`);
      }
    },

    onChangeUserName: async function(){
      var getUserName = await APPui5.ExecQuery("CheckUserName","Array",this.getView().byId("Username").getValue(),"","","",false);
      
      if(getUserName.length !== 0){
        this.UserId = getUserName[0].Id
        if(getUserName[0].Status == "For Verification"){
          this.onShowOTP();
        }
      }
    },


    onShowOTP: function(){
      if (!this.oTP) {
        this.oTP = sap.ui.xmlfragment("claims.Entrego.view.fragment.OTP", this);
        this.getView().addDependent(this.oTP);
      }
      this.oTP.open();
      sap.ui.getCore().byId("OTPR").setVisible(true);
      sap.ui.getCore().byId("NPassword").setVisible(false);
      sap.ui.getCore().byId("CPassword").setVisible(false);

      sap.ui.getCore().byId("NPassword").setValueHelpIconSrc("sap-icon://hide");
      sap.ui.getCore().byId("CPassword").setValueHelpIconSrc("sap-icon://hide");

      sap.ui.getCore().byId("NPassword").setType("Password");
      sap.ui.getCore().byId("CPassword").setType("Password");

      sap.ui.getCore().byId("OTPR").setValue("");
      sap.ui.getCore().byId("NPassword").setValue("");
      sap.ui.getCore().byId("CPassword").setValue("");
      sap.ui.getCore().byId("OTPButton").setText("Enter");
    },

    onCloseOTP: function(){
      if(this.oTP){
          this.oTP.close();
      }
    },

    onCheckOTP: async function(Id){
      if(sap.ui.getCore().byId("OTPButton").getText() == "Confirm"){
        var NewPassword =  sap.ui.getCore().byId("NPassword").getValue();
        var ConfirmPassword =  sap.ui.getCore().byId("CPassword").getValue();

        if(NewPassword == ""){
          sap.m.MessageToast.show("Please Enter Password",{duration: 5000});
          $( ".sapMMessageToast" ).addClass( "Error");
          return;
        }
  
        if(ConfirmPassword == ""){
          sap.m.MessageToast.show("Enter Confirm Password",{duration: 5000});
          $( ".sapMMessageToast" ).addClass( "Error");
          return;
        }
  
        // if(APPui5.containsSpecialChars(NewPassword) === false){
        //   sap.m.MessageToast.show("password should contains alteast 1 special character.",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }
  
        // if(NewPassword !== ConfirmPassword){
        //   sap.m.MessageToast.show("password does not match confirm password",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }
  
        // if(NewPassword.length < 8){
        //   sap.m.MessageToast.show("password should have 8 characters",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }
  
        // var regExp = /[a-zA-Z]/g;             
        // if(regExp.test(NewPassword)){
        // } else {
        //   sap.m.MessageToast.show("password must include numbers and letters",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }
  
  
        // if(APPui5.ContainsNumber(NewPassword) == false){
        //   sap.m.MessageToast.show("password must include numbers and letters",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }
  
  
        
        // if(APPui5.checkUppercase(NewPassword) == false){
        //   sap.m.MessageToast.show("password must include atleast 1 uppercase letter",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }
  
  
        // if(APPui5.checkLowercase(NewPassword) == false){
        //   sap.m.MessageToast.show("password must include atleast 1 lowercase letter",{duration: 5000});
        //   $( ".sapMMessageToast" ).addClass( "Error");
        //   return;
        // }



        var oDataL = {};
        var oHeaderL = {};
        oDataL.OUSR= [];
        oHeaderL.O = "U";
        oHeaderL.Id = this.UserId;
        oHeaderL.Password = NewPassword; 
        oHeaderL.Status = "Active"; 
        oDataL.OUSR.push(oHeaderL);
        await APPui5.postQuery(oDataL,"OUSR","User");
        this.onCloseOTP();
      }else{
        var getOTP = await APPui5.ExecQuery("UserOTP","Array",this.getView().byId("Username").getValue(),sap.ui.getCore().byId("OTPR").getValue(),"","",false);
        if(getOTP.length !== 0){
          sap.ui.getCore().byId("OTPR").setVisible(false);
          sap.ui.getCore().byId("NPassword").setVisible(true);
          sap.ui.getCore().byId("CPassword").setVisible(true);
          sap.ui.getCore().byId("OTPButton").setText("Confirm");
        }else{
          MessageBox.error("Invalid OTP");
        }
      }
    },

    onShowNewPw: function(){
      if(sap.ui.getCore().byId("NPassword").getValueHelpIconSrc() !== "sap-icon://show"){
        sap.ui.getCore().byId("NPassword").setValueHelpIconSrc("sap-icon://show");
        sap.ui.getCore().byId("NPassword").setType("Text");
      }else{
        sap.ui.getCore().byId("NPassword").setType("Password");
        sap.ui.getCore().byId("NPassword").setValueHelpIconSrc("sap-icon://hide");
      }
    },

    onShowConPw: function(){
      if(sap.ui.getCore().byId("CPassword").getValueHelpIconSrc() !== "sap-icon://show"){
        sap.ui.getCore().byId("CPassword").setValueHelpIconSrc("sap-icon://show");
        sap.ui.getCore().byId("CPassword").setType("Text");
      }else{
        sap.ui.getCore().byId("CPassword").setType("Password");
        sap.ui.getCore().byId("CPassword").setValueHelpIconSrc("sap-icon://hide");
      
      }
    },


    onShowForgotPass: function(){
      if (!this.oFP) {
        this.oFP = sap.ui.xmlfragment("claims.Entrego.view.fragment.forgotPassword", this);
        this.getView().addDependent(this.oFP);
      }
      this.oFP.open();
      sap.ui.getCore().byId("fEmail").setVisible(true);
      sap.ui.getCore().byId("fOTP").setVisible(false);
      sap.ui.getCore().byId("FPassword").setVisible(false);
      sap.ui.getCore().byId("FCPassword").setVisible(false);

      sap.ui.getCore().byId("FPassword").setValueHelpIconSrc("sap-icon://show");
      sap.ui.getCore().byId("FCPassword").setValueHelpIconSrc("sap-icon://show");

      sap.ui.getCore().byId("fEmail").setValue("");
      sap.ui.getCore().byId("fOTP").setValue("");
      sap.ui.getCore().byId("FPassword").setValue("");
      sap.ui.getCore().byId("fButtonID").setText("Get OTP");
      sap.ui.getCore().byId("fButtonID").setIcon("sap-icon://paper-plane");
      
    },

    onPressForgotPass: async function(){
      var busyDialog = new sap.m.BusyDialog();
      busyDialog.open();
      if(sap.ui.getCore().byId("fButtonID").getIcon() == "sap-icon://paper-plane"){
        var getEmail = await APPui5.ExecQuery("CheckEmail","Array",sap.ui.getCore().byId("fEmail").getValue(),"","","",false);
        var IdKey =  APPui5.generateIDKey();
        if(getEmail.length === 0){
          MessageBox.error(`Invalid Email`);
          return;
        }else{
          this.UserId = getEmail[0].Id; 
          var oDataL = {};
          var oHeaderL = {};
          oDataL.OUSR= [];
          oHeaderL.O = "U";
          oHeaderL.Id = getEmail[0].Id;
          oHeaderL.UserAuth = IdKey; 
          oDataL.OUSR.push(oHeaderL);
          await APPui5.postQuery(oDataL,"OUSR","User");
        }
   
        var oDataEmail = {};
        oDataEmail.Recipient= sap.ui.getCore().byId("fEmail").getValue();
        oDataEmail.U_App_Subject = "OTP";
        oDataEmail.U_App_EmailDetails = "your otp is " + IdKey;
        await APPui5.postEmail(oDataEmail,"Emailnotif","User");
        MessageBox.error("OTP Already Sent to " + sap.ui.getCore().byId("fEmail").getValue());
        sap.ui.getCore().byId("fEmail").setVisible(false);
        sap.ui.getCore().byId("fOTP").setVisible(true);
        sap.ui.getCore().byId("FPassword").setVisible(false);
        sap.ui.getCore().byId("FCPassword").setVisible(false);
        sap.ui.getCore().byId("fButtonID").setIcon("sap-icon://complete");
        sap.ui.getCore().byId("fButtonID").setText("Confirm OTP");
        busyDialog.close();
      }else if(sap.ui.getCore().byId("fButtonID").getIcon() == "sap-icon://complete"){
        var email = sap.ui.getCore().byId("fEmail").getValue();
        var oTpCode = sap.ui.getCore().byId("fOTP").getValue();
        var getOTP = await APPui5.ExecQuery("UserOTP2","Array",email ,oTpCode,"","",false);
        if(getOTP.length !== 0){
          sap.ui.getCore().byId("fEmail").setVisible(false);
          sap.ui.getCore().byId("fOTP").setVisible(false);
          sap.ui.getCore().byId("FPassword").setVisible(true);
          sap.ui.getCore().byId("FCPassword").setVisible(true);
          sap.ui.getCore().byId("fButtonID").setIcon("sap-icon://accept");
          sap.ui.getCore().byId("fButtonID").setText("Change");
          busyDialog.close();
        }else{
          MessageBox.error("Invalid OTP");
          busyDialog.close();
          return;
        }
      }else if(sap.ui.getCore().byId("fButtonID").getIcon() == "sap-icon://accept"){
        var oDataL = {};
        var oHeaderL = {};
        oDataL.OUSR= [];
        oHeaderL.O = "U";
        oHeaderL.Id = this.UserId;
        oHeaderL.Password = sap.ui.getCore().byId("FPassword").getValue(); 
        oHeaderL.Status = "Active"; 
        oDataL.OUSR.push(oHeaderL);
        await APPui5.postQuery(oDataL,"OUSR","User");
        MessageBox.success("Password Changed Successfully");
        this.onCloseFP();
      }
      busyDialog.close();
    },

    onCloseFP: function(){
      if(this.oFP){
          this.oFP.close();
      }
    },

    onShowNewFPw: function(){
      if(sap.ui.getCore().byId("FPassword").getValueHelpIconSrc() !== "sap-icon://show"){
        sap.ui.getCore().byId("FPassword").setValueHelpIconSrc("sap-icon://show");
        sap.ui.getCore().byId("FPassword").setType("Text");
      }else{
        sap.ui.getCore().byId("FPassword").setType("Password");
        sap.ui.getCore().byId("FPassword").setValueHelpIconSrc("sap-icon://hide");
      }
    },

    onShowConFPw: function(){
      if(sap.ui.getCore().byId("FCPassword").getValueHelpIconSrc() !== "sap-icon://show"){
        sap.ui.getCore().byId("FCPassword").setValueHelpIconSrc("sap-icon://show");
        sap.ui.getCore().byId("FCPassword").setType("Text");
      }else{
        sap.ui.getCore().byId("FCPassword").setType("Password");
        sap.ui.getCore().byId("FCPassword").setValueHelpIconSrc("sap-icon://hide");
      
      }
    },
    
    onPressLogin: async function(){
      var oUserName = this.getView().byId("Username").getValue();
      var oPassword = this.getView().byId("Password").getValue();

      if(oUserName === ""){
        MessageBox.error("Please Enter UserName");
        return;
      }

      if(oPassword === ""){
        MessageBox.error("Please Enter UserName");
        return;
      }

      var getLogin = await APPui5.ExecQuery("onLogin","Array",oUserName,oPassword,"","",false);
       if(getLogin.length !== 0){
        if(getLogin[0].UserType === "Seller"){
          localStorage.setItem("RFIDuserName", oUserName);
          this.onMain();
        }else if(getLogin[0].UserType === "Customer"){
          localStorage.setItem("RFIDuserName", oUserName);
          this.onCustomer();
        }
       }else{
        MessageBox.error("Invalid UserName and Password");
        return;
       }
    },


  });
});
