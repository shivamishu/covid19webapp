
const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
var con = require("./dbConnection.js");
function performDatabaseOperations(req, res, sql_query, modeText, status) {
  if (con.state === "connected" || con.state === "authenticated") {
    _performDBOperation(req, res, sql_query, modeText, null, status);
  } else {
    // con = require("./dbConnection.js");
    // con.connect(function (err) {
    _performDBOperation(req, res, sql_query, modeText, null, status);
    // });
  }
}
function _performDBOperation(req, res, sql_query, modeText, err, status) {
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
      //   con.end();
      console.error(err.stack);
      res.send(err);
    } else {
      switch (modeText) {
        case "setsymptoms":
          //   con.end();
          res.send({
            code: 200,
            success: "Risk assessment completed sucessfully.",
            status: status,
          });
          break;
        case "setstatus":
          // status set
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
exports.symptoms = async function (req, res) {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      if (req.body.mobile_no != authData.user.mobile_no) {
        res.send({
          code: 403,
          failed: "Unauthorized access!",
        });
        return;
      }
      console.log(JSON.stringify(req.body));
      var input = {
        mobile_no: req.body.mobile_no,
        normal: !!req.body.normal,
        fever: !!req.body.fever,
        high: !!req.body.high,

        drycough: !!req.body.drycough,
        sneeze: !!req.body.sneeze,
        sore: !!req.body.sore,
        weakness: !!req.weakness,
        noQ2: !!req.body.noQ2,

        severecough: !!req.body.severecough,
        breathless: !!req.body.breathless,
        diffbreathing: !!req.body.diffbreathing,
        drowsy: !!req.body.drowsy,
        chestpain: !!req.body.chestpain,
        severeweakness: !!req.body.severeweakness,
        noQ3: !!req.body.noQ3,

        travel: !!req.body.travel,
        contact: !!req.body.contact,
        hotspotarea: !!req.body.hotspotarea,
        closecontact: !!req.body.closecontact,
        noQ4: !!req.body.noQ4,

        diabetes: !!req.body.diabetes,
        hbp: !!req.body.hbp,
        heart: !!req.body.heart,
        kidney: !!req.body.kidney,
        lung: !!req.body.lung,
        stroke: !!req.body.stroke,
        immunity: !!req.body.immunity,
        noQ5: !!req.body.noQ5,

        improved: !!req.body.improved,
        nochange: !!req.body.nochange,
        worse: !!req.body.worse,
        worst: !!req.body.worst,

        status: "",

        created_by: "clientUser",
        created_on: new Date().toString(),
        updated_by: "clientUser",
        updated_on: new Date().toString(),
      };
      // console.log(input)
      var symptomChecker = function (input) {
        try {
          let HIGH = 0,
            MEDIUM = 0,
            LOW = 0;
          if (input.fever || input.high) {
            MEDIUM++;
          } else {
            LOW++;
          }

          if (input.drycough || input.sore || input.weakness) {
            MEDIUM++;
            if (input.drycough) {
              MEDIUM++;
            }
          } else {
            LOW++;
          }

          if (
            input.severecough ||
            input.breathless ||
            input.diffbreathing ||
            input.chestpain ||
            input.severeweakness
          ) {
            HIGH++;
            if (input.fever || input.high) {
              HIGH++;
              MEDIUM++;
            } else {
              MEDIUM++;
            }
          } else {
            LOW++;
          }

          if (input.contact || input.closecontact) {
            HIGH++;
            MEDIUM++;
          } else if (HIGH > 1 && (input.hotspotarea || input.travel)) {
            HIGH++;
          } else if (input.hotspotarea || input.travel) {
            MEDIUM++;
          } else {
            LOW++;
          }

          if (input.heart || input.lung || input.stroke || input.kidney) {
            HIGH++;
            MEDIUM++;
          } else if (
            HIGH > 1 &&
            (input.hbp || input.diabetes || input.immunity)
          ) {
            HIGH++;
          } else if (input.diabetes || input.hbp) {
            MEDIUM++;
          } else {
            LOW++;
          }

          if ((input.improved || input.nochange) && HIGH === 2) {
            MEDIUM++;
          } else if ((HIGH > 1 && (input.worse || input.worst)) || HIGH > 2) {
            HIGH++;
            MEDIUM++;
            if (input.worst) {
              HIGH++;
            }
          } else if (
            (HIGH === 1 || MEDIUM > 0) &&
            (input.nochange || input.worse)
          ) {
            MEDIUM++;
          } else {
            LOW++;
          }
          console.log("H:" + HIGH + "  M:" + MEDIUM + "  L:" + LOW);
          if (HIGH > 1) {
            return "HIGH";
          } else if (MEDIUM > 1) {
            return "MEDIUM";
          } else {
            return "LOW";
          }
        } catch (err) {
          return "LOW";
        }
      };
      input.status = symptomChecker(input);
      console.log(input.status);
      const new_update = new Date().toString();
      const update_query = `UPDATE sys.users SET status_id = '${
        input.status
      }', status_updated_on = '${new_update}' WHERE mobile_no = '${req.body.mobile_no.toString()}'`;
      const columns = `(mobile_no, normal, fever, high, drycough, sneeze, sore, weakness, noQ2, severecough, breathless, diffbreathing, drowsy, chestpain, severeweakness, noQ3, travel, contact, hotspotarea, closecontact, noQ4, diabetes, hbp, heart, kidney, lung, stroke, immunity, noQ5, improved, nochange, worse, worst, status, created_on, updated_on)`;
      const values = `('${req.body.mobile_no}', 
	  ${!!req.body.normal}, 
	  ${!!req.body.fever}, 
	  ${!!req.body.high}, 
	  ${!!req.body.drycough}, 
	  ${!!req.body.sneeze}, 
	  ${!!req.body.sore}, 
	  ${!!req.weakness}, 
	  ${!!req.body.noQ2}, 
	  ${!!req.body.severecough}, 
	  ${!!req.body.breathless}, 
	  ${!!req.body.diffbreathing}, 
	  ${!!req.body.drowsy}, 
	  ${!!req.body.chestpain}, 
	  ${!!req.body.severeweakness}, 
	  ${!!req.body.noQ3}, 
	  ${!!req.body.travel}, 
	  ${!!req.body.contact}, 
	  ${!!req.body.hotspotarea}, 
	  ${!!req.body.closecontact}, 
	  ${!!req.body.noQ4}, 
	  ${!!req.body.diabetes}, 
	  ${!!req.body.hbp}, 
	  ${!!req.body.heart}, 
	  ${!!req.body.kidney}, 
	  ${!!req.body.lung}, 
	  ${!!req.body.stroke}, 
	  ${!!req.body.immunity}, 
	  ${!!req.body.noQ5}, 
	  ${!!req.body.improved}, 
	  ${!!req.body.nochange}, 
	  ${!!req.body.worse}, 
	  ${!!req.body.worst}, 
	  '${input.status}', 
	  '${new_update}', 
	  '${new_update}')`;
      const insert_query = `REPLACE INTO sys.symptoms ${columns} VALUES${values}`;

      performDatabaseOperations(
        req,
        res,
        insert_query + ";" + update_query,
        "setsymptoms",
        input.status
      );
    }
  });
};
