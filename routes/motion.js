/*
 * File: files.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var db = require('../database');
var request = require('request');
var auth = require('../auth');

// URL of motion API
var motionURL = "http://localhost:8080/0/";

// Function motionRequest
// make requests to Motion API given specified options
// Options: baseURL, URI, method, headers, etc.
function motionRequest(req, options, callback) {
  // Get device credentials
  var deviceToken = req.body.token;
  var deviceId = req.body.id;

  // Authenticate device
  auth.authenticateDevice(deviceId, deviceToken, function(err, results) {
    // If credentials are invalid, send 403
    if(!results) { res.status(403).send("Forbidden"); return; }

      // make HTTP request
      request(options, function(error, response, body) {
        // success
        if (!error && response.statusCode == 200) {
          callback(false, body);
        } else {
          // problem w/ request
          console.error(error);
          callback(true);
          return;
        }
      });
  });
}

// Function: getDetectionStatus
// See if motion detection is enabled/disabled
exports.getDetectionStatus = function(req, res) {

  // set request parameters
  var options = {baseUrl: motionURL, uri: "/detection/status", method: "GET"};

  // make request
  motionRequest(req, options, function(err, body) {
    if(err) { res.status(500).send("Server Error"); return; }

    // default response is false (detection not active)
    var resp = { "status" : false };

    // detection status is active, set response accordingly
    if(body.indexOf("ACTIVE") > -1) {
      resp.status = true;
    }

    // send response
    res.json(resp);

  });

};

// Function: setDetectionStatus
// Enable/disable motion detection
exports.setDetectionStatus = function(req, res) {
    // action = start/pause detection
    var action = req.body.action;

    // URI for start/stop motion detection via motion API
    var requestURI = "/detection/";

    // start detection
    if( action == "start" ) {

      // URI = /detection/start
      requestURI += action;

      // look for this string to verify detection started
      substr = "Detection resumed";

    // pause detection
    } else if ( action == "pause" || action == "stop" ){
      requestURI += "pause";
      substr = "Detection paused";

    } else {
      res.status(400).send("Bad Request");
      return;

    }

    var options = {baseUrl: motionURL, uri: requestURI, method: "GET"};

    motionRequest(req, options, function(err, body) {
      if(err) { res.status(500).send("Server Error"); return; }

      var resp = { "success" : false };

      if(body.indexOf(substr) > -1) {
        resp.success = true;
      }

      res.json(resp);

    });

};
