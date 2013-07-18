BigIPLoadTest
=============

Simple load testing script to make sure we're not oversubscribed on our Viprion at Agility. The loadrunner.py script manages threading and spawns Casper scripts that performs the logins and clicks.

### Requirements
- If you run more than 10 clients, you must change a setting on BIG-IP.  System -> Prefereces -> (Advanced) -> Maximum HTTP Connections To Configuration Utility = > # of clients.
- [CasperJS](http://casperjs.org/installation.html).   Homebrew and apt make this easy. 
- [PhantomJS](http://phantomjs.org).  If a package for CasperJS is not available for your platform, you'll need to install this manually as CasperJS depends on it.

### Usage
./loadrunner.py [mgmt IP] [num clients]

### Example: 
    ./loadrunner.py 192.168.1.254 10

### Caveats:
- Tested on OSX 10.8 with no issues.  Use Homebrew and you're golden.  Ubtunu server required manual install of PhantomJS and CasperJS as I was too lazy to find an apt repo that had them.  Windows, probably breaks with path issues.
- Both scripts must be in the same directory.
- It could take a few minutes to run. See below.
- Minimal error checking.  Uncomment the debug flags in the Casper script to troubleshoot.
- The Casper threads are prone to failing periodically.  Not sure why this is.

### Preliminary Results
- Viprion 2400 w/ 1 blade handled 60 clients without any noticeable GUI lag or CPU spike
