define(function(require, exports, module) {
	exports.log = function(){
		if( window.console && window.console.log && (typeof window.console.log=="function")){
			window.console.log.apply( window.console, arguments);
		}
	}
});