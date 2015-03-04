/*
 * File: database.js
 * Authors: Sam Whitney, Aleks Sverdlovs
 * Project: Chromocam web API
 */

var mysql = require('mysql');

// Initiate MySQL connection pool
var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
});

// Query: getFile
// Grabs file metadata for given fileId
exports.getFile = function(fileId, callback){

  // SQL statement
  var sql = 'SELECT * FROM event WHERE event_id = ?';
  var args = [fileId];

  selectRows(sql, args, callback);

};

// Query: getFileList
// Get metadata for all images (events)
exports.getFileList = function(callback){

  // SQL statement
  var sql = 'SELECT * FROM event';
  var args = [];

  selectRows(sql, args, callback);

};


// Function: selectRows
// Returns rows after running specified SQL query
function selectRows(sql, args, callback){
  // Claim connection from pool
  pool.getConnection(function(err, connection){
    if(err){ console.error(err); callback(true); return; }

    console.log('connected with id ' + connection.threadId);

    // Execute query
    connection.query(sql, args, function(err, results){
      if(err){ console.error(err); callback(true); return; }

      // Release connection back to pool
      connection.release();
      console.log('connection released.');
      callback(false, results);
    });

  });
};
