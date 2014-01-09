define("log/log", [], function(require, exports, module) {
    exports.log = function() {
        if (window.console && window.console.log) {
            window.console.log.apply(window.console, arguments);
        }
    };
});