sap.ui.define([
  "sap/ui/test/Opa5",
  "claims/Entrego/test/integration/arrangements/Startup",
  "claims/Entrego/test/integration/BasicJourney"
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    pollingInterval: 1
  });

});
