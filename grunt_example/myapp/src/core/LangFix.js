/**
	解决不同浏览器对ECMA-262标准实现不一致引起的兼容性问题
*/
define( function( require, exports, module){
	
	/**
	 * 对数组中的每一项执行测试函数，直到获得对指定的函数返回 false 的项。
	 */
	Array.prototype.every = Array.prototype.every || function(fun, context){
	    var len = this.length >>> 0;
	    for (var i = 0; i < len; i++){
	      if (!fun.call(context, this[i], i, this)){
	          return false;
	      }
	    }
	    return true;
	};
	/**
	 * 对数组中的每一项执行测试函数，并构造一个新数组，其中的所有项都对指定的函数返回 true。
	 */
	Array.prototype.filter = Array.prototype.filter || function( fun, context ){
	    var values = [];
	    var fun = fun;
	    var context = context || null;
	    var len = this.length >>> 0;
	    for (var i = 0; i < len; i++){
	        if (fun.call(context, this[i], i, this)){
	            values.push(this[i]);
	        }
	    }
	    return values;
	};
	/**
	 * 对数组中的每一项执行函数。
	 */
	Array.prototype.each = Array.prototype.forEach = Array.prototype.forEach || function( fun, context ){
	    var len = this.length >>> 0;
	    for (var i = 0; i < len; i++){
	      fun.call(context, this[i], i, this);
	    }
	};
	/**
		//IE8不支持 Array.prototype.indexOf
	 * 使用 strict equality (===) 运算符搜索数组中的项，并返回该项的索引位置。
	 */
	Array.prototype.indexOf = Array.prototype.indexOf || function( item, fromIndex ){
	    var len = this.length >>> 0;
	    var i = fromIndex ? fromIndex :0;
	    for( ;i<len; i++){
	        if( item === this[i]){
	            return i;
	        }
	    }
	    return -1;
	};
	/**
	 * 对数组中的每一项执行函数并构造一个新数组，其中包含与原始数组中的每一项的函数结果相对应的项。
	 */
	Array.prototype.map = Array.prototype.map || function( fun, context ){
	    var len = this.length >>> 0;
	    var values = [];
	    for(var i=0;i<len;i++){
	        values.push( fun.call(context, this[i], i, this ) );
	    }
	    return values;
	};
	/**
	 * 对数组中的每一项执行测试函数，直到获得返回 true 的项。
	 */
	Array.prototype.some = Array.prototype.some || function( fun, context ){
	    var len = this.length >>> 0;
	    for (var i = 0; i < len; i++){
	      if(fun.call(context, this[i], i, this)){
	          return true;
	      };
	    }
	    return false;
	};
});