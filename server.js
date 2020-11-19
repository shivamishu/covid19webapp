require("dotenv").config();
var express = require("express");
var loginroutes = require("./routes/loginroutes");
var addressroutes = require("./routes/addressroutes");
var symptomsroute = require("./routes/symptoms");
var contactroute = require("./routes/contacttraces");
var authMiddleware = require("./auth/authMiddleware");
// var containmentzones = require('./routes/containmentzones');
// body parser added
var bodyParser = require("body-parser");
let cors = require("cors");
var app = express();
var fileUpload = require("express-fileupload");
app.use(express.static(__dirname));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "tmp",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// Allow cross origin requests
app.use(cors());
var router = express.Router();
// router.use(function (req, res, next) {
//     console.log(req.path);
//     console.log(JSON.stringify(req.headers));
//     if (req.path === "/login" || req.path === "/register" || req.path === "/forgot") {
//         next();
//     } else {

//     }
// });
// test route
router.get("/", function (req, res) {
  console.log("default route called");
  res.json({
    message: "welcome to Healthcare Assistant",
  });
});
//route to handle user registration
router.post("/register", loginroutes.register);
// route to login
router.post("/login", loginroutes.login);
// route to token login
router.post("/tokenlogin", verifyToken, loginroutes.tokenlogin);
// route to forgot
router.post("/forgot", loginroutes.forgot);
// route to reset
router.post("/reset", verifyToken, loginroutes.reset);
// route to save address
router.post("/setaddress", addressroutes.setaddress);
// route to save location
router.post("/setlocation", addressroutes.setlocation);
// route to save symptoms
router.post("/symptoms", verifyToken, symptomsroute.symptoms);
// route to save symptoms
router.post("/contacttraces", verifyToken, contactroute.contacttraces);
// route to save symptoms
router.post("/containmentzones", addressroutes.containmentzones);
//route for containment cities
router.post("/containmentcities", addressroutes.containmentcities);
// route to containment results
router.post("/containmentresults", addressroutes.containmentresults);
// route to upload covid19 results
router.post("/upload_file", addressroutes.upload_file);
//contact trace list for ADMIN
router.post(
  "/contacttracelist",
  authMiddleware.Validate,
  contactroute.contacttracelist
);
//send notification
router.post("/sendnotification", contactroute.sendnotification);
//confirm report result
router.post("/confirmreport", contactroute.confirmreport);
//default
app.use("/api", router);

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// Verify Token
function verifyToken(req, res, next) {
  console.log("verifying token");
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}
//port added
app.listen(process.env.PORT || 443);
console.log("listening on port:" + (process.env.PORT || 443));
