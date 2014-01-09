define("TestMain", [ "./media/VideoPlayer", "./core/class", "./media/MediaPlayer", "./core/EventDispatcher", "./log/log" ], function(require, exports, module) {
    var mediaplayer = require("./media/VideoPlayer");
    var media = new mediaplayer();
    media.play();
    console.log(media);
});