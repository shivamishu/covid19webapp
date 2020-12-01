"use strict";
var mysql = require("mysql");
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.AWS_RDS_ENDPOINT,
  user: process.env.AWS_RDS_USERNAME,
  password: process.env.AWS_RDS_PASSWORD,
  database: process.env.AWS_RDS_DATABASE,
  multipleStatements: true,
});
module.exports = pool;
