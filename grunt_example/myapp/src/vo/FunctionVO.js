define( function( require, exports, module){
	return function(func, args, context){
	    this.func = func;
	    this.args = args;
	    this.context = context;
	};
})