
const jwt = require('jsonwebtoken');
var AWS = require("aws-sdk");
let awsConfig = {
	"region": process.env.AWS_REGION,
	"endpoint": process.env.AWS_ENDPOINT,
	"accessKeyId": process.env.AWS_API_ID,
	"secretAccessKey": process.env.AWS_API_KEY
};
AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
exports.register = async function (req, res) {
	const password = req.body.password;
	const encryptedPassword = await bcrypt.hash(password, saltRounds);
	// let save = function () {

	var input = {
		"mobile_no": req.body.mobile_no,
		"fname": req.body.fname,
		"lname": req.body.lname,
		"sex": req.body.sex,
		"age": req.body.age,
		"email": req.body.email,
		"password": encryptedPassword,
		"created_by": "clientUser",
		"created_on": new Date().toString(),
		"updated_by": "clientUser",
		"updated_on": new Date().toString(),
		"is_deleted": false
	};
	var params = {
		TableName: "users",
		Item: input,
		ConditionExpression: "attribute_not_exists(mobile_no)",
		
	};
	docClient.put(params, function (err, data) {

		if (err) {
			console.log("users::save::error - " + JSON.stringify(err, null, 2));
			res.send({
				"code": 400,
				"failed": err.code === "ConditionalCheckFailedException" ? "Mobile Number is already registered. Sign in to continue." : "An error ocurred during user registration."
			});
		} else {
			console.log("users::save::success");
			const user = {
				mobile_no: req.body.mobile_no,
				email: req.body.email,
				age: req.body.age,
				sex: req.body.sex
			};
			jwt.sign({
				user
			}, 'secretkey', {
				expiresIn: '365d'
			}, (err, token) => {
				res.send({
					"code": 200,
					"success": "Mobile number registered successfully.",
					"mobile_no": req.body.mobile_no,
					"fname": req.body.fname,
					"lname": req.body.lname,
					"sex": req.body.sex,
					"age": req.body.age,
					"email": req.body.email,
					"status_id": null,
					"token": token
				});
			});
		}
	});
	// }
	// save();
}

exports.login = async function (req, res) {
	var mobile_no = req.body.mobile_no;
	var password = req.body.password;
	// let fetchOneByKey = function () {
	var params = {
		TableName: "users",
		Key: {
			"mobile_no": mobile_no
		}
	};
	docClient.get(params, async function (err, data) {
		var isData = data;
		if (data) {
			iData = data.Item
		};
		if (err || !isData) {
			console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
			res.send({
				"code": 400,
				"failed": "Error: Mobile number does not exist."
			});
		} else {
			console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
			// console.log(mobile_no + " " + password + " " + JSON.stringify(data));
			const comparision = await bcrypt.compare(password, data.Item.password);
			// const comparision = data.Item.password === password ? true : false;
			if (comparision) {
				console.log(mobile_no + ": login successfull");
				const user = {
					mobile_no: mobile_no,
					email: data.Item.email,
					age: data.Item.age,
					sex: data.Item.sex
				};
				jwt.sign({
					user
				}, 'secretkey', {
					expiresIn: '365d'
				}, (err, token) => {
					res.send({
						"code": 200,
						"success": "Login successfull.",
						"mobile_no": mobile_no,
						"fname": data.Item.fname,
						"lname": data.Item.lname,
						"sex": data.Item.sex,
						"age": data.Item.age,
						"email": data.Item.email,
						"block_no": data.Item.block_no,
						"house_no": data.Item.house_no,
						"society": data.Item.society,
						"street": data.Item.street,
						"city": data.Item.city,
						"pincode": data.Item.pincode,
						"state_id": data.Item.state_id,
						"country": data.Item.country,
						"status_id": data.Item.status_id,
						"latitude": data.Item.latitude,
						"longitude": data.Item.longitude,
						"token": token
					});
				});

			} else {
				console.log(mobile_no + ": mobile and password does not match");
				res.send({
					"code": 400,
					"failed": "Error: Incorrect password."
				});
			}
		}
	});
	// }
	// fetchOneByKey();

}
exports.tokenlogin = async function (req, res) {
	var token = req.token;
	jwt.verify(token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			var mobile_no = authData.user.mobile_no;
			// let fetchOneByKey = function () {
			var params = {
				TableName: "users",
				Key: {
					"mobile_no": mobile_no
				}
			};
			docClient.get(params, async function (err, data) {
				var isData = data;
				if (data) {
					iData = data.Item
				};
				if (err || !isData) {
					console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
					res.send({
						"code": 400,
						"failed": "Error: Mobile number does not exist."
					});
				} else {
					console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
					res.send({
						"code": 200,
						"success": "Login successfull.",
						"mobile_no": mobile_no,
						"fname": data.Item.fname,
						"lname": data.Item.lname,
						"sex": data.Item.sex,
						"age": data.Item.age,
						"email": data.Item.email,
						"block_no": data.Item.block_no,
						"house_no": data.Item.house_no,
						"society": data.Item.society,
						"street": data.Item.street,
						"city": data.Item.city,
						"pincode": data.Item.pincode,
						"state_id": data.Item.state_id,
						"country": data.Item.country,
						"status_id": data.Item.status_id,
						"latitude": data.Item.latitude,
						"longitude": data.Item.longitude,
						"token": token
					});
				}
			});
		}
	});
}

