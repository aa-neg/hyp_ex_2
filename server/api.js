"use strict";

const config = require('config');
const request = require('request');

//Required to map into sendGrid's api
let sendGridMapEmail = (emailArray) => {
	if (emailArray) {
		return emailArray.map((email) => {
			return {email: email}
		})
	} else {
		return [];
	}
};

let sendSendGrid = module.exports.sendSendGrid = function(details) {
	return new Promise(function(resolve , reject) {
		request.post(
		{
			url: "https://api.sendgrid.com/v3/mail/send",
			headers: {
				Authorization: "Bearer " + config.keys.sendGrid.key,
				"Content-Type": 'application/json'
			},
			json: {
				"personalizations": [{"to": sendGridMapEmail(details.emailTo)}],
				"from": {email: details.emailFrom},
				"subject": "Hello, World!",
				"cc": sendGridMapEmail(details.emailCc),
				"bcc": sendGridMapEmail(details.emailBcc),
				"content": [{"type": "text/plain", "value": details.body}]
			}
		}
		,
		function(err, response ,body) {
			if (err) {
				console.error("[sendSendGrid] : " + err);
				reject(err);
			} else {
				console.log("[sendSendGrid] : " + body);
				if (body && body.errors) {
					reject({
						client: 'sendGrid',
						errors: body.errors
					})
				} else {
					resolve({
						client: 'sendGrid',
						body: body
					});
				}
			}
		}
		)
	})
}

let sendMailGun = module.exports.sendMailGun = function(details) {
	return new Promise(function(resolve , reject) {
		let formBlock = {
			from: details.emailFrom,
			"to": details.emailTo,
			"cc": details.emailCc,
			"bcc": details.emailBcc,
			"subject": details.emailSubject,
			"text": details.body
		};

		request.post(
		{
			url: "https://api.mailgun.net/v3/" + config.keys.mailGun.sandboxDomain + "/messages",
			auth: {
				username: "api",
				password: config.keys.mailGun.key
			},
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded'
			},
			form: formBlock
		}
		,
		function(err, httpResponse, body) {
			if (err) {
				console.error("[sendMailgun] : " + err);
				reject({
					client: 'mailGun',
					errors: err
				});
			} else {
				console.log("[sendMailgun] : " + body);
				resolve({
					client: 'mailGun',
					body: body
				});
			}
		}
		)
	});
};

let emailClients = module.exports.emailClients = {
	mailGun: sendMailGun,
	sendGrid: sendSendGrid
}


let sendEmail = module.exports.sendEmail = function(emailBody, mainClient, backUpClient) {
	return new Promise(function(resolve, reject) {
		let responseObject = {
			message: '',
			details: '',
			errors: [],
			success: false,
			initialClient: ''
		};

		mainClient(emailBody)
		.then((results)=> {
			responseObject.message = "Successfully sent email through " + results.client;
			responseObject.details = results.body;
			responseObject.success = true;
			resolve(responseObject);
		})
		.catch((error)=> {
			console.error("[sendEmail] : " + error);
			responseObject.initialClient = results.client;
			responseObject.errors.push(error.errors);
			backUpClient(emailBody)
			.then((results)=> {
				if (results.body) {
					responseObject.details = results.body;
				}
				responseObject.message = responseObject.initialClient + " had issues, email sent through " + results.client + " instead.";
				responseObject.success = true;
				resolve(responseObject)
			})
			.catch((error)=> {
				responseObject.errors.push(error);
				reject(responseObject);
			})
		})
	})
}
