define( function( require, module, exports ){
	var cls = function( type, data ){
		this.type = type;
		this.data = data;
		this.target = undefined;
		this.toString = function(){
			return "[ Event type='" + this.type + "' data='" + this.data + "' target='" + this.target + "' ]";
		}
	};
	cls.INIT = "init";
	return cls;
});