exports.forgot = async function (req, res) {
	var mobile_no = req.body.mobile_no;
	var params = {
		TableName: "users",
		Key: {
			"mobile_no": mobile_no
		}
	};
	docClient.get(params, async function (err, data) {
		var isData = data;
		if (data) {
			iData = data.Item
		};
		if (err || !isData) {
			console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
			res.send({
				"code": 400,
				"failed": "Error: Mobile number does not exist."
			});
		} else {
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.GMAIL_ID,
					pass: process.env.GMAIL_PASSWORD
				}
			});
			var user = {
				"mobile_no": mobile_no,
				"email": data.Item.email
			};
			jwt.sign({
				user
			}, 'secretkey', {
				expiresIn: '1h'
			}, (err, token) => {
				var resetToken = token;
				var mailOptions = {
					from: process.env.GMAIL_ID,
					to: data.Item.email,
					subject: 'COVID-19 Healthcare Assistant Password Reset Link',
					text: 'Hi ' + data.Item.fname + ', \n' +
						'You are receiving this because you(or someone else) have requested to reset the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to change your password:\n\n' +
						'http://' + req.headers.host + '#/reset/' + resetToken + '\n\n' +
						'The link is valid only for 1 hour.\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n' +
						'- Your COVID-19 Healthcare Assistant\n' +
						'#StayHealthy #StaySafe'
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
						res.send({
							"code": 400,
							"failed": "An error occured while initiating password reset."
						});
					} else {
						console.log('Email sent: ' + info.response);
						console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
						var maskid = data.Item.email.replace(/^(.)(.*)(.@.*)$/,
							(_, a, b, c) => a + b.replace(/./g, '*') + c
						);
						res.send({
							"code": 200,
							"success": "An email with the password reset link has been sent to " + maskid,
						});
					}
				});
			});
		}
	});
	// }
	// fetchOneByKey();

}
exports.reset = async function (req, res) {
	var token = req.token;
	const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
	jwt.verify(token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			// console.log(JSON.stringify(authData));
			//verified
			// if (req.body.mobile_no !== authData.user.mobile_no) {
			//     res.send({
			//         "code": 403,
			//         "failed": "An error occured while saving location."
			//     });
			//     return;
			// }
			var params = {
				TableName: "users",
				Key: {
					"mobile_no": authData.user.mobile_no
				},
				UpdateExpression: "set password = :pwd, updated_on = :lst_updtd",
				ExpressionAttributeValues: {
					":pwd": encryptedPassword,
					":lst_updtd": new Date().toString()
				},
				ReturnValues: "UPDATED_NEW"

			};
			docClient.update(params, function (err, data) {

				if (err) {
					console.log("users::password reset::error - " + JSON.stringify(err, null, 2));
					res.send({
						"code": 400,
						"failed": "An error occured while restting password."
					});
				} else {
					console.log("users::password changed::success - " + JSON.stringify(data, null, 2));
					// console.log("users::password save::success");
					res.send({
						"code": 200,
						"success": "Password changed successfully."
					});
				}
			});
		}
	});

}
