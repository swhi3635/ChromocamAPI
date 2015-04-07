/*
 * File: files.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var db = require('../database');
var fs = require('fs');
var auth = require('../auth');

// Function findAllFiles
// Get metadata for all files, returns JSON objects containing metadata
exports.findAllFiles = function(req, res) {

    // Get metadata for all files from database
    db.getFileList(function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      // Print JSON object
      res.send(results);
    });
};

// Function: findFileById
// Get file metadata for given fileId, return corresponding jpeg image
exports.findFileById = function(req, res) {

    //Get file metadata results from database query
    db.getFile(req.params.id, function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      //Empty object -- no metadata exists, invalid id
      if(Object.keys(results).length === 0){
        res.status(404).send("File not found");
        console.log('Invalid object');
        return;
      }

      //Read image into memory
      try {
        var img = fs.readFileSync(results[0].filename);

        //Show image in browser
        res.writeHead(200, {'Content-Type' : 'image/jpeg'});
        res.end(img, 'binary');

      } catch(e) {
        //If file doesn't exist
        if(e.code == 'ENOENT') {
          res.status(404).send("File not found");
          console.log('File' + results[0].filename + ' not found!');
          return;
        } else {
          throw e;
        }
      }



    });
};

// Function: setArchiveFlag
// Enable/disable archiving on specified file id
exports.setArchiveFlag = function(req,res) {

    // Get device credentials
    var deviceToken = req.body.token;
    var deviceId = req.body.id;
    var eventId = req.params.id;
    var flag = req.body.archive;

    // Authenticate device
    auth.authenticateDevice(deviceId, deviceToken, function(err, results) {
      // If credentials are invalid, send 403
      if(!results) { res.status(403).send("Forbidden"); return; }

      // Set 'archive' flag in db
      db.setArchive(eventId, flag, function(err, results){
        if(err) { res.status(500).send("Server Error"); return; }

        var resp = { "affectedRows" : results.affectedRows };
        res.send(resp);

      });
    });


};
