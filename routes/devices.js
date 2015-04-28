/*
 * File: devices.js
 * Authors: Sam Whitney
 * Project: Chromocam web API
 */

var db = require('../database');
var auth = require('../auth');
var crypto = require('crypto');

// Function: getMasterHash
// Get hash of user-defined master password
function getMasterHash() {
  var shasum = crypto.createHash('sha1');
  var masterPassword = process.env.CC_PASS;
  shasum.update(masterPassword);
  return shasum.digest('hex');
}

// Function: generateDeviceHash
// Generates new hash to be used as a token for device to use with future API calls
function generateDeviceHash() {
  var shasum = crypto.createHash('sha1');
  shasum.update( process.hrtime() + getMasterHash());
  return shasum.digest('hex');
}

// Function: registerDevice
// Take in hashed password (JSON object), check against system's hashed master password
// Return unique device token to use for future API calls
exports.registerDevice = function(req,res) {

  var userHash = req.body.hashedPass;
  var regId = req.body.gcmId; // GCM registration ID for push notifications

  console.log(regId);

  // Compare user-submitted password hash to master password hash
  if (userHash == getMasterHash()){

    // Generate device token
    var deviceHash = generateDeviceHash();
    console.log("generated device token: " + deviceHash);

    // Add device to database
    db.addDevice(deviceHash, regId, function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      // Get device info that was inserted and return it
      db.getDeviceInfo(results.insertId, function(err, results){
        if(err) { res.status(500).send("Server Error"); return; }

        // Return device info
        res.json(results);

      });

    });
  } else {
    res.status(403).send("Forbidden");
  }
};

// Function: getNotificationFlag
// Check if device has notifications enabled
exports.getNotificationFlag = function(req,res) {

  // Get device credentials
  var deviceToken = req.body.token;
  var deviceId = parseInt(req.body.id);

  // Authenticate device
  auth.authenticateDevice(deviceId, deviceToken, function(err, results) {
    // If credentials are invalid, send 403
    if(!results) { res.status(403).send("Forbidden"); return; }

    // Get 'enabled' flag from database
    db.getDeviceInfo(deviceId, function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      // Send response - flag: true or false
      res.json(results[0].enabled);

    });
  });

};

// Function: setNotificationFlag
// Enable/disable notifications on selected device
exports.setNotificationFlag = function(req, res) {

  // Get device credentials
  var deviceToken = req.body.token;
  var deviceId = parseInt(req.body.id);
  var flag = parseInt(req.body.flag);

  // Authenticate device
  auth.authenticateDevice(deviceId, deviceToken, function(err, results) {
    // If credentials are invalid, send 403
    if(!results) { res.status(403).send("Forbidden"); return; }

    // Set 'enabled' flag in db
    db.setNotifications(deviceId, flag, function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      var resp = { "affectedRows" : results.affectedRows };
      res.send(resp);

    });
  });

};
