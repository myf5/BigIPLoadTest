// Edit these for your environment
var username = 'admin';
var password = 'admin';
var bigip_ip = '1.1.1.2';


// Store the virtual server  name as a global to check for successful creation
var vs_name = randomString();

// debug options
var casper = require('casper').create({
    // verbose: true,
    logLevel: "debug"

});


// Open login page, fill out form and submit.
casper.start('https://' + bigip_ip + '/tmui/login.jsp', function() {
    // this.echo('login url is: ' + login_url);
  this.fill('form[name="loginform"]', 
        { 
            username: username, 
            passwd: password
        }, true);
});

// casper.then(function() {this.capture('f5.png', {top: 0,left: 0,width: 1000,height: 1000});});
// Wait for welcome page to load before continuing 
casper.then(function() {
    this.waitUntilVisible('#mainpanel', function(){});
});


// Create a virtual server
casper.then(function() {
    this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/locallb/virtual_server/create.jsp');
    this.withFrame('contentframe', function() {
        // casper.wait(1000, function() {});
        this.waitUntilVisible('#div_resources_table', function(){
            this.fill('form[name="myform"]', 
                { 
                    description: 'automated virtual server creation',
                    name: vs_name, 
                    destination_address_input_vs: randomIP(),
                    port: '80',

                    // These don't work for some reason?
                    // httpprofile: 'http',
                    // source_address_translation_type: 'Auto Map',
                    // selectedclientsslprofiles: 'clientssl'

                }
                // Dont submit the form here, send explicit click action below
                // true
            );
            this.click('input[type="submit"][name="finished"]');
        });
    });
});


// Create a node 
casper.then(function() {
    this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/locallb/node/create.jsp');
    this.withFrame('contentframe', function() {
        this.waitUntilVisible('#content', function(){
            this.fill('form[name="myform"]', 
                { 
                    description: 'automated node creation',
                    name: vs_name + "_node", 
                    addr: randomIP(),

                }
                // Dont submit the form here, send explicit click action below
                // true
            );
            this.click('input[type="submit"][name="finished"]');
        });
    });
});

// Take screencap.  For some reason this helps the VS creation success more often
// casper.then(function() {this.capture('f5.png', {top: 0,left: 0,width: 1000,height: 1000});}); 

// Run the script
casper.run(function() {
    this.echo('ran and hopefully it worked');
    this.exit();
});


//
// Helper functions
// 

// Generate a Random IP
function randomIP() {
    return Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255);
}

// Generate a random string to be used for the vs and node names
function randomString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        text += "_vs";
    return text;
}