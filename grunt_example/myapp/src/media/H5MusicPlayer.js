define(function(require, exports, module){
	var jquery = require("jquery");
	var log			= require("../log/log");

	var clsCreator 	= require("../core/class");
	var VideoEvent 	= require("../event/VideoEvent");
	var EventDispatcher = require("../core/EventDispatcher");
	var IMediaPlayer= require("../interface/IMediaPlayer");

	var player = clsCreator.create("H5MusicPlayer", EventDispatcher );
	player.implements( new IMediaPlayer() );

	var self = null;
	var options = {
		url:""
	};
	

	player.prototype.getOptions = function(){
		return options;
	};
	//------------------------------------------public api------------------------------
	//重载父类的方法
	player.prototype.play = function(){
	   	log.log("H5MusicPlayer.play:", arguments);
	   	//调用父类的接口

	   	var arg0 = arguments[0];
	   	if( typeof arg0 == "string" ){
	   		this.audio.setAttribute("src", arg0);
	   		this.audio.play();
	   	}else{
	   		this.audio.play();
	   	}
	};
	player.prototype.pause =function(){
		this.audio.pause();
	};

	player.prototype.getTime = function(){
		return this.audio.currentTime;
	};
	player.prototype.getDuration = function(){
		return this.audio.duration;
	};

	//------------------------------------------public api------------------------------
	player.prototype.initialize = function( parent , opt ){
		self = this;
		options = jquery.extend(options, opt);
		this.audio = document.createElement("audio");
	   	configEvent();
	};

	var onAudioEvent =function(evt){
		log.log(evt.type);
		if( evt.type == "durationchange"){
			log.log("duration=" + self.audio.duration );
		}
		switch( evt.type ){
			case "play":
				self.dispatchEvent( new VideoEvent( VideoEvent.VIDEO_PLAY ));
				break;
			case "timeupdate":
				self.dispatchEvent( new VideoEvent( VideoEvent.VIDEO_TIME_UPDATE, self.getTime()));
				break;
		}
	};
	var configEvent = function(){
		self.audio.addEventListener("loadstart", onAudioEvent, false );//客户端开始请求数据 
		self.audio.addEventListener("progress", onAudioEvent, false );//客户端正在请求数据 
		self.audio.addEventListener("suspend", onAudioEvent, false );//延迟下载 
		self.audio.addEventListener("abort", onAudioEvent, false ); //客户端主动终止下载（不是因为错误引起）， 
		self.audio.addEventListener("error", onAudioEvent, false );//请求数据时遇到错误 
		self.audio.addEventListener("stalled", onAudioEvent, false );//网速失速 
		self.audio.addEventListener("play", onAudioEvent, false );//play()和autoplay开始播放时触发 
		self.audio.addEventListener("pause", onAudioEvent, false );  //pause()触发 
		self.audio.addEventListener("loadedmetadata", onAudioEvent, false );//成功获取资源长度 
		self.audio.addEventListener("loadeddata", onAudioEvent, false );//
		self.audio.addEventListener("waiting", onAudioEvent, false ); //等待数据，并非错误 
		self.audio.addEventListener("playing", onAudioEvent, false );//开始回放 
		self.audio.addEventListener("canplay", onAudioEvent, false ); //可以播放，但中途可能因为加载而暂停 
		self.audio.addEventListener("canplaythrough", onAudioEvent, false );//可以播放，歌曲全部加载完毕 
		self.audio.addEventListener("seeking", onAudioEvent, false );//寻找中 
		self.audio.addEventListener("seeked", onAudioEvent, false );//寻找完毕 
		self.audio.addEventListener("timeupdate", onAudioEvent, false );//播放时间改变 
		self.audio.addEventListener("ended", onAudioEvent, false );//播放结束
		self.audio.addEventListener("ratechange", onAudioEvent, false );//播放速率改变 
		self.audio.addEventListener("durationchange", onAudioEvent, false );//资源长度改变 
		self.audio.addEventListener("volumechange", onAudioEvent, false );	//音量改变 
		self.audio.addEventListener("", onAudioEvent, false );
	};
	return player;
})