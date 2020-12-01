"use strict";
var request = require("request");
exports.Validate = function (req, res, next) {
  var token = req.headers["authorization"];
  token = token.split("Bearer ")[1];
  var options = {
    method: "GET",
    url:
      "https://covid19healthcareassistant.auth.ap-south-1.amazoncognito.com/oauth2/userInfo",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    // console.log(response.body);
    if (error) {
      console.log(error);
      res.sendStatus(401);
    } else {
      res.locals.user = JSON.parse(response.body); //could be used in api_routes
      next();
    }
  });
};
