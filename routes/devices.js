/*
 * File: devices.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var db = require('../database');
var crypto = require('crypto');



/* TO DO
 * - registerDevice()
 *    - make sure incoming json object is valid (i.e. not malformed)
 * - authenticateDevice()
 * - functions to enable/disable notifications
 */

// Function: getMasterHash
// Get hash of user-defined master password
function getMasterHash() {
  var shasum = crypto.createHash('sha1');
  var masterPassword = process.env.CC_PASS;
  shasum.update(masterPassword);
  return shasum.digest('hex');
};

// Function: generateDeviceHash
// Generates new hash to be used as a token for device to use with future API calls
function generateDeviceHash() {
  var shasum = crypto.createHash('sha1');
  shasum.update( process.hrtime() + getMasterHash());
  return shasum.digest('hex')
};

// Function: authenticateDevice
// Take device token and check if it exists in the database.
// Return true if token exists
function authenticateDevice(deviceToken) {

  db.isDeviceRegistered(deviceToken, function(err, results){
    if(err) { console.error(err); return; }

    // Check if results are empty
    if(Object.keys(results).length) {
      return true;
    } else
      return false;
  });

};

// Function: registerDevice
// Take in hashed password (JSON object), check against system's hashed master password
// Return unique device token to use for future API calls
exports.registerDevice = function(req,res) {


  var userHash = req.body['hashedPass'];

  // Compare user-submitted password hash to master password hash
  if (userHash == getMasterHash()){

    // Generate device token
    var deviceHash = generateDeviceHash();
    console.log("generated device token: " + deviceHash);

    // Add device to database
    db.addDevice(deviceHash, function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      // Get device info that was inserted and return it
      db.getDeviceInfo(results.insertId, function(err, results){
        if(err) { res.status(500).send("Server Error"); return; }

        // Return device info
        res.send(results);

      });

    });
  } else {
    res.status(403).send("Forbidden");
  }
};
