# ChromocamAPI
RESTful API for Chromocam project

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
