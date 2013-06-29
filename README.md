BigIPLoadTest
=============

Simple load testing script to make sure we're not oversubscribed on our Viprion at Agility. The loadrunner.py script manages threading and spawns Casper scripts that performs the logins and clicks.

## Usage
./loadrunner.py [mgmt IP] [num clients]

### Example: 
    ./loadrunner.py 192.168.1.254 10

### Caveats:
- Both scripts must be in the same directory
- Minimal error checking.  Uncomment the debug flags in the Casper script to troubleshoot
- The Casper threads are prone to failing periodically.  Not sure why this is.
