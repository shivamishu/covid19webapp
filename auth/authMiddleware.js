"use strict";
var request = require("request");
// var AWS = require("aws-sdk");
// let awsConfig = {
//   region: process.env.AWS_REGION,
//   accessKeyId: process.env.AWS_API_ID,
//   secretAccessKey: process.env.AWS_API_KEY,
// };
// AWS.config.update(awsConfig);
// var jwt = require("jsonwebtoken");
// var jwkToPem = require("jwk-to-pem");
// // https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_N9hAhJwQB/.well-known/jwks.json
// var jwk = {
//   keys: [
//     {
//       alg: "RS256",
//       e: "AQAB",
//       kid: "u6fXulKina3KLxRMvE++QGr44vfMRjtDM51lo6UTanw=",
//       kty: "RSA",
//       n:
//         "m7wegfFe797nuF....",
//       use: "sig",
//     },
//     {
//       alg: "RS256",
//       e: "AQAB",
//       kid: "jqzWgdB4ROeiyG1aVLVxQ1g1RriKTSq0CR8cOx1CgDI=",
//       kty: "RSA",
//       n:
//         "heEBxa...",
//       use: "sig",
//     },
//   ],
// };
// var pem = jwkToPem(jwk.keys[1]);
// const CognitoExpress = require("cognito-express");
// const cognitoExpress = new CognitoExpress({
//   region: process.env.AWS_REGION,
//   cognitoUserPoolId: process.env.AWS_POOL_ID,
//   tokenUse: "access", //Possible Values: access | id
//   tokenExpiration: 3600, //Up to default expiration of 1 hour (3600000 ms)
// });
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
  //   jwt.verify(token, pem, { algorithms: ["RS256"] }, function (
  //     err,
  //     decodedToken
  //   ) {});
  //   var params = {
  //     AccessToken: token,
  //   };
  //   var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

  //   cognitoidentityserviceprovider.getUser(params, function (err, data) {
  //     if (err) {
  //       console.log(err, err.stack);
  //     } // an error occurred
  //     else {
  //       console.log(data);
  //     } // successful response
  //   });

  // cognitoExpress.validate(token, function (err, response) {
  //   if (err) {
  //     res.sendStatus(401);
  //   } else {
  //     //authenticated;
  //     next();
  //   }
  // });
  //   var params = {
  //     AccessToken: token,
  //   };
  //   var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
  //   try {
  //     cognitoIdentityServiceProvider.getUser(params, function (err, data) {
  //       if (err) {
  //         console.log(err, err.stack);
  //         res.sendStatus(401);
  //       } // an error occurred
  //       else {
  //         // console.log(data);
  //         res.locals.user = data; //could be used in api_routes
  //         next();
  //       }
  //     });
  //   } catch (err) {
  //     res.sendStatus(401);
  //   }
};
