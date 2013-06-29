var casper = require('casper').create({
    // verbose: true,
    logLevel: "debug"
});

casper.start('https://1.1.1.2/tmui/login.jsp', function() {
  this.fill('form[name="loginform"]', 
        { 
            username: 'admin', 
            passwd: 'admin'
        }, true);
});

casper.then(function() {
    this.open('https://1.1.1.2/tmui/Control/jspmap/tmui/locallb/virtual_server/create.jsp');
    this.withFrame('contentframe', function() {
        casper.wait(1000, function() {});
        this.then(function() {this.capture('f5.png', {top: 0,left: 0,width: 800,height: 800});}); 
        this.fill('form[name="myform"]', 
            { 
                name: randomVsName(), 
                destination_address_input_vs: randomIP(),
                port: '80'
            }
            // true
        );
        this.click('input[type="submit"][name="finished"]');
    });
});



// casper.then(function() {this.capture('f5.png', {top: 0,left: 0,width: 1000,height: 1000});}); 

casper.run(function() {
    this.echo('ran and hopefully it worked');
    this.exit();
});

function randomIP() {
    return Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255) 
    + '.' + Math.round(Math.random()*255);
}

function randomVsName()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        text += "_vs";
    return text;
}