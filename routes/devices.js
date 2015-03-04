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
 *    - add device to database
 *    - return token (unique hash) for device to use for future API calls
 * - authenticateDevice()
 */

// Function: getMasterHash
// Get hash of user-defined master password
function getMasterHash() {
  var shasum = crypto.createHash('sha1');
  var masterPassword = process.env.CC_PASS;
  shasum.update(masterPassword);
  return shasum.digest('hex');
};

// Function: registerDevice
// Take in hashed password (JSON object), check against system's hashed master password
// Return unique device token to use for future API calls
exports.registerDevice = function(req,res) {
  var userHash = req.body['hashedPass'];

  console.log(userHash);

  //console.log("user-provided master pass hash: " + req.body[0]['hashedPass']);
  console.log("actual master pass hash: " + getMasterHash());

  //compare user-submitted hash to
  if (userHash == getMasterHash()){
    res.send('Authorized')
  } else {
    res.status(403).send("Forbidden");
  }


};
