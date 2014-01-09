define("TestMain-debug", [ "./media/VideoPlayer-debug", "./core/class-debug", "./media/MediaPlayer-debug", "./core/EventDispatcher-debug", "./log/log-debug" ], function(require, exports, module) {
    var mediaplayer = require("./media/VideoPlayer-debug");
    var media = new mediaplayer();
    media.play();
    console.log(media);
});