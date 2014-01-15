define( function( require, module, exports ){
	var clsCreator 		= require("../core/class");
	var Event = require("./Event");
	var VideoEvent = clsCreator.create("VideoEvent", Event);

	VideoEvent.VIDEO_PLAY = "video_play";
	VideoEvent.VIDEO_PAUSE = "video_pause";
	VideoEvent.VIDEO_SEEK = "video_seek";
	
	VideoEvent.VIDEO_TIME_UPDATE = "video_time_update";

	VideoEvent.prototype.initialize = function( type, data){
		this.type = type;
		this.data = data;
	}
	return VideoEvent;
});