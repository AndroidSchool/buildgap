var width = 320;
var height = 160;
var webpage = require('webpage');

page = webpage.create();
page.viewportSize = {width: width, height: height};

address = phantom.args[0];
output = phantom.args[1];

page.open(address, function(status) {
    console.log(status);
    page.evaluate(function(w, h) {
      document.body.style.width = w + "px";
      document.body.style.height = h + "px";
    }, width, height);
    page.clipRect = {top: 0, left: 0, width: width, height: height};                                                                                                                           
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 500);
});
