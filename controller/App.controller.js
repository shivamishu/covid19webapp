sap.ui.define([
	"mymedicalhelpline/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel, CommonModelManager) {
	"use strict";

	return BaseController.extend("hcm.fab.myleaverequest.controller.App", {

		onInit: function () {
			// delete window.sessionStorage.accessToken;
			// var oViewModel,
			// 	fnSetAppNotBusy,
			// 	iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			// oViewModel = new JSONModel({
			// 	busy: true,
			// 	delay: 0
			// });
			// this.setModel(oViewModel, "appView");

			// fnSetAppNotBusy = function () {
			// 	oViewModel.setProperty("/busy", false);
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// };

			// this.getOwnerComponent().getModel().metadataLoaded().
			// then(fnSetAppNotBusy);

			// // apply content density mode to root view
			// this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		// onAfterRendering: function () {
		// 	// this.getView().byId("idAppControl").setBusy(false);
		// 	$("#splash-screen").remove();
		// },

		onExit: function () {
			// exit
			// delete window.sessionStorage.accessToken;
		}
	});

});