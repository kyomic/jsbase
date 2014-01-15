define( function( require, module, exports ){
	var Interface =  function(){
		//定义接口名
		this.name = "IMediaPlayer";
		//定义接口列表
		this.interface = {
			play: function( time /*单位秒*/ ){}, 
			pause: function(){},
			seek:function(){},
			resume:function(){},
			setVolume:function(volume /*0~5间的值*/){},
		};
		this.listInterfaceName = function(){
			var res = [];
			for(var i in this.interface ){
				res.push(i);
			}
			return res.join(",");
		};
	}
	return Interface;
})