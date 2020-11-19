sap.ui.define([
    "mymedicalhelpline/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("mymedicalhelpline.controller.NotFound", {

        /**
         * Navigates to the worklist when the link is pressed
         * @public
         */
        onLinkPressed: function () {
            delete window.sessionStorage.accessToken;
            this.getRouter().navTo("loginpage", {}, true);
        }

    });

}
);