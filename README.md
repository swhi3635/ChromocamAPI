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
CC_PASS='masterpassword' MYSQL_HOST='localhost' MYSQL_DB='chromocam' MYSQL_USER='dbuser' MYSQL_PASS='password' node server
```
##API Documentation

###File Methods

####GetFileList

- **Method:** GET
- **Input:** None
- **Location:** /files
- **Output:** JSON array of objects containing metadata for each event

####GetFile
- **Method:** GET
- **Input:** None
- **Location:** /files/[id]
- **Output:** JPEG image corresponding to [id]

####SetArchiveFlag
- **Method:** POST
- **Location:** /files/[id]/setArchive
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","archive":"1"}`
- **Output:** JSON Object

  `{"affectedRows":"1"}`

###Device Methods

####RegisterDevice
- **Method:** POST
- **Location:** /devices/register
- **Input:** JSON Object

  `{"hashedPass":"3da541559918a808c2402bba5012f6c60b27661c"}`
- **Output:** JSON Object

  `[{"device_id":23,"enabled":1,"token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}]`

####GetNotificationFlag
- **Method:** POST
- **Location:** /devices/notifications/get
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** 1 or 0 (enabled or disabled)

####SetNotificationFlag
- **Method:** POST
- **Location:** /devices/notifications/set
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5","enabled":"1"}`
- **Output:** JSON Object

  `{"affectedRows":"1"}`

###Motion Configuration Methods

####GetDetectionStatus
- **Method:** POST
- **Location:** /motion/detection/getStatus
- **Input:** JSON Object

  `{"id":"23","token":"439f2fae3241bd4b54396f18b1f71ab2851ea5c5"}`
- **Output:** JSON Object

  `{"status":"1"}`
