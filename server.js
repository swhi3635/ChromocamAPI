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
var MjpegProxy = require('./mjpeg-proxy-custom').MjpegProxy;
var MjpegProxy2 = require('mjpeg-proxy').MjpegProxy; // temporary un-authenticated stream for testing

// HTTPS certificates
var options = {
	key: fs.readFileSync('./keys/server.key'),
	cert: fs.readFileSync('./keys/server.crt')
};

// Set up app
var app = express();

// JSON parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Grab route scripts
var files = require('./routes/files');
var devices = require('./routes/devices');
var motion = require('./routes/motion');
var push = require('./routes/push');

// Set routes
app.post('/files', files.findAllFiles);
app.post('/files/:id', files.findFileById);
app.post('/files/:id/setArchive', files.setArchiveFlag);
app.post('/devices/register', devices.registerDevice);
app.post('/devices/notifications/get', devices.getNotificationFlag);
app.post('/devices/notifications/set', devices.setNotificationFlag);
app.post('/motion/detection/getStatus', motion.getDetectionStatus);
app.post('/motion/detection/setStatus', motion.setDetectionStatus);
app.post('/motion/restart', motion.motionRestart);
app.post('/motion/config/get', motion.getConfig);
app.post('/motion/config/set', motion.setConfig);
app.post('/motion/snapshot', motion.takeSnapshot);
app.post('/stream', new MjpegProxy('http://localhost:8081/').proxyRequest);
app.get('/stream2', new MjpegProxy2('http://localhost:8081/').proxyRequest); // temporary, un-authenticated stream for testing;
app.get('/notify', push.notify);
app.get('/', function(req, res) {
  res.send('Hello world!');
});

// Start HTTP server
//https.createServer(options, app).listen(3000)
http.createServer(app).listen(3000);
console.log('Listening on port 3000...');
