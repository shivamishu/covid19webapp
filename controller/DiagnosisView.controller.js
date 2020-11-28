sap.ui.define(
	[
		"mymedicalhelpline/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/Device",
		"sap/m/Button",
		"sap/ui/core/Fragment",
		"mymedicalhelpline/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
	],
	function (
		BaseController,
		JSONModel,
		MessageToast,
		MessageBox,
		Device,
		Button,
		Fragment,
		formatter,
		Filter,
		FilterOperator,
		GroupHeaderListItem
	) {
		"use strict";
		var latitude = null,
			longitude = null;
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
		return BaseController.extend("mymedicalhelpline.controller.DiagnosisView", {
			formatter: formatter,
			onInit: function () {
				var oViewModel;
				this.oComponent = this.getOwnerComponent();
				// Handle validation
				sap.ui.getCore().attachParseError(controlErrorHandler);
				sap.ui.getCore().attachValidationSuccess(controlNoErrorHandler);
				this._oView = this.getView();
				this._oShellBar = this._oView.byId("shell");
				this._oIconTabBar = this._oView.byId("iconTabBar");
				this._oResourceBundle = this.getResourceBundle();
				this._oRouter = this.getOwnerComponent().getRouter();
				oViewModel = new JSONModel({
					welcomeMsg: "",
					themeText: "Change Theme",
					// themeIcon: "sap-icon://palette",
					busy: true,
					adminMode: window.sessionStorage.admin_accessToken ? true : false,
					selectedKey: window.sessionStorage.admin_accessToken ? "ADMIN" : "DIAGNOSIS",
					showResults: !!this.oComponent
						.getModel("user")
						.getProperty("/status_id"),
					updateBusy: true,
					isError: false,
					errorMsg: "",
					states: [{
						key: "AN",
						text: "Andaman and Nicobar Islands",
						phone: "03192-232102",
					}, {
						key: "AP",
						text: "Andhra Pradesh",
						phone: "0866-2410978",
					}, {
						key: "AR",
						text: "Arunachal Pradesh",
						phone: "09436055743",
					}, {
						key: "AS",
						text: "Assam",
						phone: "06913347770",
					}, {
						key: "BR",
						text: "Bihar",
						phone: "104",
					}, {
						key: "CH",
						text: "Chandigarh",
						phone: "09779558282",
					}, {
						key: "CG",
						text: "Chhattisgarh",
						phone: "104",
					}, {
						key: "DH",
						text: "Dadra and Nagar Haveli/Daman & Diu",
						phone: "104",
					}, {
						key: "DL",
						text: "Delhi",
						phone: "011-22307145",
					}, {
						key: "GA",
						text: "Goa",
						phone: "104",
					}, {
						key: "GJ",
						text: "Gujarat",
						phone: "104",
					}, {
						key: "HR",
						text: "Haryana",
						phone: "08558893911",
					}, {
						key: "HP",
						text: "Himachal Pradesh",
						phone: "104",
					}, {
						key: "JK",
						text: "Jammu and Kashmir",
						phone: "0194-2440283",
					}, {
						key: "JH",
						text: "Jharkhand",
						phone: "104",
					}, {
						key: "KA",
						text: "Karnataka",
						phone: "104",
					}, {
						key: "KL",
						text: "Kerala",
						phone: "0471-2552056",
					}, {
						key: "LA ",
						text: "Ladakh",
						phone: "01982256462",
					}, {
						key: "LD",
						text: "Lakshadweep",
						phone: "104",
					}, {
						key: "MP",
						text: "Madhya Pradesh",
						phone: "104",
					}, {
						key: "MH",
						text: "Maharashtra",
						phone: "020-26127394",
					}, {
						key: "MN",
						text: "Manipur",
						phone: "3852411668",
					}, {
						key: "MZ",
						text: "Meghalaya",
						phone: "102",
					}, {
						key: "NL",
						text: "Nagaland",
						phone: "07005539653",
					}, {
						key: "OR",
						text: "Odisha",
						phone: "09439994859",
					}, {
						key: "PY",
						text: "Puducherry",
						phone: "104",
					}, {
						key: "PB",
						text: "Punjab",
						phone: "104",
					}, {
						key: "RJ",
						text: "Rajasthan",
						phone: "0141-2225624",
					}, {
						key: "SK",
						text: "Sikkim",
						phone: "104",
					}, {
						key: "TN",
						text: "Tamil Nadu",
						phone: "044-29510500",
					}, {
						key: "TS",
						text: "Telangana",
						phone: "104",
					}, {
						key: "TR",
						text: "Tripura",
						phone: "0381-2315879",
					}, {
						key: "UK",
						text: "Uttarakhand",
						phone: "104",
					}, {
						key: "UP",
						text: "Uttar Pradesh",
						phone: "104",
					}, {
						key: "WB",
						text: "West Bengal ",
						phone: "03323412600",
					}, ],
				});
				this.setModel(oViewModel, "diagnosisView");
				var oFigureModel = new JSONModel({
					activeCases: 0,
					totalCases: 0,
					deaths: 0,
					recovered: 0,
					tested: 0,
					lastUpdated: "Last updated at: " +
						new Date().toDateString() +
						", " +
						new Date().toLocaleTimeString(),
					new_activeCases: 0,
					new_totalCases: 0,
					new_deaths: 0,
					new_recovered: 0,
					new_tested: 0,
					testLastUpdated: "(Till " + new Date().toDateString() + ")",
					cases: [],
					busy: false,
				});
				this.setModel(oFigureModel, "figuresModel");
				//containment zone model
				var oRedzonesModel = new JSONModel({
					busy: true,
					containmentsAvailability: false,
					numberOfNearbyZones: 0,
					cities: [],
					cityResults: [],
				});
				this.setModel(oRedzonesModel, "redzonesModel");
				this.getRouter()
					.getRoute("diagnosispage")
					.attachPatternMatched(this._onRouteMatched, this);
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment(
						"mymedicalhelpline.view.MenuPopoverFragment",
						this
					);
					this.attachControl(this._oPopover);
					if (Device.system.phone) {
						this._oPopover.setEndButton(
							new Button({
								text: "Close",
								type: sap.m.ButtonType.Default,
								press: this.onMenuChangePress.bind(this),
							})
						);
					}
				}
			},
			_onRouteMatched: function (oEvent) {
				// if (Device.system.desktop) {
				// 	this._oShellBar.setProfile(new sap.f.Avatar());
				// }
				// this._oIconTabBar.fireSelect("DIAGNOSIS");
				window.sessionStorage.contCity =
					window.sessionStorage.contCity !== "undefined" &&
					!!window.sessionStorage.contCity ? window.sessionStorage.contCity : "Bangalore";
				window.sessionStorage.status =
					window.sessionStorage.status !== "undefined" &&
					!!window.sessionStorage.status ? window.sessionStorage.status : "";
				this.getModel("redzonesModel").setProperty(
					"/citySelected",
					window.sessionStorage.contCity
				);
				this.getModel("user").setProperty(
					"/status_id",
					window.sessionStorage.status
				);
				this.getModel("user").setProperty(
					"/city",
					window.sessionStorage.city !== "undefined" &&
					!!window.sessionStorage.city ? window.sessionStorage.city : "Bangalore"
				);
				window.sessionStorage.city =
					window.sessionStorage.city !== "undefined" &&
					!!window.sessionStorage.city ? window.sessionStorage.city : "Bangalore";
				this._handleCurrentFigures();
				this._handleContainmentCitiesFetch();
				var oDiagnosisModel = this.getModel("diagnosisView");
				oDiagnosisModel.setProperty("/busy", false);
				$("#splash-screen").remove();
				var oVBox = this._oView.byId("initialInfo");
				if (oVBox) {
					oVBox.attachBrowserEvent(
						"click",
						function () {
							this.handleRiskAssessment();
						}.bind(this)
					);
				}
				this._checkIsNewLocation("INIT");
				this._handleEssentialServices();
				var oToday = new Date(),
					icurHr = oToday.getHours(),
					sHelloMsg;

				if (icurHr < 12) {
					sHelloMsg = this._oResourceBundle.getText("morning");
				} else if (icurHr < 17) {
					sHelloMsg = this._oResourceBundle.getText("afternoon");
				} else {
					sHelloMsg = this._oResourceBundle.getText("evening");
				}
				oDiagnosisModel.setProperty("/busy", false);
				oDiagnosisModel.setProperty("/welcomeMsg", sHelloMsg);
				var sStateId = this.getModel("user").getProperty("/state_id");
				sStateId = sStateId ? sStateId : window.sessionStorage.statekey;
				sStateId = sStateId !== "undefined" && !!sStateId ? sStateId : "KA";
				window.sessionStorage.statekey = sStateId;
				oDiagnosisModel.setProperty("/state_key", sStateId);
				var oUserModel = this.getModel("user");
				oUserModel.setProperty("/state_id", sStateId);
				oUserModel.setProperty(
					"/street",
					window.sessionStorage.street ? window.sessionStorage.street : ""
				);
				if (
					window.sessionStorage.fname !== "undefined" &&
					!!window.sessionStorage.fname
				) {
					oUserModel.setProperty("/fname", window.sessionStorage.fname);
				}
				if (
					window.sessionStorage.lname !== "undefined" &&
					!!window.sessionStorage.lname
				) {
					oUserModel.setProperty("/lname", window.sessionStorage.lname);
				}
				if (
					window.sessionStorage.age !== "undefined" &&
					!!window.sessionStorage.age
				) {
					var iAge = parseInt(window.sessionStorage.age, 10);
					oUserModel.setProperty("/age", iAge);
				}
				if (
					window.sessionStorage.sex !== "undefined" &&
					!!window.sessionStorage.sex
				) {
					var iSexId = parseInt(window.sessionStorage.sex, 10);
					oUserModel.setProperty("/sex", iSexId);
				}
				MessageToast.show(sHelloMsg);
				if (window.sessionStorage.admin_accessToken) {
					this._handleAdminMode();
				}
			},
			_handleAdminMode: function () {
				var oAdminModel = new JSONModel({
						contacts: [],
						busy: false,
					}),
					data = {
						city: this.getModel("redzonesModel").getProperty("/citySelected"), //not used anymore
					};
				this.setModel(oAdminModel, "adminModel");
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/contacttracelist",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.admin_accessToken}`,
					},
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						// if (result.code === 200) {
						this.getModel("adminModel").setProperty(
							"/contacts",
							result.contacts
						);
						// }
						// this._handleUnauthorizedAccess(result);
					}.bind(this),
					error: function (error) {
						// this._handleUnauthorizedAccess(error);
					}.bind(this),
				});
			},
			onSignInPress: function (oEvent) {
				if (oEvent.getSource().getTitle() === "Sign Out") {
					window.sessionStorage.admin_accessToken = "";
					location.reload();
					return;
				}
				this.getModel("diagnosisView").setProperty("/busy", true);
				window.sessionStorage;
				var sUrl =
					"https://covid19healthcareassistant.auth.ap-south-1.amazoncognito.com/login?client_id=7gqqlrv364d3s2oecqufv7e4is&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://www.mylightningstorage.com/";
				sap.m.URLHelper.redirect(sUrl, false);
			},
			_handleUnauthorizedAccess: function (result) {
				if (result.code === 403 || result.status === 403) {
					MessageBox.warning("Session expired. Please login again.", {
						onClose: function (sAction) {
							delete window.sessionStorage.accessToken;
							this.getRouter().navTo("loginpage", {}, true);
							// location.reload();
						}.bind(this),
					});
				}
			},
			onMenuPress: function (oEvent) {
				this._oPopover.openBy(oEvent.getParameter("button"));
			},
			onMenuChangePress: function (oEvent) {
				this._oPopover.close();
			},
			handleIconTabBarSelect: function (oEvent) {
				var oDiagnosisModel = this.getModel("diagnosisView");
				oDiagnosisModel.setProperty("/updateBusy", true);
				if (oDiagnosisModel.getProperty("/selectedKey") === "ESSENTIALS") {
					// var currTheme = sap.ui.getCore().getConfiguration().getTheme();
					// var aElements = document.querySelectorAll(".customBackground"),
					// i;
					// if (currTheme === "sap_fiori_3") {
					// 	// $('.customBackground').addClass('customBackgroundDark');
					// 	for (i = 0; i < aElements.length; i++) {
					// 		aElements[i].style.backgroundColor = "#f6f6f7";
					// 	}
					// } else {
					// 	// $('.customBackgroundDark').addClass('customBackground');
					// 	for (i = 0; i < aElements.length; i++) {
					// 		aElements[i].style.backgroundColor = "transparent";
					// 	}
					// }
					this._oView.byId("searchEssentialSB").fireChange({
						value: this.getModel("user").getProperty("/city"),
					});
				}
				if (oDiagnosisModel.getProperty("/selectedKey") === "UPDATES") {
					jQuery.sap.delayedCall(2000, this, function () {
						oDiagnosisModel.setProperty("/updateBusy", false);
					});
				}
				if (
					(oDiagnosisModel.getProperty("/selectedKey") === "CALL" ||
						oDiagnosisModel.getProperty("/selectedKey") === "DIAGNOSIS") &&
					!oDiagnosisModel.getProperty("/state_text")
				) {
					var aStates = oDiagnosisModel.getProperty("/states"),
						sStateId = this.getModel("user").getProperty("/state_id");
					sStateId = sStateId ? sStateId : "KA";
					if (Array.prototype.find) {
						aStates.find(function (item) {
							if (item.key === sStateId) {
								oDiagnosisModel.setProperty("/state_key", item.key);
								oDiagnosisModel.setProperty("/state_text", item.text);
								oDiagnosisModel.setProperty("/state_phone", item.phone);
								return true;
							} else {
								return false;
							}
						});
					} else {
						for (var i = 0; i < aStates.length; i++) {
							if (aStates[i].key === sStateId) {
								oDiagnosisModel.setProperty("/state_key", aStates[i].key);
								oDiagnosisModel.setProperty("/state_text", aStates[i].text);
								oDiagnosisModel.setProperty("/state_phone", aStates[i].phone);
								break;
							}
						}
					}
				}
				// if (oDiagnosisModel.getProperty("/selectedKey") === "UPDATES") {
				// 	var sId = "#" + this._oView.getId() + "--bing_frame",
				// 		sStateText = oDiagnosisModel.getProperty("/state_text"),
				// 		sStateKey = sStateText.replace(/ /g, '');
				// 	sStateKey = sStateKey.toLowerCase();
				// 	if (sStateKey === "jammuandkashmir") {
				// 		sStateKey = "jammuandkashmirstate_";
				// 	} else if (sStateKey === "dadraandnagarhaveli/daman&diu") {
				// 		sStateKey = "dadraandnagarhaveli_";
				// 	} else {
				// 		sStateKey += "_";
				// 	}
				// 	var sUrl = "https://www.bing.com/covid/local/" + sStateKey + "india?form=C19WID&vert=graph";

				// 	$(sId).attr("src", sUrl);
				// }
			},
			handleSaveAddress: function (oEvent) {
				var oDiagnosisModel = this.getModel("diagnosisView");
				var oForm = this.getView().byId("addressForm").getContent();
				if (!this._onChecks(oForm, oDiagnosisModel, true)) {
					oDiagnosisModel.setProperty("/isError", false);
					oDiagnosisModel.setProperty("/errorMsg", "");
					// oDiagnosisModel.setProperty("/busy", true);
					var data = this.getModel("user").getData();
					if (JSON.stringify(data) === JSON.stringify(this._oBackUpUserModel)) {
						//no need to save
						return;
					}
					if (
						data.mobile_no !== window.sessionStorage.mobile_no ||
						data.city !== window.sessionStorage.city ||
						data.state_id !== window.sessionStorage.statekey ||
						data.country !== window.sessionStorage.country
					) {
						window.sessionStorage.mobile_no = parseInt(data.mobile_no, 10);
						var oLoginViewModel = this.getModel("user"),
							bIsNewCoordinate = this._isNewCoordinate(
								oLoginViewModel.getProperty("/latitude"),
								oLoginViewModel.getProperty("/longitude")
							);
						oLoginViewModel.setProperty(
							"/mobile_no",
							parseInt(data.mobile_no, 10)
						);
						if (bIsNewCoordinate) {
							this._setCurentLocation();
						}
						$.ajax({
							type: "POST",
							contentType: "application/json",
							url: "/api/setaddress",
							headers: {
								Authorization: `Bearer ${window.sessionStorage.accessToken}`,
							},
							data: JSON.stringify(data),
							dataType: "json",
							success: function (result) {
								window.sessionStorage.accessToken = result.token;
								window.sessionStorage.city = data.city;
								window.sessionStorage.street = data.street;
								window.sessionStorage.statekey = data.state_id;
								window.sessionStorage.country = data.country;
								window.sessionStorage.fname = data.fname;
								window.sessionStorage.lname = data.lname;
								window.sessionStorage.age = data.age;
								window.sessionStorage.sex = data.sex;
								console.log("address save success");
								if (result) {
									if (result.code === 200) {
										// MessageToast.show(result.success, {
										// 	duration: 1500,
										// 	onClose: function () {
										// 		oDiagnosisModel.setProperty("/busy", false);
										// 	}.bind(this)
										// });
									} else {
										// oDiagnosisModel.setProperty("/busy", false);
										// MessageToast.show(result.failed);
										// oDiagnosisModel.setProperty("/isError", true);
										// oDiagnosisModel.setProperty("/errorMsg", result.failed);
									}
								} else {
									// oDiagnosisModel.setProperty("/busy", false);
								}
								// this._handleUnauthorizedAccess(result);
							}.bind(this),
							error: function (error) {
								console.log("error");
								// oDiagnosisModel.setProperty("/busy", false);
								if (error && error.failed) {
									// MessageToast.show(error.failed, { duration: 1500 });
									// oDiagnosisModel.setProperty("/isError", true);
									// oDiagnosisModel.setProperty("/errorMsg", error.failed);
								}
								// this._handleUnauthorizedAccess(error);
							}.bind(this),
						});
					}
				}
			},
			onListItemSelectionChange: function (oEvent) {
				var oList = oEvent.getSource(),
					oItem = oEvent.getParameter("listItem");
				if (oItem && oEvent.getParameter("selected")) {
					var sItemId = oItem.getId(),
						sSplittedItemId = sItemId.split("--")[2];
					if (sSplittedItemId.indexOf("noQ") > -1) {
						oList.removeSelections();
						oList.setSelectedItemById(sItemId);
					} else {
						var oLastNoQItem = oList.getItems()[oList.getItems().length - 1];
						oLastNoQItem.setProperty("selected", false);
					}
				}
			},
			onAddressFieldChange: function (oEvent) {
				var iLen = oEvent.getParameter("value").length;
				if (!iLen) {
					oEvent.getSource().setValueState("Error");
					oEvent
						.getSource()
						.setValueStateText(this._oResourceBundle.getText("invalid"));
				} else {
					oEvent.getSource().setValueState("None");
					oEvent.getSource().setValueStateText("");
				}
			},
			_checkIsNewLocation: function (sMode) {
				sMode = sMode !== "ASSESSMENT" && sMode !== "INIT" ? "SEARCH" : sMode;
				// var oLoginViewModel = this.getModel("user");
				// if (oLoginViewModel.getProperty("/latitude") !== latitude && oLoginViewModel.getProperty("/longitude") !== longitude) {
				this._getCurentLocation(sMode !== "ASSESSMENT", sMode);
				// }
			},
			handleReTakeRiskAssessment: function (oEvent) {
				this.getModel("diagnosisView").setProperty("/showResults", false);
				MessageToast.show("Please click Launch Button to continue assessment", {
					duration: 4000,
				});
				var oVBox = this._oView.byId("initialInfo");
				if (oVBox) {
					oVBox.attachBrowserEvent(
						"click",
						function () {
							this.handleRiskAssessment();
						}.bind(this)
					);
				}
				this._oRedZonesList = null;
				this.handleLocalitySearch();
			},
			handleRiskAssessment: function (oEvent) {
				// var oDiagnosisModel = this.getModel("diagnosisView");
				// var oForm = this.getView().byId("addressForm").getContent();
				this._checkIsNewLocation("ASSESSMENT");
				// if (!this._onChecks(oForm, oDiagnosisModel, true)) {
				if (!this._oAssessmentDialog) {
					this._oAssessmentDialog = sap.ui.xmlfragment(
						this._oView.getId(),
						"mymedicalhelpline.view.AssessmentFragment",
						this
					);
					this.attachControl(this._oAssessmentDialog);
				}
				this._oBackUpUserModel = jQuery.extend(
					true, {},
					this.getModel("user").getData()
				);
				var mobile_no = this.getModel("user").getProperty("/mobile_no");
				mobile_no = mobile_no ? mobile_no : parseInt(window.sessionStorage.mobile_no, 10);
				var aContacts = [{
					mobile_no: mobile_no,
					contact_id: 1,
					contact_name: "",
					contact_number: null,
					contact_address: "",
				}, {
					mobile_no: mobile_no,
					contact_id: 2,
					contact_name: "",
					contact_number: null,
					contact_address: "",
				}, {
					mobile_no: mobile_no,
					contact_id: 3,
					contact_name: "",
					contact_number: null,
					contact_address: "",
				}, ];
				var oAssessmentDialogModel = new JSONModel({
					step0: true,
					step1: false,
					step2: false,
					step3: false,
					step4: false,
					step5: false,
					step6: false,
					step7: false,
					result: false,
					contacts: aContacts,
					total_contacts: "3",
					bIsError: false,
				});
				this.setModel(oAssessmentDialogModel, "assessmentModel");
				this._stepCount = 0;
				this._oAssessmentDialog.open();
				// }
			},
			handleRiskAssessmentClose: function (oEvent) {
				if (this._oAssessmentDialog) {
					this._oAssessmentDialog.close();
					this._oAssessmentDialog.destroy();
					this._oAssessmentDialog = null;
				}
			},
			handleRiskAssessmentResults: function (oEvent) {
				var oAssessmentModel = this.getModel("assessmentModel"),
					aContactList = oAssessmentModel.getProperty("/contacts"),
					bIsError = false,
					oUserModel = this.getModel("user");
				if (
					oUserModel.getProperty("/status_id") === "MEDIUM" ||
					oUserModel.getProperty("/status_id") === "HIGH"
				) {
					for (var i = 0; i < aContactList.length; i++) {
						if (!aContactList[i].contact_id ||
							!aContactList[i].contact_name ||
							!aContactList[i].contact_number ||
							!aContactList[i].contact_address
						) {
							bIsError = true;
							break;
						}
					}
					if (bIsError) {
						oAssessmentModel.setProperty("/bIsError", true);
						oAssessmentModel.setProperty(
							"/errorMsg",
							"Please fill out all the below details"
						);
					} else {
						if (aContactList.length) {
							this._handleContactsSave(oUserModel.getProperty("/mobile_no"));
						} else {
							this.getModel("diagnosisView").setProperty(
								"/showResults", !!oUserModel.getProperty("/status_id")
							);
							if (this._oAssessmentDialog) {
								this._oAssessmentDialog.close();
								this._oAssessmentDialog.destroy();
								this._oAssessmentDialog = null;
							}
						}
					}
				} else {
					this.getModel("diagnosisView").setProperty(
						"/showResults",
						oUserModel.getProperty("/status_id") === "LOW"
					);
					if (this._oAssessmentDialog) {
						this._oAssessmentDialog.close();
						this._oAssessmentDialog.destroy();
						this._oAssessmentDialog = null;
					}
				}
			},
			handleRiskAssessmentPrev: function () {
				if (this._stepCount - 1 > -1) {
					this._stepCount -= 2;
					this.handleRiskAssessmentNext("PREV");
				}
			},
			handleRiskAssessmentNext: function (oEvent) {
				var oAssessmentModel = this.getModel("assessmentModel"),
					aListItems = [],
					bIsError = false,
					bIsAddressStep = false,
					stepData,
					aContacts = oAssessmentModel.getProperty("/contacts"),
					total_contacts = oAssessmentModel.getProperty("/total_contacts");
				this._stepCount += 1; //increment the step count
				switch (this._stepCount) {
				case 0:
					if (oEvent === "PREV") {
						stepData = {
							step0: true,
							step1: false,
							step2: false,
							step3: false,
							step4: false,
							step5: false,
							step6: false,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
						bIsAddressStep = true;
					}
					break;
				case 1:
					var oForm = this.getView().byId("addressForm").getContent();
					if (!this._onChecks(oForm, oAssessmentModel, true) ||
						oEvent === "PREV"
					) {
						this.handleSaveAddress();
						stepData = {
							step0: false,
							step1: true,
							step2: false,
							step3: false,
							step4: false,
							step5: false,
							step6: false,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
						bIsAddressStep = true;
					}
					break;
				case 2:
					aListItems = this._oView.byId("feverList").getSelectedItems();
					if (aListItems.length || oEvent === "PREV") {
						stepData = {
							step0: false,
							step1: false,
							step2: true,
							step3: false,
							step4: false,
							step5: false,
							step6: false,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
					}
					break;
				case 3:
					aListItems = this._oView
						.byId("commonSymptomsList")
						.getSelectedItems();
					if (aListItems.length || oEvent === "PREV") {
						stepData = {
							step0: false,
							step1: false,
							step2: false,
							step3: true,
							step4: false,
							step5: false,
							step6: false,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
					}
					break;
				case 4:
					aListItems = this._oView.byId("addSymptomsList").getSelectedItems();
					if (aListItems.length || oEvent === "PREV") {
						stepData = {
							step0: false,
							step1: false,
							step2: false,
							step3: false,
							step4: true,
							step5: false,
							step6: false,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
					}
					break;
				case 5:
					aListItems = this._oView.byId("travelList").getSelectedItems();
					if (aListItems.length || oEvent === "PREV") {
						stepData = {
							step0: false,
							step1: false,
							step2: false,
							step3: false,
							step4: false,
							step5: true,
							step6: false,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
					}
					break;
				case 6:
					aListItems = this._oView.byId("diseaseList").getSelectedItems();
					if (aListItems.length || oEvent === "PREV") {
						stepData = {
							step0: false,
							step1: false,
							step2: false,
							step3: false,
							step4: false,
							step5: false,
							step6: true,
							step7: false,
							result: false,
							contacts: aContacts,
							total_contacts: total_contacts,
							bIsError: false,
						};
					} else {
						bIsError = true;
					}
					break;
				case 7:
					aListItems = this._oView.byId("conditionList").getSelectedItems();
					if (aListItems.length || oEvent === "PREV") {
						this._handleSymptomsResult();
						// stepData = {
						//  step0: false,
						// 	step1: false,
						// 	step2: false,
						// 	step3: false,
						// 	step4: false,
						// 	step5: false,
						// 	step6: false,
						// 	step7: true,
						// 	result: true,
						// 	contacts: aContacts,
						// 	total_contacts: total_contacts,
						// 	bIsError: false,
						// 	final_msg: "Before we show results, we would like you to enter the below information."
						// };
					} else {
						bIsError = true;
					}
					break;
				default:
					// this should not occur
					bIsError = true;
				}
				if (!bIsError) {
					if (this._stepCount !== 7) {
						oAssessmentModel.setData(stepData);
					}
				} else {
					this._stepCount -= 1; //reset step count
					oAssessmentModel.setProperty("/bIsError", true);
					oAssessmentModel.setProperty(
						"/errorMsg",
						bIsAddressStep ? "Please fill out all mandatory fields" : "Please choose at least one of the below options"
					);
				}
				var currTheme = this.oComponent.getThemeId();
				var aElements = document.querySelectorAll(".customBackground"),
					i;
				if (currTheme === "sap_fiori_3_dark") {
					// $('.customBackground').addClass('customBackgroundDark');
					for (i = 0; i < aElements.length; i++) {
						aElements[i].style.backgroundColor = "transparent";
					}
				} else {
					// $('.customBackgroundDark').addClass('customBackground');
					for (i = 0; i < aElements.length; i++) {
						aElements[i].style.backgroundColor = "#f6f6f7";
					}
				}
			},
			_getCurentLocation: function (bHideMsg, sMode) {
				var oLoginViewModel = this.getModel("user"),
					oDiagnosisButton = this._oView.byId("survey");
				var oRedzonesModel = this.getModel("redzonesModel");
				// oRedzonesModel.setProperty("/busy", true);
				if (!navigator.geolocation) {
					console.log("Geolocation is not supported by the browser");
					if (sMode === "SEARCH") {
						MessageBox.error(
							"Geolocation is not supported. Location services features will not be available"
						);
					}
					// oRedzonesModel.setProperty("/busy", false);
				} else {
					if (oDiagnosisButton) {
						// oDiagnosisButton.setBusy(true);
					}
					navigator.geolocation.getCurrentPosition(
						success.bind(this),
						error.bind(this)
					);
				}

				function success(position) {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					if (oDiagnosisButton) {
						oDiagnosisButton.setBusy(false);
					}
					// oRedzonesModel.setProperty("/busy", false);
					var sCurrZoneDate = window.sessionStorage.containmentZonesCurrentDate,
						bIsNewCoordinate = this._isNewCoordinate(
							oLoginViewModel.getProperty("/latitude"),
							oLoginViewModel.getProperty("/longitude")
						);
					if (bIsNewCoordinate) {
						oLoginViewModel.setProperty("/latitude", latitude);
						oLoginViewModel.setProperty("/longitude", longitude);
						oLoginViewModel.setProperty("/location_available", true);
						// this._setCurentLocation();
					}
					if (!!sCurrZoneDate) {
						if (
							sCurrZoneDate === new Date().toDateString() &&
							!bIsNewCoordinate
						) {
							var bIsContainmentZonesAvailable = this.getModel(
								"redzonesModel"
							).getProperty("/containmentsAvailability");
							if (bIsContainmentZonesAvailable) {
								MessageToast.show(
									"List of Containment zones near you is available now."
								);
							} else if (sMode === "SEARCH") {
								MessageBox.information(
									"As of now, either there is no Containment or Hotspot Zone near you or the data is not available for your nearby area."
								);
							}
							// this.getModel("redzonesModel").setProperty("/busy", false);
							return;
						} else {
							// this.handleRedzones();
						}
					} else {
						// this.handleRedzones();
					}
				}

				function error() {
					var sCurrZoneDate = window.sessionStorage.containmentZonesCurrentDate,
						bIsNewCoordinate =
						oLoginViewModel.getProperty("/latitude") !== latitude ||
						oLoginViewModel.getProperty("/longitude") !== longitude;
					if (oDiagnosisButton) {
						oDiagnosisButton.setBusy(false);
					}
					// oRedzonesModel.setProperty("/busy", false);
					if (!bHideMsg && sMode === "ASSESSMENT") {
						MessageBox.warning(this._oResourceBundle.getText("allowlocation"));
					}
					if (sMode === "SEARCH") {
						MessageBox.error(
							"Location access denied. Please allow Location access permissions and search again to enable this feature."
						);
					}
					console.log("Unable to retrieve your location.");
					// oLoginViewModel.setProperty("/latitude", null);
					// oLoginViewModel.setProperty("/longitude", null);
					if (!!oLoginViewModel.getProperty("/latitude") &&
						!!oLoginViewModel.getProperty("/longitude")
					) {
						latitude = oLoginViewModel.getProperty("/latitude");
						longitude = oLoginViewModel.getProperty("/longitude");
						MessageToast.show(
							"Location permission deined. Displaying results based on previous location available", {
								duration: 1000,
							}
						);
						if (!!sCurrZoneDate) {
							if (
								sCurrZoneDate === new Date().toDateString() &&
								!bIsNewCoordinate
							) {
								var bIsContainmentZonesAvailable = this.getModel(
									"redzonesModel"
								).getProperty("/containmentsAvailability");
								if (bIsContainmentZonesAvailable) {
									MessageToast.show(
										"List of Containment Zones near you is available now."
									);
								} else {
									MessageBox.information(
										"As of now, either there is no containment zone near you or the data is not available for your nearby area."
									);
								}
								return;
							} else {
								// this.handleRedzones();
							}
						} else {
							// this.handleRedzones();
						}
					}
					oLoginViewModel.setProperty("/location_available", false);
				}
			},
			_isNewCoordinate: function (lat, lng) {
				if (lat) {
					lat = parseFloat(lat.toFixed(4));
				}
				if (lng) {
					lng = parseFloat(lng.toFixed(4));
				}
				if (
					parseFloat(longitude.toFixed(4)) !== lng ||
					parseFloat(latitude.toFixed(4)) !== lat
				) {
					return true; //new coordinates
				} else {
					return false;
				}
			},
			_setCurentLocation: function () {
				var oDiagnosisButton = this._oView.byId("survey");
				var userData = this.getModel("user").getData(),
					data = {
						mobile_no: userData.mobile_no,
						latitude: userData.latitude,
						longitude: userData.longitude,
					};

				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/setlocation",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						if (result.code === 200) {
							console.log("location allowed");
							if (oDiagnosisButton) {
								oDiagnosisButton.setBusy(false);
							}
						}
						// this._handleUnauthorizedAccess(result);
					}.bind(this),
					error: function (error) {
						if (oDiagnosisButton) {
							oDiagnosisButton.setBusy(false);
						}
						// this._handleUnauthorizedAccess(error);
						console.log("location not allowed");
					}.bind(this),
				});
			},
			handleTotalContactsChange: function (oEvent) {
				var oComboBox = oEvent.getSource(),
					sSelectedKey = oComboBox.getSelectedKey(),
					sValue = oComboBox.getValue();

				if (!sSelectedKey && sValue) {
					oComboBox.setValueState("Error");
					oComboBox.setValueStateText(
						"Please enter a valid nummber between 0 to 20"
					);
				} else {
					oComboBox.setValueState("None");
					var oAssessmentModel = this.getModel("assessmentModel");
					var aContactList = oAssessmentModel.getProperty("/contacts");

					var iTotal = parseInt(sSelectedKey, 10),
						iResultant = iTotal - aContactList.length;
					if (iTotal < aContactList.length) {
						var i = iResultant;
						while (i < 0) {
							aContactList.pop();
							i++;
						}
					} else if (iTotal > aContactList.length) {
						var mobile_no = this.getModel("user").getProperty("/mobile_no");
						for (var i = 0; i < iResultant; i++) {
							aContactList.push({
								mobile_no: mobile_no,
								contact_id: aContactList.length + 1,
								contact_name: "",
								contact_number: null,
								contact_address: "",
							});
						}
					}
				}
			},
			_handleSymptomsResult: function () {
				var aSelectedItems = [
						...this._oView.byId("feverList").getSelectedItems(),
						...this._oView.byId("commonSymptomsList").getSelectedItems(),
						...this._oView.byId("addSymptomsList").getSelectedItems(),
						...this._oView.byId("travelList").getSelectedItems(),
						...this._oView.byId("diseaseList").getSelectedItems(),
						...this._oView.byId("conditionList").getSelectedItems(),
					],
					oDataObject = {},
					prop = "";

				aSelectedItems.forEach(function (item) {
					prop = item.getId().split("--")[2];
					oDataObject[prop] = true;
				});
				oDataObject.status = "";
				oDataObject.mobile_no = this.getModel("user").getProperty("/mobile_no");
				// var oSymptomsModel = new JSONModel(oDataObject);
				// this.setModel(oSymptomsModel, "symptomsModel");
				this.getModel("diagnosisView").setProperty("/busy", true);
				if (this._oAssessmentDialog) {
					this._oAssessmentDialog.setBusy(true);
				}
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/symptoms",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(oDataObject),
					dataType: "json",
					success: function (result) {
						console.log("diagnosis completed successfully");
						if (result.code === 200) {
							this.getModel("user").setProperty("/status_id", result.status);
							window.sessionStorage.status = result.status;
							this._handleFinalStep(result.status);
						} else {
							if (this._oAssessmentDialog) {
								this._oAssessmentDialog.close();
								this._oAssessmentDialog.destroy();
								this._oAssessmentDialog = null;
							}
							MessageToast.show("An error occured. Please retake assessment");
						}
						this.getModel("diagnosisView").setProperty("/busy", false);
						if (this._oAssessmentDialog) {
							this._oAssessmentDialog.setBusy(false);
						}
						// this._handleUnauthorizedAccess(result);
					}.bind(this),
					error: function (error) {
						console.log("error occurred during assessment results.");
						if (this._oAssessmentDialog) {
							this._oAssessmentDialog.close();
							this._oAssessmentDialog.destroy();
							this._oAssessmentDialog = null;
						}
						MessageToast.show("An error occured. Please retake assessment");
						this.getModel("diagnosisView").setProperty("/busy", false);
						// this._handleUnauthorizedAccess(error);
					}.bind(this),
				});
			},
			_handleFinalStep: function (sStatus) {
				var oAssessmentModel = this.getModel("assessmentModel"),
					stepData,
					aContacts = oAssessmentModel.getProperty("/contacts"),
					total_contacts = oAssessmentModel.getProperty("/total_contacts");
				stepData = {
					step0: false,
					step1: false,
					step2: false,
					step3: false,
					step4: false,
					step5: false,
					step6: false,
					step7: true,
					result: true,
					contacts: aContacts,
					total_contacts: total_contacts,
					bIsError: false,
					final_msg: sStatus !== "LOW" ? "Before we show results, we would like you to enter the below information." : "Please click 'Show Results' button.",
					status: sStatus,
				};
				oAssessmentModel.setData(stepData);
			},
			_handleContactsSave: function (iMobile_no) {
				var oAssessmentModel = this.getModel("assessmentModel");
				var aContactList = oAssessmentModel.getProperty("/contacts");
				this.getModel("diagnosisView").setProperty("/busy", true);
				if (this._oAssessmentDialog) {
					this._oAssessmentDialog.setBusy(true);
				}
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/contacttraces",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(aContactList),
					dataType: "json",
					success: function (result) {
						console.log("contacts saved successfully");
						// if (result.code === 200) {
						this.getModel("diagnosisView").setProperty("/showResults", true);
						if (this._oAssessmentDialog) {
							this._oAssessmentDialog.close();
							this._oAssessmentDialog.destroy();
							this._oAssessmentDialog = null;
						}
						// } else {
						//   MessageToast.show("An error occured. Please retake assessment");
						// }
						this.getModel("diagnosisView").setProperty("/busy", false);
						if (this._oAssessmentDialog) {
							this._oAssessmentDialog.setBusy(false);
						}
						// this._handleUnauthorizedAccess(result);
					}.bind(this),
					error: function (error) {
						console.log("error occurred while saving contacts.");
						if (this._oAssessmentDialog) {
							this._oAssessmentDialog.close();
							this._oAssessmentDialog.destroy();
							this._oAssessmentDialog = null;
						}
						MessageToast.show("An error occured. Please retake assessment");
						this.getModel("diagnosisView").setProperty("/busy", false);
						// this._handleUnauthorizedAccess(error);
					}.bind(this),
				});
			},
			handleBookAppointmentOpen: function (oEvent) {
				MessageBox.confirm("Book Appointment for sample collection ?", {
					onClose: function (sAction) {
						if (sAction === "OK") {
							MessageToast.show(
								"Appointment request submitted. You will be notified once the appointment is confirmed."
							);
						}
					},
				});
			},
			onAvatarPress: function (oEvent) {
				var oAvatar = oEvent.getSource();
				if (!this._oMenu) {
					Fragment.load({
						name: "mymedicalhelpline.view.Menu",
						controller: this,
					}).then(
						function (oPopover) {
							this._oMenu = oPopover;
							this.attachControl(this._oMenu);
							this._oMenu.openBy(oAvatar);
						}.bind(this)
					);
				} else {
					this._oMenu.openBy(oAvatar);
				}
			},
			onLogoutPress: function (oEvent) {
				MessageBox.confirm("Press OK to Log Out", {
					onClose: function (sAction) {
						if (sAction === "OK") {
							MessageToast.show("Logged Out!", {
								animation: 1000,
								duration: 1000,
							});
							delete window.sessionStorage.accessToken;
							this.getRouter().navTo("loginpage", {}, true);
							// location.reload();
						}
					}.bind(this),
				});
				this._oMenu.close();
			},
			//   _handleEssentialServices: function (latitude, longitude) {
			//     var oEssentialServices = new JSONModel({
			//       features: [],
			//       categories: [],
			//       selectedKeys: [],
			//       busy: true,
			//       total: 0,
			//     });
			//     this.setModel(oEssentialServices, "essentialServices");
			//     $.ajax({
			//       url: "https://api.covid19india.org/resources/geoResources.json",
			//       type: "GET",
			//       success: function (data) {
			//         var aUniqueCategories = [],
			//           aCategories = [],
			//           aSelectedKeys = [];
			//         var defaultItem = {
			//           geometry: {
			//             type: "Point",
			//             coordinates: [73.7123366, 18.5649236],
			//           },
			//           properties: {
			//             addr:
			//               "Mediplace Polyclinic, Thorve Vishwa, Baner - Balewadi Road, \n Pune, Maharashtra, India",
			//             contact: "https://dr-yashi-physio.business.site/",
			//             desc:
			//               "Physiotherapy Clinic - Online Consultation/treatment sessions are also available." +
			//               "\n" +
			//               "Our main motto is to treat any patient's pain with non surgical treatment and give long term relief. Exercises and therapies provided by us will going to help you to overcome any pain. ",
			//             geoTag: "Online",
			//             icon: "orthopedics",
			//             name: "Physiotherapy Clinic",
			//             phone: "7000304448",
			//             priority: 1,
			//             recordid: "0.1",
			//             state: "Maharashtra",
			//           },
			//         };
			//         data.features.unshift(defaultItem);
			//         defaultItem = {
			//           geometry: {
			//             type: "Point",
			//             coordinates: [77.19575, 28.66976],
			//           },
			//           properties: {
			//             addr: "18B, 2nd Floor, Pratap Nagar, New Delhi, India",
			//             contact:
			//               "https://www.facebook.com/SAI-FOODS-and-Namkeen-823322731045773",
			//             desc:
			//               "Please contact us for Homemade Fresh Authentic South Indian Food, Sweets and Namkeen." +
			//               "\n" +
			//               "We also take orders on phone call and deliver at your doorstep.",
			//             geoTag: "Delhi / NCR",
			//             icon: "food",
			//             name: "Fresh Authentic South Indian Food and Namkeen",
			//             phone: "9999330678, 011 22755485",
			//             priority: 1,
			//             recordid: "0.2",
			//             state: "Delhi / NCR",
			//           },
			//         };
			//         data.features.unshift(defaultItem);
			//         data.features.forEach(function (item) {
			//           if (!aUniqueCategories[item.properties.icon]) {
			//             aUniqueCategories[item.properties.icon] = true;
			//             aCategories.push({
			//               key: item.properties.icon,
			//               value: true,
			//             });
			//             aSelectedKeys.push(item.properties.icon);
			//           }
			//         });
			//         oEssentialServices = new JSONModel({
			//           features: data.features,
			//           categories: aCategories,
			//           selectedKeys: aSelectedKeys,
			//           busy: true,
			//         });
			//         oEssentialServices.setSizeLimit(data.features.length);
			//         this.setModel(oEssentialServices, "essentialServices");
			//         this._filterEssentialServices(
			//           this.getModel("user").getProperty("/city")
			//         );
			//       }.bind(this),
			//       error: function (error) {
			//         var aUniqueCategories = [],
			//           aCategories = [],
			//           aSelectedKeys = [],
			//           data = { features: [] };
			//         var defaultItem = {
			//           geometry: {
			//             type: "Point",
			//             coordinates: [73.7123366, 18.5649236],
			//           },
			//           properties: {
			//             addr:
			//               "Mediplace Polyclinic, Thorve Vishwa, Baner - Balewadi Road, \n Pune, Maharashtra, India",
			//             contact: "https://dr-yashi-physio.business.site/",
			//             desc:
			//               "Physiotherapy Clinic - Online Consultation/treatment sessions are also available." +
			//               "\n" +
			//               "Our main motto is to treat any patient's pain with non surgical treatment and give long term relief. Exercises and therapies provided by us will going to help you to overcome any pain. ",
			//             geoTag: "Online",
			//             icon: "orthopedics",
			//             name: "Physiotherapy Clinic",
			//             phone: "7000304448",
			//             priority: 1,
			//             recordid: "0.1",
			//             state: "Maharashtra",
			//           },
			//         };
			//         data.features.unshift(defaultItem);
			//         defaultItem = {
			//           geometry: {
			//             type: "Point",
			//             coordinates: [77.19575, 28.66976],
			//           },
			//           properties: {
			//             addr: "18B, 2nd Floor, Pratap Nagar, New Delhi, India",
			//             contact:
			//               "https://www.facebook.com/SAI-FOODS-and-Namkeen-823322731045773",
			//             desc:
			//               "Please contact us for Homemade Fresh Authentic South Indian Food, Sweets and Namkeen." +
			//               "\n" +
			//               "We also take orders on phone call and deliver at your doorstep.",
			//             geoTag: "Delhi / NCR",
			//             icon: "food",
			//             name: "Fresh Authentic South Indian Food and Namkeen",
			//             phone: "9999330678, 011 22755485",
			//             priority: 1,
			//             recordid: "0.2",
			//             state: "Delhi / NCR",
			//           },
			//         };
			//         data.features.unshift(defaultItem);
			//         data.features.forEach(function (item) {
			//           if (!aUniqueCategories[item.properties.icon]) {
			//             aUniqueCategories[item.properties.icon] = true;
			//             aCategories.push({
			//               key: item.properties.icon,
			//               value: true,
			//             });
			//             aSelectedKeys.push(item.properties.icon);
			//           }
			//         });
			//         oEssentialServices = new JSONModel({
			//           features: data.features,
			//           categories: aCategories,
			//           selectedKeys: aSelectedKeys,
			//           busy: true,
			//         });
			//         oEssentialServices.setSizeLimit(data.features.length);
			//         this.setModel(oEssentialServices, "essentialServices");
			//         this._filterEssentialServices(
			//           this.getModel("user").getProperty("/city")
			//         );
			//       }.bind(this),
			//     });
			//   },
			_handleEssentialServices: function (sCity) {
				sCity = sCity ? sCity : this.getModel("user").getProperty("/city");
				var oEssentialServices = new JSONModel({
					features: [],
					categories: [],
					selectedKeys: [],
					busy: true,
					total: 0,
				});
				this.setModel(oEssentialServices, "essentialServices");
				$.ajax({
					url: "https://covid.icmr.org.in/index.php?option=com_hotspots&view=jsonv4&task=gethotspots&hs-language=en-GB&page=1&per_page=5000&search=" +
						sCity +
						"&cat=&format=raw",
					type: "GET",
					success: function (results) {
						results = JSON.parse(results);
						var aStates = this.getModel("diagnosisView").getProperty("/states"),
							sPhone = "NA",
							data = {
								features: []
							};
						results.items.forEach(function (item) {
							if (sPhone === "NA") {
								aStates.find(function (i) {
									if (item.state.indexOf(i.text) > -1) {
										sPhone = i.phone;
										return true;
									} else {
										return false;
									}
								});
							}
							var currItem = {
								geometry: {
									type: "Point",
									coordinates: [73.7123366, 18.5649236],
								},
								properties: {
									addr: item.address,
									contact: "https://covid.icmr.org.in" + item.readmore,
									desc: item.cutDescription,
									geoTag: item.state,
									icon: "lab",
									name: "COVID-19 Testing Lab",
									phone: sPhone,
									priority: 1,
									recordid: item.id.toString(),
									state: item.state,
								},
							};
							data.features.push(currItem);
						});

						var aUniqueCategories = [],
							aCategories = [],
							aSelectedKeys = [];
						var defaultItem = {
							geometry: {
								type: "Point",
								coordinates: [73.7123366, 18.5649236],
							},
							properties: {
								addr: "Mediplace Polyclinic, Thorve Vishwa, Baner - Balewadi Road, \n Pune, Maharashtra, India",
								contact: "https://dr-yashi-physio.business.site/",
								desc: "Physiotherapy Clinic - Online Consultation/treatment sessions are also available." +
									"\n" +
									"Our main motto is to treat any patient's pain with non surgical treatment and give long term relief. Exercises and therapies provided by us will going to help you to overcome any pain. ",
								geoTag: "Online / Pune / Gwalior",
								icon: "orthopedics",
								name: "Physiotherapy Clinic",
								phone: "7000304448",
								priority: 1,
								recordid: "0.1",
								state: "Online / Maharashtra / M.P.",
							},
						};
						data.features.unshift(defaultItem);
						defaultItem = {
							geometry: {
								type: "Point",
								coordinates: [77.19575, 28.66976],
							},
							properties: {
								addr: "18B, 2nd Floor, Pratap Nagar, New Delhi, India",
								contact: "https://www.facebook.com/SAI-FOODS-and-Namkeen-823322731045773",
								desc: "Please contact us for Homemade Fresh Authentic South Indian Food, Sweets and Namkeen." +
									"\n" +
									"We also take orders on phone call and deliver at your doorstep.",
								geoTag: "Online / Delhi / NCR",
								icon: "food",
								name: "Fresh Authentic South Indian Food and Namkeen",
								phone: "9999330678, 011 22755485",
								priority: 1,
								recordid: "0.1",
								state: "Online / Delhi / NCR",
							},
						};
						data.features.unshift(defaultItem);
						data.features.forEach(function (item) {
							if (!aUniqueCategories[item.properties.icon]) {
								aUniqueCategories[item.properties.icon] = true;
								aCategories.push({
									key: item.properties.icon,
									value: true,
								});
								aSelectedKeys.push(item.properties.icon);
							}
						});
						oEssentialServices = new JSONModel({
							features: data.features,
							categories: aCategories,
							selectedKeys: aSelectedKeys,
							busy: true,
						});
						oEssentialServices.setSizeLimit(data.features.length);
						this.setModel(oEssentialServices, "essentialServices");
						this._filterEssentialServices(
							this.getModel("user").getProperty("/city")
						);
					}.bind(this),
					error: function (error) {
						var aUniqueCategories = [],
							aCategories = [],
							aSelectedKeys = [],
							data = {
								features: []
							};
						var defaultItem = {
							geometry: {
								type: "Point",
								coordinates: [73.7123366, 18.5649236],
							},
							properties: {
								addr: "Mediplace Polyclinic, Thorve Vishwa, Baner - Balewadi Road, \n Pune, Maharashtra, India",
								contact: "https://dr-yashi-physio.business.site/",
								desc: "Physiotherapy Clinic - Online Consultation/treatment sessions are also available." +
									"\n" +
									"Our main motto is to treat any patient's pain with non surgical treatment and give long term relief. Exercises and therapies provided by us will going to help you to overcome any pain. ",
								geoTag: "Online",
								icon: "orthopedics",
								name: "Physiotherapy Clinic",
								phone: "7000304448",
								priority: 1,
								recordid: "0.1",
								state: "Maharashtra",
							},
						};
						data.features.unshift(defaultItem);
						defaultItem = {
							geometry: {
								type: "Point",
								coordinates: [77.19575, 28.66976],
							},
							properties: {
								addr: "18B, 2nd Floor, Pratap Nagar, New Delhi, India",
								contact: "https://www.facebook.com/SAI-FOODS-and-Namkeen-823322731045773",
								desc: "Please contact us for Homemade Fresh Authentic South Indian Food, Sweets and Namkeen." +
									"\n" +
									"We also take orders on phone call and deliver at your doorstep.",
								geoTag: "Delhi / NCR",
								icon: "food",
								name: "Fresh Authentic South Indian Food and Namkeen",
								phone: "9999330678, 011 22755485",
								priority: 1,
								recordid: "0.2",
								state: "Delhi / NCR",
							},
						};
						data.features.unshift(defaultItem);
						data.features.forEach(function (item) {
							if (!aUniqueCategories[item.properties.icon]) {
								aUniqueCategories[item.properties.icon] = true;
								aCategories.push({
									key: item.properties.icon,
									value: true,
								});
								aSelectedKeys.push(item.properties.icon);
							}
						});
						oEssentialServices = new JSONModel({
							features: data.features,
							categories: aCategories,
							selectedKeys: aSelectedKeys,
							busy: true,
						});
						oEssentialServices.setSizeLimit(data.features.length);
						this.setModel(oEssentialServices, "essentialServices");
						this._filterEssentialServices(
							this.getModel("user").getProperty("/city")
						);
					}.bind(this),
				});
			},
			handleIconUrlSet: function (oEvent) {
				var oIcon = oEvent.getSource();
				try {
					var sIconId = oEvent
						.getSource()
						.getBindingContext("essentialServices")
						.getObject().properties.icon,
						sIconUrl = formatter.formatItemIcon(sIconId);
					oIcon.setSrc(sIconUrl);
				} catch (err) {
					oIcon.setSrc("sap-icon://bbyd-dashboard");
				}
			},
			handleEssentialSearch: function (oEvent) {
				var sSearchText = oEvent.getParameter("value");
				if (!sSearchText) {
					sSearchText = oEvent.getParameter("newValue");
				}
				this._handleEssentialServices(sSearchText);
				// this._filterEssentialServices(sSearchText);
			},
			_filterEssentialServices: function (sValue) {
				var sSearchText = sValue,
					aSearchFilter = [],
					aActiveFilters = [];
				if (sSearchText && sSearchText.length > 0) {
					// aSearchFilter.push(new Filter("properties/geoTag", FilterOperator.Contains, sSearchText));
					if (
						sSearchText.indexOf("Bangalore") > -1 ||
						sSearchText.indexOf("Bengaluru") > -1
					) {
						aSearchFilter.push(
							new Filter(
								"properties/addr",
								FilterOperator.Contains,
								"Bengaluru"
							)
						);
						aSearchFilter.push(
							new Filter(
								"properties/addr",
								FilterOperator.Contains,
								"Bangalore"
							)
						);
					} else {
						aSearchFilter.push(
							new Filter(
								"properties/addr",
								FilterOperator.Contains,
								sSearchText
							)
						);
					}
					aSearchFilter.push(
						new Filter("properties/recordid", FilterOperator.Contains, "0.1")
					);
					aActiveFilters.push(new Filter(aSearchFilter, false));
				} else {
					aSearchFilter.push(
						new Filter(
							"properties/geoTag",
							FilterOperator.Contains,
							"__Shivam__Shrivastav__"
						)
					); //the filter never exists and 0 items will be returned
					aActiveFilters.push(new Filter(aSearchFilter, false));
				}
				var oBindings = this._oView.byId("gridList").getBinding("items");
				oBindings.filter(new Filter(aActiveFilters, true), "Application");
				this.getModel("essentialServices").setProperty("/busy", false);
				var currTheme = this.oComponent.getThemeId();
				var aElements = document.querySelectorAll(".customBackground"),
					i;
				if (currTheme === "sap_fiori_3_dark") {
					// $('.customBackground').addClass('customBackgroundDark');
					// for (i = 0; i < aElements.length; i++) {
					// 	aElements[i].style.backgroundColor = "transparent";
					// }
				} else {
					// $('.customBackgroundDark').addClass('customBackground');
					// for (i = 0; i < aElements.length; i++) {
					// 	aElements[i].style.backgroundColor = "#f6f6f7";
					// }
				}
			},
			handleKeySelectionFinish: function (oEvent) {
				var aKeyText = oEvent.getSource().getSelectedKeys(),
					aKeyFilter = [],
					aSearchFilter = [],
					aActiveFilters = [];
				aKeyText.forEach(function (text) {
					aKeyFilter.push(
						new Filter("properties/icon", FilterOperator.EQ, text)
					);
				});
				var invalidText = null;
				if (!aKeyFilter.length) {
					invalidText = "__1234567890__";
					aKeyFilter.push(
						new Filter("properties/icon", FilterOperator.EQ, "__1234567890__")
					); //the value never exist and 0 items will be returned
				}
				aActiveFilters.push(new Filter(aKeyFilter, false));
				var sSearchText = this._oView.byId("searchEssentialSB").getValue();
				if (sSearchText && !invalidText) {
					// aSearchFilter.push(new Filter("properties/geoTag", FilterOperator.Contains, sSearchText));
					// aSearchFilter.push(new Filter("properties/addr", FilterOperator.Contains, sSearchText));
					var aInternalFilters = [];
					aInternalFilters.push(
						new Filter("properties/addr", FilterOperator.Contains, sSearchText)
					);
					aInternalFilters.push(
						new Filter("properties/recordid", FilterOperator.Contains, "0.1")
					);
					var aANDFilters = [];
					aANDFilters.push(new Filter(aInternalFilters, false));
					aActiveFilters.push(new Filter(aANDFilters, true));
				} else {
					invalidText = "__1234567890__";
					aSearchFilter = [];
					// aSearchFilter.push(new Filter("properties/geoTag", FilterOperator.Contains, invalidText)); //the value never exist and 0 items will be returned
					aActiveFilters.push(
						new Filter(
							[
								new Filter(
									"properties/addr",
									FilterOperator.Contains,
									invalidText
								),
							],
							true
						)
					);
				}
				var oBindings = this._oView.byId("gridList").getBinding("items");
				oBindings.filter(new Filter(aActiveFilters, true), "Application");
			},
			openExternalLink: function (oEvent) {
				var oObject = oEvent
					.getSource()
					.getBindingContext("essentialServices")
					.getObject();
				sap.m.URLHelper.redirect(oObject.properties.contact, true);
			},
			onNumberPress: function (oEvent) {
				var oObject = oEvent
					.getSource()
					.getBinding("title")
					.getContext()
					.getObject();
				sap.m.URLHelper.triggerTel(oObject.key);
			},
			handleEssentialPhone: function (oEvent) {
				var sValue = oEvent.getSource().getText();
				if (sValue) {
					if (sValue.indexOf(",") > -1) {
						var oEssentialServicesModel = this.getModel("essentialServices");
						var aNumberList = sValue.split(","),
							aNumberItems = [];
						aNumberList.forEach(function (number) {
							number = number.replace(/\D/g, "");
							aNumberItems.push({
								key: number,
								value: number,
							});
						});
						oEssentialServicesModel.setProperty("/numbers", aNumberItems);
						var oControl = oEvent.getSource();
						if (!this._oTelephonePopover) {
							Fragment.load({
								name: "mymedicalhelpline.view.TelephonePopover",
								controller: this,
							}).then(
								function (oPopover) {
									this._oTelephonePopover = oPopover;
									this.attachControl(this._oTelephonePopover);
									this._oTelephonePopover.openBy(oControl);
								}.bind(this)
							);
						} else {
							this._oTelephonePopover.openBy(oControl);
						}
					} else {
						sap.m.URLHelper.triggerTel(sValue);
					}
				}
			},
			onEssentialUpdateFinished: function (oEvent) {
				var sTitle,
					oList = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
				// only update the counter if the length is final and
				// the list is not empty
				if (iTotalItems && oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("total", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("totalinit");
				}
				this.getModel("essentialServices").setProperty("/total", sTitle);
			},
			onOpenForum: function (oEvent) {
				sap.m.URLHelper.redirect("https://fightcovid-19.in/", true);
			},
			onIndiaFights: function () {
				sap.m.URLHelper.redirect(
					"https://fightcovid-19.in/india-fights-cov/",
					true
				);
			},
			onWorldFights: function () {
				sap.m.URLHelper.redirect(
					"https://fightcovid-19.in/world-fights-covid-19/",
					true
				);
			},
			onCognize: function () {
				sap.m.URLHelper.redirect("https://fightcovid-19.in/cognize/", true);
			},
			onWellness: function () {
				sap.m.URLHelper.redirect("https://fightcovid-19.in/wellness/", true);
			},
			onAskForHelp: function () {
				sap.m.URLHelper.redirect(
					"https://fightcovid-19.in/community/ask-for-help/",
					true
				);
			},
			onTalkToExperts: function () {
				sap.m.URLHelper.redirect(
					"https://fightcovid-19.in/community/get-questions-answered/",
					true
				);
			},
			onHomeIconPress: function () {
				this._oView.byId("iconTabBar").setSelectedKey("DIAGNOSIS");
			},
			onAboutUsPress: function () {
				if (!this._oAboutUsDialog) {
					this._oAboutUsDialog = sap.ui.xmlfragment(
						this._oView.getId(),
						"mymedicalhelpline.view.About",
						this
					);
					this.attachControl(this._oAboutUsDialog);
				}
				this._oAboutUsDialog.open();
				var currTheme = sap.ui.getCore().getConfiguration().getTheme();
				var aElements = document.querySelectorAll(".customBackground"),
					i;
				if (currTheme === "sap_fiori_3") {
					// $('.customBackground').addClass('customBackgroundDark');
					for (i = 0; i < aElements.length; i++) {
						aElements[i].style.backgroundColor = "#f6f6f7";
					}
				} else {
					// $('.customBackgroundDark').addClass('customBackground');
					for (i = 0; i < aElements.length; i++) {
						aElements[i].style.backgroundColor = "transparent";
					}
				}
				this._oMenu.close();
			},
			onAboutUsClose: function () {
				if (this._oAboutUsDialog) {
					this._oAboutUsDialog.close();
				}
			},
			onEmailPress: function (oEvent) {
				var email = oEvent.getSource().getText();
				sap.m.URLHelper.triggerEmail(
					email,
					"COVID-19 Healthcare Assistant Query"
				);
			},
			onEssentialHelp: function (oEvent) {
				var oControl = oEvent.getSource();
				if (!this._oHelpInfoPopover) {
					Fragment.load({
						name: "mymedicalhelpline.view.HelpInfo",
						controller: this,
					}).then(
						function (oPopover) {
							this._oHelpInfoPopover = oPopover;
							this.attachControl(this._oHelpInfoPopover);
							this._oHelpInfoPopover.openBy(oControl);
						}.bind(this)
					);
				} else {
					this._oHelpInfoPopover.openBy(oControl);
				}
			},
			onExternalLinksPress: function (oEvent) {
				var url = oEvent.getSource().getCustomData()[0].getValue();
				sap.m.URLHelper.redirect(url, true);
			},
			onTodoPress: function (oEvent) {
				sap.m.URLHelper.redirect(
					"https://www.mohfw.gov.in/pdf/Poster_Corona_ad_Eng.pdf",
					true
				);
			},
			onCasesStateChange: function (oEvent) {
				var oStateCityCasesModel = this.getModel("stateCityCasesModel");
				oStateCityCasesModel.setProperty("/busy", true);
				// this.onHelplineStateChange();
				var oDiagnosisModel = this.getModel("diagnosisView"),
					sStateKey = oDiagnosisModel.getProperty("/state_key"),
					aCases = this.getModel("figuresModel").getProperty("/cases");
				window.sessionStorage.statekey =
					window.sessionStorage.statekey !== "undefined" &&
					!!window.sessionStorage.statekey ? window.sessionStorage.statekey : "KA";
				window.sessionStorage.statekey = sStateKey ? sStateKey : window.sessionStorage.statekey;
				sStateKey = sStateKey ? sStateKey : window.sessionStorage.statekey;
				oDiagnosisModel.setProperty("/state_key", sStateKey);
				var oStateCases;
				if (Array.prototype.find) {
					aCases.find(function (item) {
						if (item[0] === sStateKey) {
							oStateCases = item;
							return true;
						} else {
							return false;
						}
					});
				} else {
					for (var i = 0; i < aCases.length; i++) {
						if (aCases[i][0] === sStateKey) {
							oStateCases = aCases[i];
							break;
						}
					}
				}
				var total,
					active,
					deceased,
					recovered,
					tested,
					lastUpdated,
					testLastUpdated;
				var newtotal, newactive, newdeceased, newrecovered, newtested;
				try {
					total = oStateCases[1].total.confirmed;
				} catch (err) {
					total = 0;
				}
				try {
					deceased = oStateCases[1].total.deceased;
				} catch (err) {
					deceased = 0;
				}
				try {
					tested = oStateCases[1].total.tested;
				} catch (err) {
					tested = 0;
				}
				try {
					recovered = oStateCases[1].total.recovered;
				} catch (err) {
					recovered = 0;
				}
				try {
					lastUpdated =
						"Last updated at: " +
						new Date(oStateCases[1].meta.last_updated).toDateString() +
						", " +
						new Date(oStateCases[1].meta.last_updated).toLocaleTimeString();
				} catch (err) {
					lastUpdated =
						"Last updated at: " +
						new Date().toDateString() +
						", " +
						new Date().toLocaleTimeString();
				}
				try {
					testLastUpdated =
						"(Till " +
						new Date(oStateCases[1].meta.tested.last_updated).toDateString() +
						")";
				} catch (err) {
					testLastUpdated = "(Till " + new Date().toDateString() + ")";
				}
				try {
					newtotal = oStateCases[1].delta.confirmed;
				} catch (err) {
					newtotal = 0;
				}
				try {
					newdeceased = oStateCases[1].delta.deceased;
				} catch (err) {
					newdeceased = 0;
				}
				try {
					newtested = oStateCases[1].delta.tested;
				} catch (err) {
					newtested = 0;
				}
				try {
					newrecovered = oStateCases[1].delta.recovered;
				} catch (err) {
					newrecovered = 0;
				}
				active = total - deceased - recovered;
				newactive = newtotal - newdeceased - newrecovered;
				var data = {
					state_key: sStateKey,
					cases: oStateCases[1],
					activeCases: active,
					totalCases: total,
					deaths: deceased,
					recovered: recovered,
					tested: tested,
					lastUpdated: lastUpdated,
					new_activeCases: newactive,
					new_totalCases: newtotal,
					new_deaths: newdeceased,
					new_recovered: newrecovered,
					new_tested: newtested,
					testLastUpdated: testLastUpdated,
					busy: false,
					cityResults: oStateCityCasesModel.getProperty("/cityResults"),
					Cities: oStateCityCasesModel.getProperty("/Cities"),
					CityCases: oStateCityCasesModel.getProperty("/CityCases"),
					hidecityresults: oStateCityCasesModel.getProperty("/hidecityresults"),
				};
				oStateCityCasesModel.setData(data);
			},
			onHelplineStateChange: function (oEvent) {
				var oDiagnosisModel = this.getModel("diagnosisView"),
					aStates = oDiagnosisModel.getProperty("/states"),
					sStateId = oDiagnosisModel.getProperty("/state_key");
				if (Array.prototype.find) {
					aStates.find(function (item) {
						if (item.key === sStateId) {
							oDiagnosisModel.setProperty("/state_key", item.key);
							oDiagnosisModel.setProperty("/state_text", item.text);
							oDiagnosisModel.setProperty("/state_phone", item.phone);
							return true;
						} else {
							return false;
						}
					});
				} else {
					for (var i = 0; i < aStates.length; i++) {
						if (aStates[i].key === sStateId) {
							oDiagnosisModel.setProperty("/state_key", aStates[i].key);
							oDiagnosisModel.setProperty("/state_text", aStates[i].text);
							oDiagnosisModel.setProperty("/state_phone", aStates[i].phone);
							break;
						}
					}
				}
			},
			onChangeTheme: function (oEvent) {
				var currTheme = sap.ui.getCore().getConfiguration().getTheme(),
					newTheme = "";
				var aElements = document.querySelectorAll(".customBackground"),
					i;
				if (currTheme === "sap_fiori_3") {
					newTheme = "sap_fiori_3_dark";
					// $('.customBackground').addClass('customBackgroundDark');
					for (i = 0; i < aElements.length; i++) {
						aElements[i].style.backgroundColor = "transparent";
					}
				} else {
					newTheme = "sap_fiori_3";
					// $('.customBackgroundDark').addClass('customBackground');
					for (i = 0; i < aElements.length; i++) {
						aElements[i].style.backgroundColor = "#f6f6f7";
					}
				}
				sap.ui.getCore().applyTheme(newTheme);
				this.oComponent.setThemeId(newTheme);
				window.sessionStorage.themeId = newTheme;
				if (newTheme === "sap_fiori_3") {
					this.getModel("diagnosisView").setProperty(
						"/themeText",
						"Switch to Dark Mode"
					);
					this.formatThemeIcon(newTheme);
				} else {
					this.getModel("diagnosisView").setProperty(
						"/themeText",
						"Switch to Light Mode"
					);
					this.formatThemeIcon(newTheme);
				}
				this._oMenu.close();
				// this._oMenu.destroy();
				// this._oMenu = null;
			},
			_handleCurrentFigures: function () {
				$.ajax({
					// url: 'https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true',
					url: "https://api.covid19india.org/v3/min/data.min.json",
					type: "GET",
					success: function (data) {
						this._findTotalIndiaTests(Object.entries(data));
						// this.getModel("figuresModel").setData(data);
					}.bind(this),
					error: function (data) {
						console.log("error in fetching current figures");
						this.getModel("figuresModel").setProperty("/busy", false);
					},
				});
			},
			formatThemeText: function (sText) {
				var currTheme = this.oComponent.getThemeId();
				this.formatThemeIcon(currTheme);
				if (sText === "Change Theme") {
					if (currTheme === "sap_fiori_3") {
						sText = "Switch to Dark Mode";
					} else {
						sText = "Switch to Light Mode";
					}
				}
				return sText;
			},
			formatThemeIcon: function (currTheme) {
				var sIconUrl;
				if (currTheme === "sap_fiori_3") {
					sIconUrl = "img/dark.png";
				} else {
					sIconUrl = "img/light.png";
				}
				sap.ui.getCore().byId("themeItem").setIcon(sIconUrl);
			},
			handleRedzones: function () {
				window.sessionStorage.containmentZonesCurrentDate = new Date().toDateString();
				var userData = this.getModel("user").getData(),
					data = {
						latitude: userData.latitude,
						longitude: userData.longitude,
						currDate: new Date().toDateString(),
					};
				// $.ajax({
				// 	type: "POST",
				// 	contentType: "application/json",
				// 	url: "/api/containmentzones",
				// 	headers: {
				// 		'Authorization': `Bearer ${window.sessionStorage.accessToken}`,
				// 	},
				// 	data: JSON.stringify(data),
				// 	dataType: "json",
				// 	success: function (result) {
				// 		this.getModel("redzonesModel").setData(result);
				// 		this.getModel("redzonesModel").setProperty("/busy", false);
				// 	}.bind(this),
				// 	error: function (error) {
				// 		console.log("error in fetching containment zones");
				// 		this.getModel("redzonesModel").setProperty("/containmentsAvailability", false);
				// 		this.getModel("redzonesModel").setProperty("/busy", false);
				// 	}.bind(this)
				// });
			},
			_handleIndiaStateCityCases: function () {
				if (!this.getModel("stateCityCasesModel")) {
					var oStateCityCasesModel = new JSONModel({
						busy: true,
						activeCases: 0,
						totalCases: 0,
						deaths: 0,
						recovered: 0,
						tested: 0,
						lastUpdated: "NA",
						new_activeCases: 0,
						new_totalCases: 0,
						new_deaths: 0,
						new_recovered: 0,
						new_tested: 0,
						testLastUpdated: "NA",
						cityResults: {},
						CityCases: {},
						hidecityresults: false,
						Cities: [],
					});
					this.setModel(oStateCityCasesModel, "stateCityCasesModel");
					this._setCityCases();
				}
				this.onCasesStateChange();
				// $.ajax({
				// 	url: 'https://api.covid19india.org/v3/min/data.min.json',
				// 	type: 'GET',
				// 	success: function (data) {
				// 		console.log("success: state-city figures fetched");
				// 		var results = {
				// 			cases: Object.entries(data),
				// 			busy: false,
				// 			confirmed: 0,
				// 			deceased: 0,
				// 			recovered: 0,
				// 			new_confirmed: 0,
				// 			new_deceased: 0,
				// 			new_recovered: 0
				// 		};
				// 		this._findTotalIndiaTests(results.cases);
				// 		this.getModel("stateCityCasesModel").setData(results);

				// 	}.bind(this),
				// 	error: function (data) {
				// 		console.log("error in fetching state-city figures");
				// 		this.getModel("stateCityCasesModel").setProperty("/busy", false);
				// 	}
				// });
			},
			_findTotalIndiaTests: function (cases) {
				var iTested = 0,
					iNewTested = 0,
					iTotal = 0,
					iActive = 0,
					iRecovered = 0,
					iDeceased = 0,
					iNewTotal = 0,
					iNewActive = 0,
					iNewRecovered = 0,
					iNewDeceased = 0,
					lastUpdated,
					testLastUpdated;
				cases.forEach(function (state) {
					if (!state[1].delta) {
						state[1].delta = {};
						state[1].delta.confirmed = 0;
						state[1].delta.deceased = 0;
						state[1].delta.recovered = 0;
						state[1].delta.tested = 0;
					}
					if (state[0] === "TT") {
						iTested = state[1].total.tested;
						iTotal = state[1].total.confirmed;
						iDeceased = state[1].total.deceased;
						iRecovered = state[1].total.recovered;
						iActive = iTotal - iDeceased - iRecovered;
						iNewTotal = state[1].delta.confirmed;
						iNewDeceased = state[1].delta.deceased;
						iNewRecovered = state[1].delta.recovered;
						iNewActive = iNewTotal - iNewDeceased - iNewRecovered;
						iNewTested = state[1].delta.tested;
						lastUpdated = new Date(state[1].meta.last_updated);
						testLastUpdated = new Date(state[1].meta.tested.last_updated);
						lastUpdated =
							"Last updated at: " +
							lastUpdated.toDateString() +
							", " +
							lastUpdated.toLocaleTimeString();
						testLastUpdated = "(Till " + testLastUpdated.toDateString() + ")";
					}
				});
				// iActive = iTotal - iDeceased - iRecovered;
				// iNewActive = iNewTotal - iNewDeceased - iNewRecovered;
				var data = {
					activeCases: iActive,
					totalCases: iTotal,
					deaths: iDeceased,
					recovered: iRecovered,
					tested: iTested,
					lastUpdated: lastUpdated,
					new_activeCases: iNewActive,
					new_totalCases: iNewTotal,
					new_deaths: iNewDeceased,
					new_recovered: iNewRecovered,
					new_tested: iNewTested,
					testLastUpdated: testLastUpdated,
					cases: cases,
					busy: false,
				};
				this.getModel("figuresModel").setData(data);
				this._handleIndiaStateCityCases();
			},
			onCityCasesChange: function (event) {
				var oItem = event.getParameter("suggestionItem"),
					oStateCityCasesModel = this.getModel("stateCityCasesModel");
				if (!oItem) {
					oItem = event.getParameter("value");
					if (!oItem) {
						oItem = event.getParameter("newValue");
					}
				} else {
					oItem = oItem.getProperty("text");
				}
				if (oItem) {
					window.sessionStorage.city = oItem;
					this.getModel("user").setProperty("/city", oItem);
					this._setCityCases(oItem);
				} else {
					var sSearchString = event.getParameter("query"),
						refreshButtonPressed = event.getParameter("refreshButtonPressed");
					if (sSearchString) {
						window.sessionStorage.city = sSearchString;
						this.getModel("user").setProperty("/city", sSearchString);
						this._setCityCases(sSearchString);
					} else {
						var results = {
							// cityName: sSearchString,
							activeCases: 0,
							totalCases: 0,
							deaths: 0,
							recovered: 0,
							new_activeCases: 0,
							new_totalCases: 0,
							new_deaths: 0,
							new_recovered: 0,
						};
						oStateCityCasesModel.setProperty("/cityResults", results);
						oStateCityCasesModel.setProperty("/hidecityresults", true);
					}
				}
			},
			_setCityCases: function (currCity) {
				var aCases = this.getModel("figuresModel").getProperty("/cases"),
					oStateCityCasesModel = this.getModel("stateCityCasesModel"),
					oCityCases = {},
					sCity = this.getModel("user").getProperty("/city"),
					aCity = [],
					oCityResult = {};
				sCity = currCity ? currCity : sCity;
				window.sessionStorage.city =
					window.sessionStorage.city !== "undefined" &&
					!!window.sessionStorage.city ? window.sessionStorage.city : "Bangalore";
				sCity = sCity ? sCity : window.sessionStorage.city;
				this.getModel("user").setProperty("/city", sCity);
				oStateCityCasesModel.setProperty("/busyCity", true);
				var isCitiesAvailable = oStateCityCasesModel.getProperty("/Cities");
				if (isCitiesAvailable) {
					isCitiesAvailable = !!isCitiesAvailable.length;
				} else {
					isCitiesAvailable = false;
				}
				if (!isCitiesAvailable) {
					aCases.forEach(function (state) {
						if (state[1].districts) {
							$.extend(true, oCityCases, state[1].districts);
						}
					});
					oCityCases["Bangalore"] = oCityCases["Bengaluru Urban"];
					aCity = Object.keys(oCityCases);
					oStateCityCasesModel.setSizeLimit(aCity.length);
					oStateCityCasesModel.setProperty("/Cities", aCity);
					oStateCityCasesModel.setProperty("/CityCases", oCityCases);
				} else {
					oCityCases = oStateCityCasesModel.getProperty("/CityCases");
				}
				var cityText = sCity;
				if (sCity) {
					oCityCases = oStateCityCasesModel.getProperty("/CityCases");
					oCityResult = oCityCases[sCity];
					if (!oCityResult && sCity.toLowerCase().search("bangalore") > -1) {
						sCity = sCity.replace("angalore", "engaluru");
					}
					cityText = sCity;
					oCityResult = oCityCases[sCity];
					if (!oCityResult) {
						for (let c in oCityCases) {
							if (c.toLowerCase().search(sCity.toLowerCase()) > -1) {
								oCityResult = oCityCases[c];
								cityText = c;
								break;
							}
						}
					}
					// oCityResult = oCityCases[sCity];
					var total,
						delta,
						totalcases = 0,
						active = 0,
						recovered = 0,
						deceased = 0,
						newtotal = 0,
						newactive = 0,
						newrecovered = 0,
						newdeceased = 0;
					if (oCityResult) {
						total = oCityResult.total;
						delta = oCityResult.delta;
						if (total) {
							totalcases = total.confirmed ? total.confirmed : 0;
							recovered = total.recovered ? total.recovered : 0;
							deceased = total.deceased ? total.deceased : 0;
							active = totalcases - recovered - deceased;
						}
						if (delta) {
							newtotal = delta.confirmed ? delta.confirmed : 0;
							newrecovered = delta.recovered ? delta.recovered : 0;
							newdeceased = delta.deceased ? delta.deceased : 0;
							newactive = newtotal - newrecovered - newdeceased;
						}
						oStateCityCasesModel.setProperty("/hidecityresults", false);
					} else {
						oStateCityCasesModel.setProperty("/hidecityresults", true);
					}
					window.sessionStorage.city = cityText;
					var results = {
						cityName: cityText,
						activeCases: active,
						totalCases: totalcases,
						deaths: deceased,
						recovered: recovered,
						new_activeCases: newactive,
						new_totalCases: newtotal,
						new_deaths: newdeceased,
						new_recovered: newrecovered,
					};
					oStateCityCasesModel.setProperty("/cityResults", results);
				} else {
					oStateCityCasesModel.setProperty("/hidecityresults", true);
				}
				oStateCityCasesModel.setProperty("/busyCity", false);
			},
			onSuggest: function (event) {
				var sValue = event.getParameter("suggestValue"),
					aFilters = [];
				if (sValue) {
					aFilters = [
						new Filter(
							[
								new Filter("", function (sText) {
									return (
										(sText || "").toUpperCase().indexOf(sValue.toUpperCase()) >
										-1
									);
								}),
							],
							false
						),
					];
				}

				event.getSource().getBinding("suggestionItems").filter(aFilters);
				event.getSource().suggest();
			},
			handleRefresh: function (oEvent) {
				this._onRouteMatched();
				this._oView.byId("pullToRefresh").hide();
			},
			_handleContainmentCitiesFetch: function () {
				var data = {
					latitude: latitude,
					longitude: longitude,
				};
				var sCitySelected =
					window.sessionStorage.contCity !== "undefined" &&
					!!window.sessionStorage.contCity ? window.sessionStorage.contCity : window.sessionStorage.city;
				this.getModel("redzonesModel").setProperty(
					"/citySelected",
					sCitySelected ? sCitySelected : "Bangalore"
				);
				this.onCityZoneChanged();
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/containmentcities",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(data),
					dataType: "json",
					success: function (results) {
						this.getModel("redzonesModel").setProperty(
							"/cities",
							results.cities
						);
						this.getModel("redzonesModel").setProperty("/busy", false);
						try {
							results.cities.forEach(function (city) {
								if (city.city.toLowerCase().indexOf("bengaluru") > -1) {
									city.city = "Bangalore";
								}
							});
							this.getModel("redzonesModel").setProperty(
								"/citySelected",
								window.sessionStorage.contCity
							);
						} catch (err) {
							//error occured
						}

						// console.log("cities fetched");
					}.bind(this),
					error: function (error) {
						// console.log("error");
						this.getModel("redzonesModel").setProperty("/busy", false);
					}.bind(this),
				});
			},
			onCityZoneChanged: function (oEvent) {
				var sCitySelected = this.getModel("redzonesModel").getProperty(
					"/citySelected"
				);
				this.getModel("redzonesModel").setProperty("/busy", true);
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/containmentresults",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify({
						city: sCitySelected,
					}),
					dataType: "json",
					success: function (results) {
						try {
							var splitedText;
							results.cityResults.forEach(function (result) {
								// splitedText = result.name.split(") ");
								// if (!splitedText[1]) {
								//   splitedText = result.name.split(")");
								// }
								// result.name = splitedText[1] ? splitedText[1] : splitedText[0];
								result.name = result.city ? result.street + ", " + result.city : result.street;
							});
						} catch (err) {
							results.cityResults = [];
						}
						this.getModel("redzonesModel").setProperty(
							"/cityResults",
							results.cityResults
						);
						jQuery.sap.delayedCall(500, this, function () {
							this.handleLocalitySearch();
						});
						this.getModel("redzonesModel").setProperty("/busy", false);
					}.bind(this),
					error: function (error) {
						console.log("error in fetching containment zones");
						this.getModel("redzonesModel").setProperty("/cityResults", []);
						this.getModel("redzonesModel").setProperty("/busy", false);
					}.bind(this),
				});
			},
			handleLocalitySearch: function (oEvent) {
				if (oEvent) {
					var sSearchText = oEvent.getParameter("value");
					if (!sSearchText) {
						sSearchText = oEvent.getParameter("newValue");
					}
				} else {
					sSearchText =
						window.sessionStorage.contArea !== "undefined" &&
						!!window.sessionStorage.contArea ? window.sessionStorage.contArea : "";
					this.getModel("redzonesModel").setProperty("/locality", sSearchText);
				}
				window.sessionStorage.contArea = sSearchText;
				var aSearchFilter = [],
					aActiveFilters = [];
				if (sSearchText && sSearchText.length > 0) {
					// aSearchFilter.push(new Filter("properties/geoTag", FilterOperator.Contains, sSearchText));
					aSearchFilter.push(
						new Filter("name", FilterOperator.Contains, sSearchText)
					);
					aActiveFilters.push(new Filter(aSearchFilter, false));
				} else {
					aActiveFilters = [];
				}
				var oList;
				if (this.getModel("diagnosisView").getProperty("/showResults")) {
					oList = this._oView.byId("redList2");
				} else {
					oList = this._oView.byId("redList1");
				}
				var oBindings = oList.getBinding("items");
				// oBindings.filter(new Filter(aActiveFilters, true), "Application");
				oBindings.filter(aSearchFilter);
			},
			redzonesUpdateFinished: function (oEvent) {
				// if(!this._oRedZonesList){
				// 	this._oRedZonesList = oEvent.getSource();
				// }
				// if (this._oRedZonesList.getItems().length) {
				// }
				var iTotalItems = oEvent.getParameter("total"),
					sHeaderText =
					iTotalItems === 0 ? "0 results" : iTotalItems + " Containment zones found";
				// oEvent.getSource().setHeaderText(sHeaderText);
				this.getModel("redzonesModel").setProperty(
					"/listHeaderText",
					sHeaderText
				);
			},
			hanldeUploadResultOpen: function (oEvent) {
				if (!this._oUploadDialog) {
					this._oUploadDialog = sap.ui.xmlfragment(
						this._oView.getId(),
						"mymedicalhelpline.view.UploadResult",
						this
					);
					this.attachControl(this._oUploadDialog);
				}
				this._oUploadDialog.open();
			},
			handleUploadCancel: function () {
				this._oUploadDialog.close();
			},
			handleUploadResults: function (oEvent) {
				var oFileUploader = this._oView.byId("fileUploader"),
					oFile = oFileUploader.oFileUpload.files[0];
				if (oFile) {
					this._oUploadDialog.setBusy(true);
					var formData = new FormData(),
						currTime = Date.now().toString(),
						mobile_no = this.getModel("user").getProperty("/mobile_no");

					var oRadioButton = this._oView.byId("positive"),
						sResult = oRadioButton.getSelected() ? "POSITIVE" : "NEGATIVE";
					this.getModel("user").setProperty("/result", sResult);
					// formData.append("fname", "Shivam");
					// formData.append("lname", "Shrivastav");
					// formData.append("utime", Date.now().toString());
					formData.append("fileToUpload", oFile, oFile.name);
					formData.append("mobile_no", mobile_no);
					formData.append("ctime", currTime);
					formData.append("utime", currTime);
					formData.append("result", sResult);
					var params = {
						url: "/api/upload_file",
						timeout: 0,
						headers: {
							Authorization: `Bearer ${window.sessionStorage.accessToken}`,
						},
						processData: false,
						method: "POST",
						mimeType: "multipart/form-data",
						contentType: false,
						data: formData,
					};

					$.ajax(params).done(
						function (response, success) {
							this._oUploadDialog.setBusy(false);
							if (success === "success") {
								oFileUploader.setValue(null);
								MessageToast.show("Report uploaded successfully");
							}
							this._oUploadDialog.close();
						}.bind(this)
					);
				} else {
					this._oUploadDialog.setBusy(false);
					MessageToast.show("Please choose a file to upload");
				}
			},
			handleSendSMS: function (oEvent) {
				//send sms notification
				var data = {
					mobile_no: oEvent
						.getSource()
						.getBindingContext("adminModel")
						.getObject().mobile_no,
				};
				return;
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/sendnotification",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						//success
						oEvent.getSource().setType(sap.m.ButtonType.Success);
						MessageToast.show("User notified to take test and upload results");
					}.bind(this),
					error: function (error) {
						// this._handleUnauthorizedAccess(error);
						MessageToast.show("Please retry");
					}.bind(this),
				});
			},
			handleDownloadReport: function (oEvent) {
				var oObject = oEvent
					.getSource()
					.getBindingContext("adminModel")
					.getObject();
				sap.m.URLHelper.redirect(oObject.file_url, true);
			},
			handleTestResultConfirm: function (oEvent) {
				var oObject = oEvent
					.getSource()
					.getBindingContext("adminModel")
					.getObject(),
					data = {
						mobile_no: oObject.mobile_no,
						covid_result: oEvent.getParameter("selected") ? "POSITIVE" : "NEGATIVE",
					};
				this.getModel("adminModel").setProperty(
					oEvent.getSource().getBindingContext("adminModel").getPath() +
					"/result",
					data.covid_result === "POSITIVE" ? true : false
				);
				this.getModel("adminModel").setProperty(
					oEvent.getSource().getBindingContext("adminModel").getPath() +
					"/covid_result",
					data.covid_result
				);
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "/api/confirmreport",
					headers: {
						Authorization: `Bearer ${window.sessionStorage.accessToken}`,
					},
					data: JSON.stringify(data),
					dataType: "json",
					success: function (result) {
						//success
						MessageToast.show(
							"COVID19 test report result updated successfully"
						);
					}.bind(this),
					error: function (error) {
						// this._handleUnauthorizedAccess(error);
						MessageToast.show("Please retry");
					}.bind(this),
				});
			},
			handleOpenGmaps: function (oEvent) {
				var sGmapsUrl = "https://www.google.com/maps/place/";
				if (
					oEvent.getSource().getMetadata().getName() ===
					"sap.m.StandardListItem"
				) {
					sGmapsUrl += oEvent
						.getSource()
						.getBindingContext("redzonesModel")
						.getObject().name;
				} else {
					sGmapsUrl += oEvent.getSource().getText();
				}
				sap.m.URLHelper.redirect(sGmapsUrl, true);
			},
			onIndiaAnalytics: function () {
				var oSideContent = this._oView.byId("DynamicSideContent"),
					oFragment = sap.ui.xmlfragment(
						this._oView.getId(),
						"mymedicalhelpline.view.AnalyticsIndia",
						this
					);
				if (oSideContent) {
					if (this.getModel("device").getProperty("/system/phone")) {
						oSideContent.toggle();
					}
					this._oView.byId("vboxtabadim").setBusy(true);
					// oSideContent.setBusy(true);
					oSideContent.removeAllMainContent();
					oSideContent.insertMainContent(oFragment);
					jQuery.sap.delayedCall(2000, this, function () {
						this._oView.byId("vboxtabadim").setBusy(false);
					});
				}
			},
			onWorldAnalytics: function () {
				var oSideContent = this._oView.byId("DynamicSideContent"),
					oFragment = sap.ui.xmlfragment(
						this._oView.getId(),
						"mymedicalhelpline.view.Analytics",
						this
					);
				if (oSideContent) {
					if (this.getModel("device").getProperty("/system/phone")) {
						oSideContent.toggle();
					}
					this._oView.byId("vboxtabadim").setBusy(true);
					// oSideContent.setBusy(true);
					oSideContent.removeAllMainContent();
					oSideContent.insertMainContent(oFragment);
					jQuery.sap.delayedCall(2000, this, function () {
						this._oView.byId("vboxtabadim").setBusy(false);
					});
				}
			},
			onAdminTraces: function (oEvent) {
				var oSideContent = this._oView.byId("DynamicSideContent"),
					oFragment = sap.ui.xmlfragment(
						this._oView.getId(),
						"mymedicalhelpline.view.ContactTracesPublic",
						this
					);
				if (oSideContent) {
					if (this.getModel("device").getProperty("/system/phone")) {
						oSideContent.toggle();
					}
					this._oView.byId("vboxtabadim").setBusy(true);
					// oSideContent.setBusy(true);
					oSideContent.removeAllMainContent();
					oSideContent.insertMainContent(oFragment);
					jQuery.sap.delayedCall(2000, this, function () {
						this._oView.byId("vboxtabadim").setBusy(false);
					});
				}

			},
			onContentToggle: function (oEvent) {
				var oSideContent = this._oView.byId("DynamicSideContent");
				oSideContent.toggle();
			}
		});
	}
);