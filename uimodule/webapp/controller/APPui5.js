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

    toCommas:function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    removeCommas:function (str) {
      while (str.search(",") >= 0) {
          str = (str + "").replace(',', '');
      }
      return str;
    },


    formatAMPM: function(date) {
      var hours = date.getHours() + 1;
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    },


    loadAIP: function(){
      var oBody = [];
      oBody.push({
        "server":localStorage.getItem("RFID_DBServer"),
        "dbpassword": localStorage.getItem("RFID_DBPassword"),
        "dbuser": localStorage.getItem("RFID_DBUser"),
        "dbase": localStorage.getItem("RFID_DBName")
      })

      var that = this;
      var sServerName = localStorage.getItem("RFID_Server");
      var sUrl = sServerName + "/ENV";
      var setting = {
        "url": sUrl,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify(oBody),
      };

      $.ajax(setting).done(function (response) {
        // console.log(response)
      });
      // that.ongetCompany();
    },

    openLoadingFragment: function(){
      if (! this.oDialog) {
            this.oDialog = sap.ui.xmlfragment("busyLogin","claims.Entrego.view.fragment.BusyDialog", this);
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



  CSVToArray: function( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");

		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
			(
				// Delimiters.
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

				// Quoted fields.
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

				// Standard fields.
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
			);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];

		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;


		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){

			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[ 1 ];

			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (
				strMatchedDelimiter.length &&
				(strMatchedDelimiter != strDelimiter)
				){

				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push( [] );

			}


			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[ 2 ]){

				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[ 2 ].replace(
					new RegExp( "\"\"", "g" ),
					"\""
					);

			} else {

				// We found a non-quoted value.
				var strMatchedValue = arrMatches[ 3 ];

			}


			// Now that we have our value string, let's add
			// it to the data array.
			arrData[ arrData.length - 1 ].push( strMatchedValue );
		}

		// Return the parsed data.
		return( arrData );
	},

   Timeformater: function(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  },


	});
});
