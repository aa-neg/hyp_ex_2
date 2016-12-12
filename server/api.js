"use strict";

const config = require('config');
const request = require('request');

//Required to map into sendGrid's api
let sendGridMapEmail = (emailArray) => {
	return emailArray.map((email) => {
		return {email: email}
	})
};

let sendSendGrid = module.exports.sendSendGrid = function(details) {
	return new Promise(function(resolve , reject) {
		request.post(
		{
			url: "https://api.sendgrid.com/v3/mail/send",
			headers: {
				Authorization: "Bearer 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",
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
					reject(body.errors)
				} else {
					resolve(body);
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
				reject(err);
			} else {
				console.log("[sendMailgun] : " + body);
				resolve(body);
			}
		}
		)
	});
};

