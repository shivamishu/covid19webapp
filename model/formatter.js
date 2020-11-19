sap.ui.define([], function () {
  "use strict";

  return {
    formatSignupName: function (showSignUp) {
      var sTextId = showSignUp ? "signup" : "signin";
      return this.getResourceBundle().getText(sTextId);
    },
    formatAlreadyMemberpName: function (showSignUp) {
      var sTextId = showSignUp ? "alreadyMember" : "newMember";
      return this.getResourceBundle().getText(sTextId);
    },
    formatCityName: function (address) {
      if (address) {
        var sCity = address.split(",")[1];
      }
      return sCity ? sCity : address;
    },
    formatItemIcon: function (icon) {
      // var icon;
      switch (icon) {
        case "ambulance":
          icon = "sap-icon://accidental-leave";
          break;
        case "delivery":
          icon = "sap-icon://shipping-status";
          break;
        case "fire":
          icon = "sap-icon://SAP-icons-TNT/firewall";
          break;
        case "food":
          icon = "sap-icon://meal";
          break;
        case "fund":
          icon = "sap-icon://waiver";
          break;
        case "helpline":
          icon = "sap-icon://headset";
          break;
        case "homes":
          icon = "sap-icon://addresses";
          break;
        case "hospital":
        case "orthopedics":
          icon = "sap-icon://doctor";
          break;
        case "kitchen":
          icon = "sap-icon://eam-work-order";
          break;
        case "lab":
          icon = "sap-icon://lab";
          break;
        case "other":
        case "unknown":
          icon = "sap-icon://multi-select";
          break;
        case "police":
          icon = "sap-icon://alert";
          break;
        case "quarantine":
          icon = "sap-icon://shield";
          break;
        case "seniors":
          icon = "sap-icon://family-protection";
          break;
        case "transport":
          icon = "sap-icon://bus-public-transport";
          break;
        case "wellbeing":
          icon = "sap-icon://e-care";
          break;
        default:
          icon = "sap-icon://bbyd-dashboard";
          break;
      }
      return icon;
    },
    formatIconText: function (icon) {
      var name = icon.charAt(0).toUpperCase() + icon.slice(1);
      return name;
    },
    formatGridBoxWidth: function (system) {
      if (system.phone) {
        return "100%";
      } else if (system.desktop) {
        return "28rem";
      } else {
        return "22.5rem";
      }
    },
    formatPercentage: function (numerator, denomenator) {
      if (denomenator === 0) {
        return 100;
      }
      return (numerator / denomenator) * 100;
    },
    formatDateString: function (sDateString) {
      var sDate = new Date(sDateString);
      return (
        "Last updated at: " +
        sDate.toDateString() +
        ", " +
        sDate.toLocaleTimeString()
      );
    },
    formatZoneSearchText: function (iNumber) {
      var sText =
        (iNumber === 0 ? "No" : iNumber) +
        " Containment or Hotspot Zones found within 5 Kilometers radius";
      return sText;
    },
    formatZoneSearchNumber: function (resultsArray) {
      var sText,
        iNumber = resultsArray.length;
      if (iNumber === 0) {
        sText = "0 Results";
      } else {
        sText = iNumber + " Containment areas found";
      }
      return sText;
    },
    formatNumbers: function (iNumber) {
      iNumber = iNumber ? iNumber : 0;
      return iNumber.toLocaleString("hi");
    },
    formatActiveCases: function (oObject) {
      if (!oObject) {
        return "0";
      } else {
        if (!oObject.confirmed) {
          oObject.confirmed = 0;
        }
        if (!oObject.deceased) {
          oObject.deceased = 0;
        }
        if (!oObject.recovered) {
          oObject.recovered = 0;
        }
      }
      var sActive = oObject.confirmed - oObject.deceased - oObject.recovered;
      sActive = sActive.toLocaleString("hi");
      return sActive;
    },
    formatNewActiveCases: function (oObject) {
      if (!oObject) {
        return "0";
      } else {
        if (!oObject.new_confirmed) {
          oObject.new_confirmed = 0;
        }
        if (!oObject.new_deceased) {
          oObject.new_deceased = 0;
        }
        if (!oObject.new_recovered) {
          oObject.new_recovered = 0;
        }
      }
      var sActive =
        oObject.new_confirmed - oObject.new_deceased - oObject.new_recovered;
      sActive = sActive.toLocaleString("hi");
      return sActive;
    },
  };
});
