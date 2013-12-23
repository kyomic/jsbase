define("application/dist/application-debug", [ "./util-debug" ], function(require, exports, module) {
    var util = require("./util-debug");
    var helloSeaJS = document.getElementById("hello-seajs");
    helloSeaJS.style.color = util.randomColor();
    window.setInterval(function() {
        helloSeaJS.style.color = util.randomColor();
    }, 1500);
});