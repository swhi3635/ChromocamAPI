
 # File: door.py
 # Description: Pause/resume motion detection when someone leaves the house
 # Authors: Sam Whitney, Aleks Sverdlovs
 # Project: Chromocam web API

import time
import RPi.GPIO as io
import urllib2
io.setmode(io.BCM)

door_pin = 23
door_open = False
door_open_prev = False

io.setup(door_pin, io.IN, pull_up_down=io.PUD_UP)  # activate input with PullUp

while True:

    door_open_prev = door_open
    door_open = io.input(door_pin)

    # On door open
    if(door_open == True and door_open_prev == False):
        # Pause detection when door is opened
        urllib2.urlopen("http://localhost:8080/0/detection/pause").read()
    # On door close
    elif(door_open == False and door_open_prev == True):
        # Wait 10 seconds, then start detection
        time.sleep(10)
        urllib2.urlopen("http://localhost:8080/0/detection/start").read()
    else:
        print("No change")
    time.sleep(0.5)
