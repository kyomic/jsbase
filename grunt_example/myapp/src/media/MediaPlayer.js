define(function(require, exports, module) {
	/**
	*	媒体播放器基类
	*/

	var clsCreator 		= require("../core/class");
	var EventDispatcher = require("../core/EventDispatcher");
	var log 			= require("../log/log");

	var cls = clsCreator.create("MediaPlayer", EventDispatcher );
	cls.prototype.initialize = function(){
		this.play = function( time /*单位秒*/ ){
			log.log(" mediaplayer.play:", arguments );
		},

		this.pause = function(){
			log.log(" mediaplayer.pause:", arguments );
		},

		this.resume = function(){
			log.log(" mediaplayer.resume:", arguments );
		},

		this.seek = function( time /*单位秒*/ ){
			log.log(" mediaplayer.seek:", arguments );
		},

		this.stop = function(){
			log.log(" mediaplayer.stop:", arguments );
		}
	}
	return cls;
});