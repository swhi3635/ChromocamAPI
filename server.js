/*
 * File: server.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

// Load modules
var express = require('express');
var bodyParser = require('body-parser');
//var https = require('https');
var http = require('http');
var fs = require('fs');

// HTTPS certificates
var options = {
	key: fs.readFileSync('./keys/server.key'),
	cert: fs.readFileSync('./keys/server.crt')
}

// Set up app
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Grab route scripts
var files = require('./routes/files');
var devices = require('./routes/devices');
var motion = require('./routes/motion');

// Set routes
app.get('/files', files.findAllFiles);
app.get('/files/:id', files.findFileById);
app.post('/files/:id/setArchive', files.setArchiveFlag);
app.post('/devices/register', devices.registerDevice);
app.post('/devices/notifications/get', devices.getNotificationFlag);
app.post('/devices/notifications/set', devices.setNotificationFlag);
app.post('/motion/detection/getStatus', motion.getDetectionStatus);
app.get('/', function(req, res) {
  res.send('Hello world!');
});

// Start HTTP server
//https.createServer(options, app).listen(3000)
http.createServer(app).listen(3000)
console.log('Listening on port 3000...');
