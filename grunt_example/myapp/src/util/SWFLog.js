/**
*	Flash调试输出，前提是安装了Adobe Air平台的 Alcon软件，通过Alcon软件打印日志。
*	@see:http://blog.hexagonstar.com/downloads/alcon/
*	@example
*	var log = new SWFLog();
*	log.log("hello world.");
*/
define( function( require, exports, module ){
	var Creator			= require("../core/Class");
	var EventDispatcher	 = require("../core/EventDispatcher");	
	var SWF 			 = require("./SWF");

	var SWFLog = Creator.create("SWFLog", EventDispatcher);
	SWFLog.prototype.initialize = function(){
		var swf = new SWF("Loger.swf");
		var self = this;
		var onSWFEvent = function( evt ){
			console.log(evt);
			self.dispatchEvent( evt.clone() );
		}

		var onFlashEvent = function( evt, customData ){
			console.log( "onFlashEvent:", evt , customData );
		}

		swf.onTest = function(evt){
			alert(this)
			console.log( "onFlashEvent2:", evt );
		}
		swf.addEventListener("ready", onSWFEvent);
		swf.addEventListener("error", onSWFEvent);

		swf.addSWFListener("test", onFlashEvent, {a:1} );
		//swf.addSWFListener("test", swf.onTest);

		this.log = function(){
			var arr = Array.prototype.slice.call( arguments );
			arr.unshift( "log" );
			swf.call.apply( swf, arr );
		};
	};
	return SWFLog;
})