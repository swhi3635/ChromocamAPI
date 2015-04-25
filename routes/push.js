var db = require('../database');
var gcm = require('node-gcm');
var extend = require('util')._extend;


// Function: notify
// Send push notification to devices when an event occurs
exports.notify = function(req, res) {

  if(req.connection.remoteAddress != '127.0.0.1') {
    res.status(403).send("Forbidden");
    return;
  }


  // Get GCM registration IDs for devices that have notifications enabled
  db.getEnabledDevices(function(err, results){
    if(err) { console.log(err); res.status(500).send("Server Error"); return; }

    var registrationIds = [];

    // Put regIds into an array
    for (var i = 0; i < results.length; i++) {
      var device = results[i];
      registrationIds.push(device.regId);
    }

    // Set up new push message
    var message = new gcm.Message({
      collapseKey: 'demo',
      delayWhileIdle: true,
      timeToLive: 3,
      //dryRun: true,
      data: {
        event_id: results[0].event_id
      }
    });

    var sender = new gcm.Sender(process.env.GCM_SENDER);

    sender.sendNoRetry(message, registrationIds, function(err, result) {
      if(err) console.error(err);
      else    console.log(result);
    });

    res.send("id: " + results[0].event_id);

  });

};
