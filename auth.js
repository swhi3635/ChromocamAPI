/*
 * File: auth.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var db = require('./database');
var crypto = require('crypto');

// Function: authenticateDevice
// Take device token, id and check if it exists in the database.
// Return true if token exists
exports.authenticateDevice = function(deviceId, deviceToken, callback) {

  db.isDeviceRegistered(deviceId, deviceToken, function(err, results){
    if(err) { console.error(err); callback(true); return; }

    // Check if results are empty
    if(Object.keys(results).length) {
      console.log("auth success");
      callback(false, true);
    } else {
      console.log("auth fail");
      callback(false, false);
    }
  });


};
