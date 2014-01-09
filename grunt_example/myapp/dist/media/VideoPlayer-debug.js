define("media/VideoPlayer-debug", [ "../core/class-debug", "../media/MediaPlayer-debug", "../core/EventDispatcher-debug", "../log/log-debug" ], function(require, exports, module) {
    var clsCreator = require("../core/class-debug");
    var parentClass = require("../media/MediaPlayer-debug");
    var player = clsCreator.create("VideoPlayer", parentClass);
    player.prototype.initialize = function() {};
    //重载父类的方法
    player.override("play", function() {
        console.log("VideoPlayer.play:", arguments);
        //调用父类的接口
        this.super0().play();
    });
    return player;
});