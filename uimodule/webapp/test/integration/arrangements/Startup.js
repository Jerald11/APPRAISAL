sap.ui.define([
  "sap/ui/test/Opa5"
], function(Opa5) {
  "use strict";

  return Opa5.extend("claims.Entrego.test.integration.arrangements.Startup", {

    iStartMyApp: function () {
      this.iStartMyUIComponent({
        componentConfig: {
          name: "claims.Entrego",
          async: true,
          manifest: true
        }
      });
    }

  });
});
