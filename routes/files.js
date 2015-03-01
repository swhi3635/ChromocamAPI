/*
 * File: server.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var db = require('../database');
var fs = require('fs');

// FunctionL findAll
// Get metadata for all files, returns JSON objects containing metadata
exports.findAll = function(req, res) {

    // Get metadata for all files from database
    db.getFileList(function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      // Print JSON object
      res.send(results);
    });
};

// Function: findById
// Get file metadata for given fileId, return corresponding jpeg image
exports.findById = function(req, res) {

    //Get file metadata results from database query
    db.getFile(req.params.id, function(err, results){
      if(err) { res.status(500).send("Server Error"); return; }

      //Empty object -- no metadata exists, invalid id
      if(Object.keys(results).length == 0){
        res.status(404).send("File not found");
        console.log('Invalid object');
        return;
      }

      //Read image into memory
      try {
        var img = fs.readFileSync(results[0]['filename']);
      } catch(e) {
        //If file doesn't exist
        if(e.code == 'ENOENT') {
          res.status(404).send("File not found");
          console.log('File' + results[0]['filename'] + ' not found!');
          return;
        } else {
          throw e;
        }
      }

      //Show image in browser
      res.writeHead(200, {'Content-Type' : 'image/jpeg'});
      res.end(img, 'binary');

    });
};
