sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("mymedicalhelpline.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/**
		 * Utility method to attach a control, typically a dialog,
		 * to the view, and syncing the styleclass of the application
		 * @param {sap.ui.core.Control} oControl the control to be attached
		 * @public
		 */
		attachControl: function (oControl) {
			var sCompactCozyClass = this.getOwnerComponent().getContentDensityClass();
			jQuery.sap.syncStyleClass(sCompactCozyClass, this.getView(), oControl);
			this.getView().addDependent(oControl);
		},
		_onChecks: function (oForm, oModel, bCheckRequired, sMode) {
			if (sMode === "TOKEN") {
				return false;
			}
			var sError = false;

			oForm.forEach(function (Field) {
				if (typeof Field.getValue === "function") {

					if ((!Field.getValue() || Field.getValue().length < 1) && Field.getVisible()) {
						if (!bCheckRequired) {
							Field.setValueState("Error");
							sError = true;
							oModel.setProperty("/errorMsg", "Please fill all the fields to proceed.");
							oModel.setProperty("/isError", true);
						} else {
							if (Field.getRequired()) {
								Field.setValueState("Error");
								sError = true;
								oModel.setProperty("/errorMsg", "Please fill all the fields to proceed.");
								oModel.setProperty("/isError", true);
							} else {
								Field.setValueState("None");
							}
						}
					}
					else {
						Field.setValueState("None");
					}
				}

			}, this);
			return sError;

		}

	});

});