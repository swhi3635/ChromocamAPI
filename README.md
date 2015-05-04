# ChromocamAPI
RESTful API for Chromocam project

This Node.JS API will be used with our [Android application](https://github.com/ZhangC1459/Chromocam) to control a basic home security system.

##Running the API

You will need to set some environment variables when executing this Node.JS application:

 - CC_PASS - the master password that new devices must use to register their device on the system
 - MYSQL_HOST - hostname of your MySQL server
 - MYSQL_DB - MySQL database that you wish to use
 - MYSQL_USER - MySQL user that has access to the database
 - MYSQL_PASS - Password for said MySQL user

Here's a sample startup script:
```bash
#!/bin/bash
CC_PASS='masterpassword' \
MYSQL_HOST='localhost' \
MYSQL_DB='chromocam' \
MYSQL_USER='dbuser' \
MYSQL_PASS='password' \
GCM_SENDER='GCM-Sender-Key' \
node server
```
##API Documentation

###File Methods

####Get File List

- **Method:** POST
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","offset":"20","archive":"1","limit":"10"}`
- **Location:** /files
- **Output:** JSON array of objects containing metadata for each event

####Get File
- **Method:** POST
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Location:** /files/[id]
- **Output:** JPEG image corresponding to [id]

####Set Archive Flag
- **Method:** POST
- **Location:** /files/[id]/setArchive
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","archive":"1"}`
- **Output:** JSON Object

  `{"affectedRows":"1"}`

###Device Methods

####Register Device
- **Method:** POST
- **Location:** /devices/register
- **Input:** JSON Object

  `{"hashedPass":"3da541559918a808c2402bba5012f6c60b27661c"}`
- **Output:** JSON Object

  `[{"device_id":23,"enabled":1,"token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}]`

####Get Notification Flag
- **Method:** POST
- **Location:** /devices/notifications/get
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** 1 or 0 (enabled or disabled)

####Set Notification Flag
- **Method:** POST
- **Location:** /devices/notifications/set
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","enabled":"1"}`
- **Output:** JSON Object

  `{"affectedRows":1}`

####Set Push Token
- **Method:** POST
- **Location:** /devices/notifications/setToken
- **Input:** JSON Object

`{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","gcmId":"25jh2lkj7mnb3m1cnkj5hlk7j62"}`

- **Output:** JSON Object

  `{"affectedRows":1}`

###Motion Configuration Methods

####Get Detection Status
- **Method:** POST
- **Location:** /motion/detection/getStatus
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** JSON Object

  `{"status":true}`

####Set Detection Status
- **Method:** POST
- **Location:** /motion/detection/setStatus
- **Input:** JSON Object
  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","action":"pause"}`
- **Output:** JSON Object

  `{"success":true}`

####Restart Motion
- **Method:** POST
- **Location:** /motion/restart
- **Input:** JSON Object
  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** JSON Object

  `{"success":true}`

####Take Snapshot
- **Method:** POST
- **Location:** /motion/snapshot
- **Input:** JSON Object
  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** JSON Object

  `{"success":true}`

####Get Config Value
- **Method:** POST
- **Location:** /motion/config/get
- **Input:** JSON Object
  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","option":"framerate"}`
- **Valid config options**: "width", "height", "framerate", "threshold", "area_detect"
- **Output:** JSON Object

  `{"option": "framerate", "value": "2"}`

####Set Config Value
- **Method:** POST
- **Location:** /motion/config/set
- **Input:** JSON Object
  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","option":"framerate", "value":"3"}`
- **Valid config options**: "width", "height", "framerate", "threshold", "area_detect"
- **Output:** JSON Object

  `{"success": true}`

####Live Stream
- **Method:** POST
- **Location:** /stream
- **Input:** JSON Object
  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** MJPEG Stream
