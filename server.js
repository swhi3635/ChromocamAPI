/*
 * File: server.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var express = require('express'),
    files = require('./routes/files')

var app = express();
var https = require('https');
var fs = require('fs');

// HTTPS certificates
var options = {
	key: fs.readFileSync('./keys/server.key'),
	cert: fs.readFileSync('./keys/server.crt')
}

// Set routes
app.get('/files', files.findAll);
app.get('/files/:id', files.findById);
app.get('/', function(req, res) {
  res.send('Hello world!');
});

// Start HTTP server
https.createServer(options, app).listen(3000)
console.log('Listening on port 3000...');
