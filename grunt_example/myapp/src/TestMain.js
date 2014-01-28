define(function(require, exports, module) {
	var Log			= require("./log/Log");
	var VideoEvent 	= require("./event/VideoEvent");
	var Event 		= require("./event/Event");
	var H5MusicPlayer = require("./media/H5MusicPlayer");

	var jQuery 		= require("jquery");

	var media = new H5MusicPlayer();

	Log.log("addEvent................");

	var formatTime = function( n ){

	}
	var onVideoEvent = function( evt ){
		switch( evt.type ){
			case VideoEvent.VIDEO_TIME_UPDATE:
				jQuery("a[data-name='media-control-time']").text( evt.data );
				break;
		}
	};

	jQuery.each(
		[
		VideoEvent.VIDEO_PLAY,
		VideoEvent.VIDEO_TIME_UPDATE
		], 
		function(index, val) {
			media.addEventListener( val, onVideoEvent);
	});
	
	jQuery.each(["play", "pause"], function(index, val) {
		var domName = "media-control-" + val;
		jQuery("a[data-name='" + domName + "']").click(function(event) {
			switch( val ){
				case "play":
					media.play();
					break;
				case "pause":
					media.pause();
					break;
			}	
		});
	});

	media.play("http://freshly-ground.com/data/audio/sm2/water-drop.mp3");

	

	Log.log(media)


	//var loadex = require("./LoadMp3Example");
	//loadex.init2();



	//console.log("media=", media);

	//var uicls = require("./core/KUI");
	//var ui = new uicls( );
	
	/*var db;

	try {
	    if (window.openDatabase) {
	        db = openDatabase("NoteTest", "1.0", "HTML5 Database API example", 200000);
	        if (!db){
	        	alert("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
	        }
	        else{
	        	Log.log("create db success!");
	        }
	            
	    } else
	        alert("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
	} catch(err) { 
		alert( err );
	}*/
});