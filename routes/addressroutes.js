const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
var fs = require("fs");
var con = require("./dbConnection.js");
// var dbOperations = require("./dbOperations.js");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_API_ID,
  secretAccessKey: process.env.AWS_API_KEY,
  region: "ap-southeast-1",
  s3BucketEndpoint: true,
  endpoint: "https://" + process.env.AWS_S3_BUCKET + ".s3.amazonaws.com",
});
var request = require("request");
function performDatabaseOperations(req, res, sql_query, modeText, token) {
  if (con.state === "connected" || con.state === "authenticated") {
    _performDBOperation(req, res, sql_query, modeText, null, token);
  } else {
    con.connect(function (err) {
      _performDBOperation(req, res, sql_query, modeText, err, token);
    });
  }
}
function _performDBOperation(req, res, sql_query, modeText, err, token) {
  if (err) {
    // con.end();
    console.error("Database connection failed: " + err.stack);
    con.end();
    // res.status(400).send(err);
    // return;
  }
  // console.log("Connected to database.");
  con.query(sql_query, function (err, result, fields) {
    if (err) {
      // con.end();
      console.error(err.stack);
      res.send(err);
    } else {
      let msg = "";
      switch (modeText) {
        case "setaddress":
          res.send({
            code: 200,
            success: "Address saved successfully.",
            token: token,
          });
          break;
        case "read":
          // msg = JSON.stringify(result);
          msg = result;
          res
            .status(200)
            .send({ items: msg, name: fname + " " + lname, user_id: user_id });
          break;
        case "deleted":
          msg = `File ${fileName} ${modeText} successfully.`;
          res.sendStatus(200);
          break;
        default:
          msg = "default success";
          break;
      }
      // con.end();
    }
    con.end();
  });
}
exports.setaddress = async function (req, res) {
  // jwt.verify(req.token, 'secretkey', (err, authData) => {
  const user = {
    mobile_no: req.body.mobile_no,
    age: req.body.age,
    sex: req.body.sex,
  };
  jwt.sign(
    {
      user,
    },
    "secretkey",
    {
      expiresIn: "365d",
    },
    (err, token) => {
      if (err) {
        res.sendStatus(403);
      } else {
        //    verfied
        const new_update = new Date().toString();
        const insert_query = `INSERT INTO sys.users (mobile_no, street, city, state_id, country, latitude, longitude, location_updated_on, address_updated_on, fname, lname, sex, age, updated_on) VALUES(${req.body.mobile_no}, '${req.body.street}', '${req.body.city}', '${req.body.state_id}', '${req.body.country}', ${req.body.latitude}, ${req.body.longitude}, '${new_update}', '${new_update}', '${req.body.fname}', '${req.body.lname}', ${req.body.sex}, ${req.body.age}, '${new_update}') ON DUPLICATE KEY UPDATE street = '${req.body.street}', city = '${req.body.city}', state_id = '${req.body.state_id}', country = '${req.body.country}', latitude = ${req.body.latitude}, longitude = ${req.body.longitude}, location_updated_on = '${new_update}', address_updated_on = '${new_update}', fname = '${req.body.fname}', lname = '${req.body.lname}', sex = ${req.body.sex}, age = ${req.body.age}, updated_on = '${new_update}'`;
        performDatabaseOperations(req, res, insert_query, "setaddress", token);
      }
    }
  );
};
exports.setlocation = async function (req, res) {
  const new_update = new Date().toString();
  const update_query = `UPDATE users SET latitude = ${req.body.latitude}, longitude = ${req.body.longitude}, location_updated_on = '${new_update}' WHERE mobile_no = ${req.body.mobile_no}`;
  performDatabaseOperations(req, res, update_query, "setaddress", token);

  // }
  //   });
};
exports.containmentzones = async function (req, res) {
  //get containment zones
};
exports.containmentcities = async function (req, res) {
  //get cities for containment zones
};
exports.containmentresults = async function (req, res) {
  //get containment zone results
};
// Upload test result file to s3 Bucket
exports.upload_file = async function (req, res) {
  var oUserDetails = req.body,
    mobile_no = parseInt(oUserDetails.mobile_no),
    ctime = oUserDetails.ctime,
    utime = oUserDetails.utime,
    result = oUserDetails.result;
  // console.log("Uploading a file to S3 Bucket");
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  const inputFile = req.files.fileToUpload;
  if (!inputFile) {
    return res.status(400).send("No files were uploaded.");
  }

  let fileName = utime.split("").reverse().join("") + "-" + inputFile.name; //new unique file name
  const fileContent = fs.readFileSync(inputFile.tempFilePath);
  const mimeType = inputFile.mimetype;
  const fileSize = inputFile.size;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: fileName,
    ContentType: inputFile.mimetype,
    Body: fileContent,
  };

  s3.upload(params, function (err, data) {
    if (err) {
      res.status(400).send(err);
      return;
    }
    let a = data.Location.split("/");
    let urlFileName = a[a.length - 1];
    const url = `${process.env.AWS_CLOUD_FRONT}${urlFileName}`;
    const update_query = `UPDATE sys.users SET file_url = '${url}', file_updated_on = '${ctime}', covid_result = '${result}' WHERE mobile_no = ${mobile_no}`;
    performDatabaseOperations(req, res, update_query, "fileupdated", null);
  });
};

exports.containmentlocation = async function (req, res) {
  //new containment zones location details
};
