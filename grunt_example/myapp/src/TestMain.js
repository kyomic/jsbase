define(function(require, exports, module) {
	var Log			= require("./log/Log");
	var VideoEvent 	= require("./event/VideoEvent");
	var Event 		= require("./event/Event");
	var H5MusicPlayer = require("./media/H5MusicPlayer");

	var jQuery 		= require("jquery");

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

	Log.log(media)
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