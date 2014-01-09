define(function(require, exports, module){
	var clsCreator 	= require("../core/class");
	var parentClass = require("../media/MediaPlayer");
	var player = clsCreator.create("H5MusicPlayer", parentClass );
	
	player.prototype.initialize = function( parent , options ){

	}
	//重载父类的方法
	player.override("play", function(){
	   	console.log("H5MusicPlayer.play:", arguments);
	   	//调用父类的接口
	   	this.super0().play();
	})
	return player;
})