define(function(require, exports, module) {
	/**
	*	媒体播放器基类
	*/

	var clsCreator 		= require("../core/class");
	var EventDispatcher = require("../core/EventDispatcher");
	var Log 			= require("../log/Log");

	var cls = clsCreator.create("MediaPlayer", EventDispatcher );
	cls.prototype.initialize = function(){
		var self = this;
		this.play = function( time /*单位秒*/ ){
			Log.log(" mediaplayer.play:", arguments );
		},

		this.pause = function(){
			Log.log(" mediaplayer.pause:", arguments );
		},

		this.resume = function(){
			Log.log(" mediaplayer.resume:", arguments );
		},

		this.seek = function( time /*单位秒*/ ){
			Log.log(" mediaplayer.seek:", arguments );
		},

		this.stop = function(){
			Log.log(" mediaplayer.stop:", arguments );
		}

		this.getVolume = function(){};
		this.setVolume = function( volume /*0~5间的值*/ ){};
	};
	return cls;
});