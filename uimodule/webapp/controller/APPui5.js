sap.ui.define([
	"jquery.sap.global",
	"sap/ui/Device",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox",
], function (jQuery, Device, Fragment, Controller, JSONModel,
	Popover, Button, mobileLibrary, MessageToast, BusyIndicator, MessageBox) {
	"use strict";

	return ("claims.entrego.controller.APPui5", {
    onPrompt: function (title, message) {
			return new Promise(function (resolve, reject) {
				sap.m.MessageBox.confirm(message, {
					icon: MessageBox.Icon.CONFIRMATION,
					title: title,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function (oAction) {
						if (oAction === 'YES') {
							resolve(1);
							//console.log('YES');
						} else {
							resolve(0);
						}
					}.bind(this)
				});
			});
		},
		getDatePostingFormat: function (sDate) {
			var year = new Date(sDate).getYear() + 1900;
			var month = new Date(sDate).getMonth() + 1;
			var date = new Date(sDate).getDate();
      var Dig = this.getlength(date);
      if(Dig === 1){
        date = "0" +  date;
      }else{
        date = date;
      }
			return month + "/" + date + "/" + year;
		},
		getDateFormat: function (sDate) {
			var year = new Date(sDate).getYear() + 1900;
			var month = new Date(sDate).getMonth() + 1;
			if (month<10){
				month="0" + month;
			}
			var date = new Date(sDate).getDate();
			return date + "/" + month + "/" + year;
		},

    getCurrentYear: function () {
			var year = new Date().getYear() + 1900;
			return year;
		},

    getCurrentDay: function () {
			var days = new Date().getDate();
			return days;
		},

    toCommas:function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    removeCommas:function (str) {
      while (str.search(",") >= 0) {
          str = (str + "").replace(',', '');
      }
      return str;
    },

  
  openLoadingFragment: function(){
    if (! this.oDialog) {
          this.oDialog = sap.ui.xmlfragment("busyLogin","WEBAP.RFID.view.fragments.BusyDialog", this);
     }
     this.oDialog.open();
  },

  closeLoadingFragment : function(){
      if(this.oDialog){
        this.oDialog.close();
      }
  },

  hex2bin: function (hex){
      hex = hex.replace("0x", "").toLowerCase();
      var out = "";
      for(var c of hex) {
          switch(c) {
              case '0': out += "0000"; break;
              case '1': out += "0001"; break;
              case '2': out += "0010"; break;
              case '3': out += "0011"; break;
              case '4': out += "0100"; break;
              case '5': out += "0101"; break;
              case '6': out += "0110"; break;
              case '7': out += "0111"; break;
              case '8': out += "1000"; break;
              case '9': out += "1001"; break;
              case 'a': out += "1010"; break;
              case 'b': out += "1011"; break;
              case 'c': out += "1100"; break;
              case 'd': out += "1101"; break;
              case 'e': out += "1110"; break;
              case 'f': out += "1111"; break;
              default: return "";
          }
      }

      return out;
  },

  bin2hex: function (s){
    var i, k, part, accum, ret = '';
    for (i = s.length-1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i+1-4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return { valid: false };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
    }
    return ret;
  },

  bin2dec:function (num){
    return num.split('').reverse().reduce(function(x, y, i){
      return (y === '1') ? x + Math.pow(2, i) : x;
    }, 0);
  },

  Timeformater: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
  },

  PostDTRformat: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }, 

  ContainsNumber:function (_string){
    let matchPattern =_string.match(/\d+/g);
    if (matchPattern != null) {
      return true;
    }
    else{
     return false;
    }
  },

  zeroPad: function (num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
    },

    containsSpecialChars: function(str) {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      return specialChars.test(str);
    },
  
    checkUppercase: function(str){
      for (var i=0; i<str.length; i++){
        if (str.charAt(i) == str.charAt(i).toUpperCase() && str.charAt(i).match(/[a-z]/i)){
          return true;
        }
      }
      return false;
    },
  
    checkLowercase:function(str){
      for (var i=0; i<str.length; i++){
        if (str.charAt(i) == str.charAt(i).toLowerCase() && str.charAt(i).match(/[a-z]/i)){
          return true;
        }
      }
      return false;
    },
  
    onRound: function (value, precision) {
			return (+(Math.round(value + "e+" + precision) + "e-" + precision)) || 0;
		},
  

    ExecQuery: function (sQueryTag, sRootModel, sV1 = "", sV2 = "", sV3 = "", sV4 = "", isAsync = false) {
      var busyDialog = new sap.m.BusyDialog();
      busyDialog.open();

      var fetchValue = "";
      var isAsyncParam = isAsync;
      var myURL =  "http://13.251.57.230/APPQuery?querytag=" + sQueryTag + "&value1=" + sV1 + "&value2=" + sV2 + "&value3=" + sV3 + "&value4=" + sV4;
      // console.log(myURL)
      $.ajax({
        url: myURL,
        type: "GET",
        contentType: "application/json",
        datatype: "json",
        async: isAsyncParam,
        context: this,
        error: function (xhr, status, error) {
          console.log(error);
          busyDialog.close();
        },
        success: function (results) {
          
        },
      }).done(function (results) {
        if (results) {
          if (sRootModel === "") {
            fetchValue = JSON.parse(JSON.stringify(results).replace("[", "").replace("]", ""));
          } else {
            if (sRootModel === 'DataRecord') {
              fetchValue = JSON.parse(JSON.stringify(results).replace("[", "").replace("]", ""));
            } else {
              fetchValue = results;
            }
          }
        }
        busyDialog.close();
      });
      return fetchValue;
    },

     convertTo24Hour:function(time) {
      var hours = parseInt(time.substr(0, 2));
      if(time.indexOf('AM') != -1 && hours == 12) {
          time = time.replace('12', '00');
      }

      if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '00');
      }

      if(time.indexOf('PM')  != -1 && hours < 12) {
          time = time.replace(hours, (hours + 12));
      }

      if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
      return time.replace(/(AM|PM)/, '');
    },

    postQuery: async function (oData, table, description) {
      return new Promise(function (resolve, reject) {
        var busyDialog = new sap.m.BusyDialog();
        busyDialog.open();

      var url = "http://13.251.57.230/APPPostQuery";
      var settings = {
        "url": url,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(oData),
        };
        
        $.ajax(settings)
        .error(function (xhr, status, error) {
          console.log("Error");
          busyDialog.close();
          resolve(error);
        })
        .done(function (response) {
          console.log("Posted");
          busyDialog.close();
          resolve(0);
        });
      });
    },


    Login: async function (path) {
      return new Promise(function (resolve, reject) {
      var busyDialog = new sap.m.BusyDialog();
      busyDialog.open();

      var url = "http://13.251.57.230/" + path;
      var settings = {
        "url": url,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        }
      };
        
        $.ajax(settings)
        .error(function (xhr, status, error) {
          console.log("Error");
          busyDialog.close();
          resolve("Error");
        })
        .done(function (response) {
          busyDialog.close();
          resolve(response);
        });
      });
    },

    days_between: function(StartDate, EndDate) {
      const oneDay = 1000 * 60 * 60 * 24;
      const start = Date.UTC(new Date(EndDate).getYear(), new Date(EndDate).getMonth(), new Date(EndDate).getDate());
      const end = Date.UTC(new Date(StartDate).getYear(), new Date(StartDate).getMonth(), new Date(StartDate).getDate());
      return (end - start) / oneDay;
    },

    getDayName: function(){
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var d = new Date();
      var dayName = days[d.getDay()]  
      return dayName; 
    },

    getDayNameShort: function(){
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var d = new Date();
      var dayName = days[d.getDay()]  
      return dayName; 
    },


    getCurentMonth: function(){
      const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

      const d = new Date();
      let name = month[d.getMonth()];
      return name;
    },

    getMonth: function(){
      const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

      const d = new Date();
      let name = month[d.getMonth()];
      return name;
    },

    convertJavaTime: function(time){
      var conTime = this.convertAllHour(time);    
      // "(Philippine Standard Time)"
      conTime = conTime + ":00";
      var output =  " " + this.getDayNameShort() + " " + this.getCurentMonth() + " " + this.getTimeout(new Date()) + " " + conTime + " GMT+0800 (Philippine Standard Time)";
    
      return output;
      // Wed Oct 12 2022 17:40:56 GMT+0800 (Philippine Standard Time)
    },

    getTimeout: function (sDate) {
			var year = new Date(sDate).getYear() + 1900;
			var month = new Date(sDate).getMonth() + 1;
			if (month<10){
				month="0" + month;
			}
			var date = new Date(sDate).getDate();
			return  date + " " + year;
		},

    computeTimeDif: function(start,end){
      if(start === "12:00 AM" || start === "12:00 am"){
        start = 0;
      }else{
        start = this.convertAllHour(start);
        start = start.replace(":", "");
        start = start.replace(" ", "");
        start = start.replace("am", "");
        start = start.replace("pm", "");
        start = start.replace("AM", "");
        start = start.replace("PM", "");
      }
      

      if(start.length === 5){
        start = start.slice(1);
      }

      end = this.convertAllHour(end);
      end = end.replace(":", "");
      end = end.replace(" ", "");
      end = end.replace("am", "");
      end = end.replace("pm", "");
      end = end.replace("AM", "");
      end = end.replace("PM", "");
    
    
      if(end.length === 5){
        end = end.slice(1);
      }
      var time = end - start;
      var fTime = "";
      var Dig = this.getlength(time);
      if(Dig === 2){
        fTime = "0" + "." + time;
      }else{
        var digit1 = time.toString().substring(0, 2);
        var digit2 = time.toString().substring(2, 3);
        fTime = digit1 + "." + digit2;
      }

      return this.onRound(fTime,2);
    },
 
    convertAllHour:function(time) {
      var getdigit = time.substr(0, 2);
      var hours = parseInt(getdigit);
      if(time.indexOf('AM') != -1 && hours == 12) {
          time = time.replace('12', '12');
      }

      if(time.indexOf('am') != -1 && hours == 12) {
        time = time.replace('12', '12');
      }

      if(time.indexOf('PM')  != -1 && hours < 12) {
          time = time.replace(hours, (hours + 12));
      }

      if(time.indexOf('pm')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }

    time =time.replace(/(AM|PM)/, '');
    time = time.replace(/(am|pm)/, '');
    time = time.replace(' ', '');
    // time = time.slice(1);
      return time;
    },


    getlength: function (number) {
      return number.toString().length;
    },
    
    getNumberofWeek: function(){
      currentDate = new Date();
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      var days = Math.floor((currentDate - startDate) /(24 * 60 * 60 * 1000));
         
      return weekNumber = Math.ceil(days / 7);
    },

    generateIDKey:function() {
      var length = 8,
        charset = "123141erterertxgdfgwerabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
      },


      postEmail: async function (oData) {
        return new Promise(function (resolve, reject) {
        var url = "http://13.251.57.230/EmailNotification";
        var settings = {
          "url": url,
          "method": "POST",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify(oData),
          };
          
          $.ajax(settings)
          .error(function (xhr, status, error) {
            console.log("Error");
            resolve(error);
          })
          .done(function (response) {
          console.log("Posted");
          resolve(0);
          });
        });
        },


        onUploadFile: async function(form,v1,v2,v3){
          return new Promise(function (resolve, reject) {
            var settings = {
            "url": "http://13.251.57.230/uploadImge",
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
            };
          
            $.ajax(settings)
            .error(function (error){
              console.log(error)
              reject(error);
            }).done(function (response) {				
              var oResult = JSON.parse(response);
              resolve(oResult.profile_url);
            });
      
          });
        },
    
	});
});
