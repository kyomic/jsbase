define( function(require, module, exports){
	return {
		PENDING:"pending", 			//未准备好状态
		READY:"ready",				//准备好状态
		PRELOADING:"preloading",	//预加载中	
		PLAYING:"playing",			//正在播放中
		PAUSED:"paused",			//暂停中
		STOPED:"stoped",			//停止中
		SUBSPEND:"suspend"			//挂起不工作状态
	};
});