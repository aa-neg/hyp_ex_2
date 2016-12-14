"use strict";

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const os = require('os');
const api = require('./api.js');
const http = require('http');

let app = express();

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(path.join(__dirname, '../', 'app')));
app.use('/node_modules', express.static(path.join(__dirname, '../', 'node_modules')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../app', 'index.html'));
})

app.post('/api/sendEmail', (req, res)=> {
	
	api.sendEmail(req.body.details, api.emailClients.sendGrid, api.emailClients.mailGun)
	.then((resolve)=> {
		res.json(resolve)
	})
	.catch((error)=> {
		res.json(error)
	})
})

let server;

let start = module.exports.start = () => {
	server = app.listen(config.server.port, ()=> {
		console.log("Server started on :" + config.server.port);
	});
};

const runArg = process.argv[2];

if (runArg == 'start') {
	start();
};