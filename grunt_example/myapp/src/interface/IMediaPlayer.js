define(function(require, module, exports) {
	var MediaPlayState = require("../static/MediaPlayState");
	var Interface = function() {
		//定义接口名
		this.name = "IMediaPlayer";
		//定义接口列表
		this.interface = {
			preload:function(){},
			play: function(time /*单位秒*/ ) {},
			pause: function() {},
			seek: function() {},
			resume: function() {},
			stop:function(){},

			mute:function( mute /* Boolean类型　*/){},
			isMuted:function(){},
			setVolume: function(volume /*0~5间的值*/ ) {},
			getVolume:function(){},

			//媒体播放状态
			state: MediaPlayState.PENDING,
			getBytesLoaded:function(){},
			getBytesTotal:function(){},
			getLoadPercent:function(){},
		};
		this.listInterfaceName = function() {
			var res = [];
			for (var i in this.interface) {
				res.push(i);
			}
			return res.join(",");
		};
	};
	return Interface;
})