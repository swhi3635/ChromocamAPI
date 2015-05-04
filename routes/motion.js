/*
 * File: files.js
 * Authors: Sam Whitney
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
  var deviceId = parseInt(req.body.id);

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

      // URI = /detection/pause
      requestURI += "pause";

      substr = "Detection paused";

    } else {
      res.status(400).send("Bad Request");
      return;

    }

    // set request parameters
    var options = {baseUrl: motionURL, uri: requestURI, method: "GET"};

    // make request
    motionRequest(req, options, function(err, body) {
      if(err) { res.status(500).send("Server Error"); return; }

      // default response
      var resp = { "success" : false };

      // check if motion reports detection resumed
      if(body.indexOf(substr) > -1) {
        resp.success = true;
      }

      // send response
      res.json(resp);

    });

};

// Function: motionRestart
// Restart motion application
exports.motionRestart = function(req, res) {

  // set request parameters
  var options = {baseUrl: motionURL, uri: "/action/restart", method: "GET"};

  // make request
  motionRequest(req, options, function(err, body) {
    if(err) { res.status(500).send("Server Error"); return; }

    // default response is false (detection not active)
    var resp = { "success" : false };

    // detection status is active, set response accordingly
    if(body.indexOf("Done") > -1) {
      resp.success = true;
    }

    // send response
    res.json(resp);

  });

};

// Function: takeSnapshot
// Takes a snapshot of the current camera view
exports.takeSnapshot = function(req, res) {

  // set request parameters
  var options = {baseUrl: motionURL, uri: "/action/snapshot", method: "GET"};

  // make request
  motionRequest(req, options, function(err, body) {
    if(err) { res.status(500).send("Server Error"); return; }

    // default response is false (detection not active)
    var resp = { "success" : false };

    // detection status is active, set response accordingly
    if(body.indexOf("Done") > -1) {
      resp.success = true;
    }

    // send response
    res.json(resp);

  });

};

// Function: getConfig
// Gets values for specified config options
exports.getConfig = function(req, res) {

  // query = config option you want to get the value of
  var query = req.body.option;

  // config options that user is allow to check
  var allowedQueries = [ "width","height","framerate","threshold","area_detect","gap"];

  // make sure query is allowed
  if(allowedQueries.indexOf(query) == -1){
    res.status(400).send("Bad request");
    return;
  }

  // query to be included in GET request
  var queryString = { "query" : query };

  // set request parameters
  var options = {baseUrl: motionURL, uri: "/config/get", qs: queryString, method: "GET"};

  // make request
  motionRequest(req, options, function(err, body) {
    if(err) { res.status(500).send("Server Error"); return; }

    // check motion's response - make sure
    if(body.indexOf("Done") == -1) {
      res.status(500).send("Server error");
      return;
    }

    //format motion's response to JSON object
    var equals = body.indexOf(" =");
    var done = body.indexOf("\nDone\n");

    var key = body.substring(0,equals);
    var value = body.substring(equals + 3, done);

    var resp = {"option": key, "value": value};

    // send response
    res.json(resp);

  });

};

// Function: setConfig
// Sets values for specified config options
exports.setConfig = function(req, res) {

  // query = config option you want to get the value of
  var query = req.body.option;
  var queryValue = req.body.value;

  // make sure value is numeric
  var reg = new RegExp(/^[0-9]*$/);

  if(!reg.test(queryValue)){
    res.status(400).send("Bad request");
    return;
  }

  // config options that user is allow to check
  var allowedQueries = [ "width","height","framerate","threshold","area_detect", "gap"];

  // make sure query is allowed
  if(allowedQueries.indexOf(query) == -1){
    res.status(400).send("Bad request");
    return;
  }

  // query to be included in GET request
  var queryString = {};
  queryString[query] = queryValue;

  // set request parameters
  var options = {baseUrl: motionURL, uri: "/config/set", qs: queryString, method: "GET"};

  // make request
  motionRequest(req, options, function(err, body) {
    if(err) { res.status(500).send("Server Error"); return; }

    // response
    var resp = {"success" : false};

    // if option was successfully changed
    if(body.indexOf("Done") > -1) {
      resp.success = true;
    }

    // send response
    res.json(resp);

  });

};
