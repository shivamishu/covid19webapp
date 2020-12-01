const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
var con = require("./dbConnection.js");

function performDatabaseOperations(req, res, sql_query, modeText, token) {
  if (con.state === "connected" || con.state === "authenticated") {
    _performDBOperation(req, res, sql_query, modeText, null, token);
  } else {
    // con.connect(function (err) {
    _performDBOperation(req, res, sql_query, modeText, null, token);
    // });
  }
}
function _performDBOperation(req, res, sql_query, modeText, err, token) {
  if (err) {
    // con.end();
    console.error("Database connection failed: " + err.stack);
    con.destroy();
    // res.status(400).send(err);
    // return;
    con = require("./dbConnection.js");
  }
  // console.log("Connected to database.");
  con.query(sql_query, function (err, result, fields) {
    if (err) {
      // con.end();
      console.error(err.stack);
      res.send(err);
    } else {
      switch (modeText) {
        case "contactaddress":
          res.send({
            code: 200,
            success: "Contact saved successfully.",
          });
          break;
        case "contacttracelist":
          res.send({
            status: 200,
            success: "Contact Traces results successfully fetched",
            contacts: result,
          });
          break;
        case "confirmreport":
          res.send({
            status: 200,
            success: "Covid 19 result updated successfully",
          });
          break;
        default:
          msg = "default success";
          break;
      }
      // con.end();
    }
    // con.end();
  });
}

exports.contacttraces = async function (req, res) {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        var aInputArray = req.body,
          aRequestArray = [],
          bIsUnauthorized = false;
        console.log(JSON.stringify(aInputArray));
        console.log(JSON.stringify(aRequestArray));
        var params = {
          RequestItems: {
            contacttraces: aRequestArray,
          },
        };
        var values = "",
          updated_on = new Date().toString();
        aInputArray.forEach((item, i) => {
          if (item.mobile_no != authData.user.mobile_no) {
            bIsUnauthorized = true;
            throw "Unauthorized access!";
          }
          values += `('${item.mobile_no.toString()}', '${item.contact_number.toString()}', '${
            item.contact_name
          }', '${item.contact_address}', '${updated_on}')`;
          if (i < aInputArray.length - 1) {
            values += ", ";
          }
        });
        const insert_query = `INSERT INTO sys.contacttraces (mobile_no, contact_number, contact_name, contact_address, updated_on) VALUES${values}`;
        performDatabaseOperations(
          req,
          res,
          insert_query,
          "contactaddress",
          null
        );
      } catch (error) {
        console.log("error caught " + JSON.stringify(error, null, 2));
        res.send({
          code: 400,
          failed: "An error occured.",
        });
      }
    }
  });
};
exports.contacttracelist = async function (req, res) {
  const city = res.locals.user.address;
  // const read_query = `SELECT DISTINCT U.street, U.city FROM sys.users AS U WHERE city LIKE '%${city}%' AND status_id <> 'LOW' UNION SELECT DISTINCT C.contact_address, C.contact_city FROM sys.contacttraces AS C WHERE contact_address LIKE '%${city}%'`;
  const read_query = `SELECT distinct S.fname, S.lname, S.street, S.city, S.mobile_no, S.file_url, S.covid_result
  FROM   sys.users AS S WHERE city LIKE '%${city}%' AND status_id <> 'LOW' UNION SELECT distinct C.contact_name, null, C.contact_address, C.contact_city, C.contact_number, null, null FROM   sys.contacttraces AS C WHERE contact_address LIKE '%${city}%';`;
  performDatabaseOperations(req, res, read_query, "contacttracelist", null);
};
exports.sendnotification = async function (req, res) {
  let awsConfig = {
      region: "us-east-1",
      accessKeyId: process.env.AWS_API_ID,
      secretAccessKey: process.env.AWS_API_KEY,
    },
    mobile_no = "+91" + req.body.mobile_no;
  AWS.config.update(awsConfig);
  var params = {
    Message: "Please take COVID19 Test and upload report and result",
    PhoneNumber: "+917676025010", //mobile_no
    MessageAttributes: {
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };
  var sendSMSPromise = new AWS.SNS({
    apiVersion: "2010-03-31",
    endpoint: "http://sns.us-east-1.amazonaws.com",
    region: "us-east-1",
  })
    .publish(params)
    .promise();

  sendSMSPromise
    .then(function (data) {
      console.log(JSON.stringify({ MessageID: data.MessageId }));
      res.send({ status: 200, success: "Message Sent" });
    })
    .catch(function (err) {
      console.log(JSON.stringify(err));
      res.send({ status: 400, success: "Error Occured" });
    });
};


exports.confirmreport = async function (req, res) {
  const mobile_no = req.body.mobile_no;
  const covid_result = req.body.covid_result;
  const update_query = `UPDATE sys.users SET covid_result = '${covid_result}' WHERE mobile_no = '${mobile_no}'`;
  performDatabaseOperations(req, res, update_query, "confirmreport", null);
};
