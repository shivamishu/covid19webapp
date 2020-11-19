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

	return BaseController.extend("mymedicalhelpline.controller.LoginView", {
		formatter: formatter,
		onInit: function () {
			var oViewModel;
			this.oComponent = this.getOwnerComponent();
			// this.oODataModel = this.oComponent.getModel();
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
			var oInput = this._oView.byId("mob").addEventDelegate({
				onAfterRendering: function () {
					oInput.focus();
				}
			});
			oViewModel = new JSONModel({
				// welcomeMsg: sHelloMsg,
				showSignIn: true,
				showSignUp: false,
				busy: true,
				isError: false,
				errorMsg: "",
				bIsVisible: false
			});
			this.setModel(oViewModel, "loginView");
			this.getRouter().getRoute("loginpage").attachPatternMatched(this._onRouteMatched, this);
		},
		onAfterRendering: function () {
			// $("#splash-screen").remove();
		},
		_handleLoginRoute: function () {
			this.getModel("loginView").setProperty("/busy", false);
			this._oView.byId("pwd").onsapenter = (function (event) {
				if (event.srcControl.getValue().length > 5 && event.srcControl.getValue().length < 16) {
					if (this.getModel("loginView").getProperty("/showSignUp")) {
						this._oView.byId("signup").firePress();
					} else {
						this._oView.byId("signin").firePress();
					}
				}
			}.bind(this));
			this._oView.byId("mob").onsapenter = (function (event) {
				if (event.srcControl.getValue().length === 10) {
					if (this.getModel("loginView").getProperty("/showSignUp")) {
						this._oView.byId("signup").firePress();
					} else {
						this._oView.byId("signin").firePress();
					}
				}
			}.bind(this));
		},
		_onRouteMatched: function (oEvent) {
			var oToken = window.sessionStorage.accessToken;
			if (!oToken) {
				$("#splash-screen").remove();
				this.getModel("loginView").setProperty("/bIsVisible", true);
				this._handleLoginRoute(); //a normal sign in process
			} else {
				this.onSignInPress("TOKEN");  //sign in with token
			}
		},
		onSignInLinkPress: function (oEvent) {
			this.getModel("loginView").setProperty("/showSignUp", false);
			this.getModel("loginView").setProperty("/showSignIn", true);
		},
		onSignUpLinkPress: function (oEvent) {
			this.getModel("loginView").setProperty("/showSignUp", true);
			this.getModel("loginView").setProperty("/showSignIn", false);
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
		onFNameChange: function (oEvent) {
			var iLen = oEvent.getParameter("value").length;
			if (iLen < 1) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this._oResourceBundle.getText("invalidfname"));
			} else {
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
			}
		},
		onLNameChange: function (oEvent) {
			var iLen = oEvent.getParameter("value").length;
			if (iLen < 1) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this._oResourceBundle.getText("invalidlname"));
			} else {
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
			}
		},
		onEmailChange: function (oEvent) {
			var sEmail = oEvent.getParameter("value");
			if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sEmail)) {
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
			} else {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this._oResourceBundle.getText("invalidEmail"));
			}
		},
		onMobChange: function (oEvent) {
			var iLen = oEvent.getParameter("value").length;
			if (iLen !== 10) {
				oEvent.getSource().setValueState("Error");
				oEvent.getSource().setValueStateText(this._oResourceBundle.getText("invalidmob"));
			} else {
				oEvent.getSource().setValueState("None");
				oEvent.getSource().setValueStateText("");
			}
		},
		onTermsAndConditionsPress: function (oEvent) {
			MessageBox.information(this._oResourceBundle.getText("tnc"), {
				title: this._oResourceBundle.getText("tncTitle")
			});
		},
		onSignUpPress: function (oEvent) {
			var oLoginViewModel = this.getModel("loginView");
			var oForm = this._oView.byId("loginForm").getContent();
			if (!this._onChecks(oForm, oLoginViewModel)) {
				oLoginViewModel.setProperty("/isError", false);
				oLoginViewModel.setProperty("/errorMsg", "");
				oLoginViewModel.setProperty("/busy", true);
				var data = this.getModel("user").getData();
				if (!data.password) {
					data.password = this._oView.byId("pwd").getValue();
				}
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/register",
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						console.log("success");
						if (result) {
							if (result.code === 200) {
								window.sessionStorage.accessToken = result.token;
								MessageToast.show(result.success, {
									onClose: function () {
										this.getModel("user").setProperty("/password", null);
										oLoginViewModel.setProperty("/busy", false);
									}.bind(this)
								});
								this.getRouter().navTo("diagnosispage", {}, true);
							} else {
								oLoginViewModel.setProperty("/busy", false);
								MessageToast.show(result.failed);
								this.getModel("user").setProperty("/password", null);
								oLoginViewModel.setProperty("/isError", true);
								oLoginViewModel.setProperty("/errorMsg", result.failed);

							}
						} else {
							this.getModel("loginView").setProperty("/busy", false);
						}
					}.bind(this),
					error: function (error) {
						console.log("error");
						oLoginViewModel.setProperty("/busy", false);
						if (error) {
							MessageToast.show(error.failed);
							this.getModel("user").setProperty("/password", null);
							oLoginViewModel.setProperty("/isError", true);
							oLoginViewModel.setProperty("/errorMsg", result.failed);
						}
					}.bind(this)
				});
			}
		},
		onSignInPress: function (oEvent) {
			var oLoginViewModel = this.getModel("loginView"),
				oForm = this.getView().byId("loginForm").getContent(),
				sMode = oEvent === "TOKEN" ? "TOKEN" : "LOGIN";

			if (!this._onChecks(oForm, oLoginViewModel, sMode)) {
				oLoginViewModel.setProperty("/isError", false);
				oLoginViewModel.setProperty("/errorMsg", "");
				oLoginViewModel.setProperty("/busy", true);
				var data = this.getModel("user").getData(),
					sEndPoint = "/api/login";
				if (!data.password) {
					data.password = this._oView.byId("pwd").getValue();
				}
				if (sMode === "TOKEN") {
					sEndPoint = "/api/tokenlogin";
				}
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: sEndPoint,
					headers: {
						'Authorization': `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						console.log("success");
						if (result) {
							if (result.code === 200) {
								window.sessionStorage.accessToken = result.token;
								this.getModel("user").setData({
									mobile_no: result.mobile_no,
									fname: result.fname,
									lname: result.lname,
									sex: result.sex,
									age: result.age,
									email: result.email,
									block_no: result.block_no,
									house_no: result.house_no,
									society: result.society,
									street: result.street,
									city: result.city,
									pincode: result.pincode,
									state_id: result.state_id,
									country: result.country,
									status_id: result.status_id,
									latitude: result.latitude,
									longitude: result.longitude
								});
								this.getRouter().navTo("diagnosispage", {}, true);
								this.getModel("user").setProperty("/password", null);
								if (sMode !== "TOKEN") {
									MessageToast.show(result.success, {
										duration: 300
										// onClose: function () {

										// }.bind(this)
									});
								} else {
									// oLoginViewModel.setProperty("/busy", false);
								}
							} else {
								$("#splash-screen").remove();
								oLoginViewModel.setProperty("/bIsVisible", true);
								oLoginViewModel.setProperty("/busy", false);
								MessageToast.show(result.failed);
								this.getModel("user").setProperty("/password", null);
								oLoginViewModel.setProperty("/isError", true);
								oLoginViewModel.setProperty("/errorMsg", result.failed);
							}
						} else {
							this.getModel("user").setProperty("/password", null);
							oLoginViewModel.setProperty("/busy", false);
							$("#splash-screen").remove();
						}
					}.bind(this),
					error: function (error) {
						console.log("error. please login");
						oLoginViewModel.setProperty("/busy", false);
						$("#splash-screen").remove();
						if (error && sMode !== "TOKEN") {
							MessageToast.show(error.failed);
							this.getModel("user").setProperty("/password", null);
							oLoginViewModel.setProperty("/isError", true);
						}
					}.bind(this)
				});
			}
		},
		onForgotPasswordPress: function () {
			MessageBox.confirm("Press OK to reset your password.", {
				onClose: function (sAction) {
					if (sAction === "OK") {
						this.onForgotPassword();
					}
				}.bind(this)
			});
		},
		onForgotPassword: function () {
			var oLoginViewModel = this.getModel("loginView"),
				iMobile_no = this.getModel("user").getProperty("/mobile_no");
			if (!iMobile_no) {
				oLoginViewModel.setProperty("/errorMsg", "Enter a valid mobile number");
				oLoginViewModel.setProperty("/isError", true);
				return;
			}
			if (iMobile_no.toString().length === 10) {
				var data = { mobile_no: iMobile_no };
				oLoginViewModel.setProperty("/busy", true);
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/forgot",
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						console.log("reset link sent");
						oLoginViewModel.setProperty("/busy", false);
						if (result.code === 200) {
							oLoginViewModel.setProperty("/errorMsg", result.success);
							oLoginViewModel.setProperty("/isError", true);
							oLoginViewModel.setProperty("/isSuccess", true);
						} else {
							oLoginViewModel.setProperty("/errorMsg", result.failed ? result.failed : "Enter a valid mobile number");
							oLoginViewModel.setProperty("/isError", true);
							oLoginViewModel.setProperty("/isSuccess", false);
						}
					}.bind(this),
					error: function (error) {
						console.log("reset error");
						oLoginViewModel.setProperty("/busy", false);
						if (error) {
							oLoginViewModel.setProperty("/errorMsg", "Enter a valid mobile number");
							oLoginViewModel.setProperty("/isError", true);
							oLoginViewModel.setProperty("/isSuccess", false);
						}
					}.bind(this)
				});
			} else {
				oLoginViewModel.setProperty("/errorMsg", "Enter a valid mobile number");
				oLoginViewModel.setProperty("/isError", true);
			}
		}

	});

});