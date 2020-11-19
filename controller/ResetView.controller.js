sap.ui.define([
    "mymedicalhelpline/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "mymedicalhelpline/model/formatter",
    "sap/m/MessageToast"
], function (BaseController, MessageBox, JSONModel, formatter, MessageToast) {
    "use strict";
	/**
	 * Sets the error state of controls that use a data type.
	 *
	 * @param {object} oEvent
	 *   the event raised by UI5 when validation occurs.
	 */
    function controlErrorHandler(oEvent) {
        var oControl = oEvent.getParameter("element");
        var sErrorMessage = oEvent.getParameter("message");

        if (oControl && oControl.setValueStateText && sErrorMessage) {
            oControl.setValueStateText(sErrorMessage);
        }
        if (oControl && oControl.setValueState) {
            oControl.setValueState("Error");
        }
    }
	/**
	 * Sets the normal state of controls that passed a validation.
	 *
	 * @param {object} oEvent
	 *   the event raised by UI5 when validation occurs.
	 */
    function controlNoErrorHandler(oEvent) {
        var oControl = oEvent.getParameter("element");
        if (oControl && oControl.setValueState) {
            oControl.setValueState("None");
        }
    }

    return BaseController.extend("mymedicalhelpline.controller.ResetView", {
        formatter: formatter,
        onInit: function () {
            var oViewModel;
            this.oComponent = this.getOwnerComponent();
            // Handle validation
            sap.ui.getCore().attachParseError(controlErrorHandler);
            sap.ui.getCore().attachValidationSuccess(controlNoErrorHandler);
            this._oView = this.getView();
            // if (!sap.ui.Device.system.phone) {
            // 	this._oView.byId("loginForm").addStyleClass("customWidth");
            // }
            this._oResourceBundle = this.getResourceBundle();
            this._oRouter = this.getOwnerComponent().getRouter();
            // var oToday = new Date(),
            // 	icurHr = oToday.getHours(),
            // 	sHelloMsg;

            // if (icurHr < 12) {
            // 	sHelloMsg = this._oResourceBundle.getText("morning");
            // } else if (icurHr < 17) {
            // 	sHelloMsg = this._oResourceBundle.getText("afernoon");
            // } else {
            // 	sHelloMsg = this._oResourceBundle.getText("evening");
            // }
            var oInput = this._oView.byId("newpwd1").addEventDelegate({
                onAfterRendering: function () {
                    oInput.focus();
                }
            });
            oViewModel = new JSONModel({
                busy: true,
                isError: false,
                msg: "",
                showMsg: false
            });
            this.setModel(oViewModel, "resetView");
            this.getRouter().getRoute("reset").attachPatternMatched(this._onRouteMatched, this);
        },
        onAfterRendering: function () {
            $("#splash-screen").remove();
        },
        _onRouteMatched: function (oEvent) {
            this.getModel("resetView").setProperty("/busy", false);
            // var oToken = oEvent.getParameter("arguments").token;
            // this.getModel("resetView").setProperty("/token", oToken);
            this._oView.byId("newpwd2").onsapenter = (function (event) {
                this._oView.byId("reset").firePress();
            }.bind(this));
        },
        onPwdChange: function (oEvent) {
            var iLen = oEvent.getParameter("value").length;
            if (iLen < 6 || iLen > 15) {
                oEvent.getSource().setValueState("Error");
                oEvent.getSource().setValueStateText(this._oResourceBundle.getText("pwdLength"));
            } else {
                oEvent.getSource().setValueState("None");
                oEvent.getSource().setValueStateText("");
            }
        },
        onPwdChangeConfirm: function (oEvent) {
            var oResetViewModel = this.getModel("resetView"),
                oPwd1 = this._oView.byId("newpwd1"),
                oPwd2 = this._oView.byId("newpwd2");
            if (oPwd1.getValue() === oPwd2.getValue()) {
                if (oPwd1.getValue().length < 6 || oPwd1.getValue().length > 15) {
                    oPwd1.setValueState("Error");
                    oPwd1.setValueStateText(this._oResourceBundle.getText("pwdLength"));
                    oPwd2.setValueState("Error");
                    oPwd2.setValueStateText(this._oResourceBundle.getText("pwdLength"));
                    oResetViewModel.setProperty("/isError", true);
                    oResetViewModel.setProperty("/showMsg", true);
                    oResetViewModel.setProperty("/msg", this._oResourceBundle.getText("pwdLength"));
                    return;
                }
            } else {
                oPwd2.setValueState("Error");
                oPwd2.setValueStateText("Passwords does not match");
                oResetViewModel.setProperty("/isError", true);
                oResetViewModel.setProperty("/showMsg", true);
                oResetViewModel.setProperty("/msg", "Passwords does not match");
                return;
            }
            oPwd1.setValueState("Success");
            oPwd1.setValueStateText("");
            oPwd2.setValueState("Success");
            oPwd2.setValueStateText("");
            oPwd2.setValueState("Success");
            oPwd2.setValueStateText("");
            oResetViewModel.setProperty("/isError", false);
            oResetViewModel.setProperty("/showMsg", false);
            oResetViewModel.setProperty("/msg", "");
        },
        onReloadApp: function () {
            delete window.sessionStorage.accessToken;
            this.getRouter().navTo("loginpage", {}, true);
        },
        onResetPassword: function () {
            var oToken = window.location.href.split("reset/")[1],
                oResetViewModel = this.getModel("resetView"),
                oPwd1 = this._oView.byId("newpwd1"),
                oPwd2 = this._oView.byId("newpwd2");
            oResetViewModel.setProperty("/token", oToken);
            if (oPwd1.getValue() === oPwd2.getValue()) {
                if (oPwd1.getValue().length < 6 || oPwd1.getValue().length > 15) {
                    oPwd1.setValueState("Error");
                    oPwd1.setValueStateText(this._oResourceBundle.getText("pwdLength"));
                    oPwd2.setValueState("Error");
                    oPwd2.setValueStateText(this._oResourceBundle.getText("pwdLength"));
                    oResetViewModel.setProperty("/isError", true);
                    oResetViewModel.setProperty("/showMsg", true);
                    oResetViewModel.setProperty("/msg", this._oResourceBundle.getText("pwdLength"));
                    return;
                }
                oPwd1.setValueState("Success");
                oPwd1.setValueStateText("");
                oPwd2.setValueState("Success");
                oPwd2.setValueStateText("");
                oResetViewModel.setProperty("/isError", false);
                oResetViewModel.setProperty("/showMsg", false);
                oResetViewModel.setProperty("/msg", "");
                var data = { "password": oPwd1.getValue() };
                oResetViewModel.setProperty("/busy", true);
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/api/reset",
                    headers: {
                        'Authorization': `Bearer ` + oResetViewModel.getProperty("/token"),
                    },
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (result) {
                        oResetViewModel.setProperty("/busy", false);
                        oResetViewModel.setProperty("/showMsg", true);
                        console.log("success");
                        if (result.code === 200) {
                            MessageToast.show(result.success);
                            oResetViewModel.setProperty("/isError", false);
                            oResetViewModel.setProperty("/msg", result.success);
                            this._oView.byId("resetForm").setVisible(false);
                        } else {
                            MessageToast.show(result.failed ? result.failed : "An error occured.");
                            oResetViewModel.setProperty("/isError", true);
                            oResetViewModel.setProperty("/msg", result.failed ? result.failed : "An error occured.");
                        }
                    }.bind(this),
                    error: function (error) {
                        console.log("error");
                        oResetViewModel.setProperty("/busy", false);
                        oResetViewModel.setProperty("/showMsg", true);
                        oResetViewModel.setProperty("/isError", true);
                        oResetViewModel.setProperty("/msg", "Password reset session expired. Please perform forgot password steps again.");
                        MessageToast.show("Password reset session expired. Please perform forgot password steps again.");
                    }.bind(this)
                });
            } else {
                oPwd2.setValueState("Error");
                oPwd2.setValueStateText("Passwords does not match");
                oResetViewModel.setProperty("/isError", true);
                oResetViewModel.setProperty("/showMsg", true);
                oResetViewModel.setProperty("/msg", "Passwords does not match");
            }
        }

    });

});