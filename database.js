/*
 * File: database.js
 * Authors: Sam Whitney
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
exports.getFileList = function(offset, archive, limit, callback){

  // SQL statement
  var sql = 'SELECT event_id,time_stamp,file_type,archive FROM event WHERE event_id <= ((SELECT MAX(event_id) FROM event) - ?) AND archive = ? ORDER BY event_id DESC LIMIT ?';
  var args = [offset,archive,limit];

  selectRows(sql, args, callback);

};

// Query: getLatestSnapshot
// Grabs file metadata for given fileId
exports.getLatestSnapshot = function(callback){

  // SQL statement
  var sql = 'SELECT event_id FROM event WHERE file_type=2 ORDER BY event_id DESC LIMIT 1';
  var args = [];

  selectRows(sql, args, callback);

};

// Query: addDevice
// Insert new device in device table
exports.addDevice = function(deviceHash, callback){

  //SQL statement
  var sql = 'INSERT INTO device SET ?';
  var args = [{token:deviceHash,enabled:0}];

  selectRows(sql, args, callback);

};

// Query: isDeviceRegistered
// Look for matching device tokens
exports.isDeviceRegistered = function(deviceId, deviceToken, callback){

  //SQL statement
  var sql = 'SELECT * FROM device WHERE device_id = ? AND token = ?';
  var args = [deviceId,deviceToken];

  selectRows(sql, args, callback);

};

// Query: getDeviceInfo
// Grabs device information for given id from device table
exports.getDeviceInfo = function(deviceId, callback){

  //SQL statement
  var sql = 'SELECT * FROM device WHERE device_id = ?';
  var args = [deviceId];

  selectRows(sql, args, callback);

};

// Query: setNotificaitons
// Sets 'enabled' flag in device table for specific device id
exports.setNotifications = function(deviceId, flag, callback) {

  //SQL statement
  var sql = 'UPDATE device SET enabled = ? WHERE device_id = ?';
  var args = [flag,deviceId];

  selectRows(sql, args, callback);

};

// Query: setGCM
// Sets GCM registration token for device (for push notifications)
exports.setGCM = function(deviceId, regId, callback) {

  //SQL statement
  var sql = 'UPDATE device SET regId = ? WHERE device_id = ?';
  var args = [regId,deviceId];

  selectRows(sql, args, callback);

};

// Query: setArchive
// Sets 'archive' flag in device table for specific device id
exports.setArchive = function(deviceId, flag, callback) {

  //SQL statement
  var sql = 'UPDATE event SET archive = ? WHERE event_id = ?';
  var args = [flag,deviceId];

  selectRows(sql, args, callback);

};

// Query: getEnabledDevices
// Returns GCM registration IDs for all devices that have notifications enabled
exports.getEnabledDevices = function(callback) {

  //SQL statement
  var sql = 'SELECT DISTINCT(device.regId) as regId, device.device_id, event_id FROM device, (SELECT MAX(event_id) AS event_id FROM event) AS event WHERE enabled = 1 and regId IS NOT NULL';
  var args = [];

  selectRows(sql, args, callback);

};


// Query: logNotification
// Adds a record that a notification was sent to a device for an event
exports.logNotification = function(devices, callback) {

  //SQL statement
  var sql = 'INSERT INTO notification_log (device_id, event_id) VALUES ?';
  //var args = [{device_id:deviceId,event_id:eventId}];

  insertRows(sql, devices, callback);
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
}

// Function: insertRows
// Returns rows after running specified SQL query
function insertRows(sql, args, callback){
  // Claim connection from pool
  pool.getConnection(function(err, connection){
    if(err){ console.error(err); callback(true); return; }

    console.log('connected with id ' + connection.threadId);

    // Execute query
    connection.query(sql, [args], function(err, results){
      if(err){ console.error(err); callback(true); return; }

      // Release connection back to pool
      connection.release();
      console.log('connection released.');
      callback(false, results);
    });

  });
}
