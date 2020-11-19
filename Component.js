sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "mymedicalhelpline/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/HashChanger",
  ],
  function (UIComponent, Device, models, JSONModel, HashChanger) {
    "use strict";

    return UIComponent.extend("mymedicalhelpline.Component", {
      metadata: {
        manifest: "json",
      },

      /**
       * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
       * @public
       * @override
       */
      init: function () {
        // HashChanger.getInstance().replaceHash("");
        // delete window.sessionStorage.accessToken;
        var access_token = new URLSearchParams(window.location.hash).get(
          "access_token"
        );
        access_token = access_token
          ? access_token
          : new URLSearchParams(window.location.hash).get("#access_token");
        if (access_token || window.sessionStorage.admin_accessToken) {
          window.sessionStorage.admin_accessToken = access_token
            ? access_token
            : window.sessionStorage.admin_accessToken;
          window.location.hash = "#";
        } else {
          window.sessionStorage.admin_accessToken = "";
        }
        var currTheme = sap.ui.getCore().getConfiguration().getTheme(),
          userTheme = window.sessionStorage.themeId;
        if (userTheme) {
          if (userTheme !== currTheme) {
            sap.ui.getCore().applyTheme(userTheme);
          }
        } else {
          userTheme = "sap_fiori_3_dark";
          window.sessionStorage.themeId = "sap_fiori_3_dark";
        }
        this.setThemeId(userTheme);
        var hash = window.location.hash;
        if (hash.indexOf("reset") < 0) {
          //replace hash to login page if current page is not reset page
          HashChanger.getInstance().replaceHash("");
        }
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);
        // $("#splash-screen").remove();
        // enable routing
        var oRouter = this.getRouter();
        if (oRouter) {
          oRouter.initialize();
        }
        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // Instantiate global user model
        this.setModel(
          new JSONModel({
            mobile_no: parseInt(window.sessionStorage.mobile_no, 10),
            password: "",
            fname: "",
            lname: "",
            sex: 0,
            age: null,
            email: "",
            location_available: false,
            latitude: null,
            longitude: null,
            status_id:
              window.sessionStorage.status !== "undefined"
                ? window.sessionStorage.status
                : "",
            country: "IN",
          }),
          "user"
        );
      },
      /**
       * The component is destroyed by UI5 automatically.
       * In this method, the ErrorHandler is destroyed.
       * @public
       * @override
       */
      destroy: function () {
        // call the base component's destroy function
        UIComponent.prototype.destroy.apply(this, arguments);
      },
      setThemeId: function (sThemeId) {
        this._sThemeId = sThemeId;
      },
      getThemeId: function () {
        return this._sThemeId ? this._sThemeId : "sap_fiori_3";
      },
      /**
       * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
       * design mode class should be set, which influences the size appearance of some controls.
       * @public
       * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
       */
      getContentDensityClass: function () {
        if (this._sContentDensityClass === undefined) {
          // check whether FLP has already set the content density class; do nothing in this case
          if (
            jQuery(document.body).hasClass("sapUiSizeCozy") ||
            jQuery(document.body).hasClass("sapUiSizeCompact")
          ) {
            this._sContentDensityClass = "";
          } else if (!Device.support.touch) {
            // apply "compact" mode if touch is not supported
            this._sContentDensityClass = "sapUiSizeCompact";
          } else {
            // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
            this._sContentDensityClass = "sapUiSizeCozy";
          }
        }
        return this._sContentDensityClass;
      },
    });
  }
);
