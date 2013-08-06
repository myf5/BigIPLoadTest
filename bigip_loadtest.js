// debug options. Uncomment these when debugging
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug"
});

// More debugging tools... I think?
// require('utils').dump(casper.steps.map(function(step) {
//     return step.toString();
// }));


var bigip_ip = casper.cli.args[0];

// Edit these for your environment
var username = 'admin';
var password = 'admin';

// Store the virtual server  name as a global to check for successful creation (TODO)
var vs_name = randomString();


// Open login page, fill out form and submit.
casper.start('https://' + bigip_ip + '/tmui/login.jsp', function() {
    // this.echo('login url is: ' + login_url);
  this.fill('form[name="loginform"]', 
        { 
            username: username, 
            passwd: password
        }, true);
});


// Wait for welcome page to load before continuing 
casper.then(function() {
    this.waitUntilVisible('#mainpanel', function(){});
});


// *****************
//
// Create a virtual server
//

// casper.then(function() {
//     this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/locallb/virtual_server/create.jsp');
//     this.withFrame('contentframe', function() {
//         // casper.wait(1000, function() {});
//         this.waitUntilVisible('#div_resources_table', function(){
//             this.fill('form[name="myform"]', 
//                 { 
//                     description: 'automated virtual server creation',
//                     name: vs_name, 
//                     destination_address_input_vs: randomIP(),
//                     port: '80',

//                     // These don't work for some reason?
//                     // httpprofile: 'http',
//                     // source_address_translation_type: 'Auto Map',
//                     // selectedclientsslprofiles: 'clientssl'

//                 }
//                 // Dont auto submit the form here, send explicit click action below
//                 // true
//             );
//             this.click('input[type="submit"][name="finished"]');
//         });
//     });
// });

// // Sleep for a few seconds to let the GUI catch up and be more realistic between clicks
// casper.wait(2500);

// // *****************
// //
// // Create a node 
// //

// casper.then(function() {
//     this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/locallb/node/create.jsp');
//     this.withFrame('contentframe', function() {
//         // Wait for node create page to load before
//         this.waitUntilVisible('#content', function(){
//             this.fill('form[name="myform"]', 
//                 { 
//                     description: 'automated node creation',
//                     name: vs_name + "_node", 
//                     addr: randomIP(),

//                 }
//                 // Dont submit the form here, send explicit click action below
//                 // true
//             );
//             this.click('input[type="submit"][name="finished"]');
//         });
//     });
// });



// *****************
//
// Create an APM policy 
//  DOESNT CURRENTLY WORK

// casper.then(function() {
//     this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/accessctrl/profiles/create.jsp');
//     this.withFrame('contentframe', function() {
//         // Wait for node create page to load before
//         this.waitUntilVisible('#content', function(){
//             this.fill('form[name="myform"]', 
//                 { 
//                     profile_name: vs_name + "_APM_policy", 
//                     // accept_languages: "en",

//                 }
//                 // Dont submit the form here, send explicit click action below
//                 // ,true
//             );
//             // this.click('input[type="submit"][name="finished"]');
//         });
//     });
// });

// *****************
//
// Create a HTTP SSO
//
casper.then(function() {
    this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/accessctrl/ssoconfig/create.jsp?sso_type=1');
    this.withFrame('contentframe', function() {
        // Wait for node create page to load before
        this.waitUntilVisible('#content', function(){
            this.fill('form[name="myform"]', 
                { 
                    name: vs_name + "_SSO", 
                    // accept_languages: "en",

                }
                // Dont submit the form here, send explicit click action below
                // ,true
            );
            this.click('input[type="submit"][name="finished"]');
        });
    });
});



// *****************
//
// Create a HTTP AAA
//
casper.then(function() {
    this.open('https://' + bigip_ip + '/tmui/Control/jspmap/tmui/accessctrl/aaaservers/create.jsp?server_type=4');
    this.withFrame('contentframe', function() {
        // Wait for node create page to load before
        this.waitUntilVisible('#content', function(){
            this.fill('form[name="myform"]', 
                { 
                    name: vs_name + "_HTTP_AAA", 
                    form_action: "/" + vs_name + "_formaction",
                    success_match_value: vs_name + "_logondetect",

                }
                // Dont submit the form here, send explicit click action below
                // ,true
            );
            this.click('input[type="submit"][name="finished"]');
        });
    });
});



// Take screencap.  For some reason this helps the VS creation success more often
// casper.then(function() {this.capture('f5.png', {top: 0,left: 0,width: 1000,height: 1000});}); 

// Run the script
casper.run(function() {
    // this.echo('ran and hopefully it worked');
    this.exit();
});


//*************
//
// Helper functions
// 

// Generate a Random IP
function randomIP() {
    return Math.round(Math.random()*220) 
    + '.' + Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255);
}

// Generate a random string to be used for the vs and node names
function randomString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        text += "_vs";
    return text;
}