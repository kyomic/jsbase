define(function(require, exports, module) {
	var Log		= require("./log/Log");
	var VideoEvent = require("./event/VideoEvent");
	var Event = require("./event/Event");
	var H5MusicPlayer = require("./media/H5MusicPlayer");

	var jQuery = require("jquery");

	var media = new H5MusicPlayer();

	Log.log("addEvent................");
	media.addEventListener( VideoEvent.VIDEO_PLAY, function(evt){
		Log.log(evt);
	});
	media.addEventListener( VideoEvent.VIDEO_TIME_UPDATE, function(evt){
		jQuery("a[data-name='media-control-time']").text( evt.data )
	});
	media.play("http://freshly-ground.com/data/audio/sm2/water-drop.mp3");

	jQuery("a[data-name='media-control-play']").click(function(event) {
		media.play();
	});
	jQuery("a[data-name='media-control-pause']").click(function(event) {
		media.pause();
	});
	//console.log("media=", media);

	//var uicls = require("./core/KUI");
	//var ui = new uicls( );
	
});