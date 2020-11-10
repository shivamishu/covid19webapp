const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
let awsConfig = {
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  accessKeyId: process.env.AWS_API_ID,
  secretAccessKey: process.env.AWS_API_KEY,
};
AWS.config.update(awsConfig);
exports.contacttraces = async function (req, res) {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
  });
};
