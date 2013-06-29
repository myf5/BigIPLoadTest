BigIPLoadTest
=============

Simple load testing script to make sure we're not oversubscribed on our Viprion at Agility. The loadrunner.py script manages threading and spawns Casper scripts that performs the logins and clicks.

### Requirements
- [CasperJS Install](http://casperjs.org/installation.html).   Homebrew and apt make this easy. 


### Usage
./loadrunner.py [mgmt IP] [num clients]

### Example: 
    ./loadrunner.py 192.168.1.254 10

### Caveats:
- Tested on OSX 10.8.  Should run on linux as-is.  Windows, you're on your own.
- Both scripts must be in the same directory
- It could take a few minutes to run. See below  
- Minimal error checking.  Uncomment the debug flags in the Casper script to troubleshoot
- The Casper threads are prone to failing periodically.  Not sure why this is.

### Preliminary Results
- Run on my Retina MBP
- BIG-IP 11.4 with 4GB RAM and 2 CPU
- Local networking only
- 25 Threads takes ~20min
- GUI becomes unresponsive after 5 clients start
- CPU on BIG-IP (dashboard widget) hit 15% before GUI died
- load average never got above .20
- iostat.. I dunno, I didn't go into Burger King
