define( function( require, exports ,module){
	var Creator = require("../core/Class");
	var LazyFunction = Creator.create("LazyFunction");
	LazyFunction.prototype.initialize = function(){
	    var cache = [];
	    this.push = function( vo /*FunctionVO*/){
	        cache.push( vo );
	    };
	    this.contains = function( fun ){
	        var list = cache.filter( function( item, index, arr){
	            return item === fun;
	        });
	        return list.length > 0;
	    };
	    this.exec = function(){
	        var len = cache.length, i = 0;
	        for(i=0;i<len;i++){
	            cache[i].func.apply( cache[i].context, cache[i].args);
	        }
	        cache = [];
	    };
	};
	return LazyFunction;
})