define( function( require, module, exports ){
	var Event = function( type, data ){
		this.type = type;
		this.data = data;
		this.target = undefined;
		this.toString = function(){
			return "[ Event type='" + this.type + "' data='" + this.data + "' target='" + this.target + "' ]";
		};
		this.clone = function(){
			var c = new Event( this.type, this.data );
			c.target = this.target;
			return c;
		}
	};
	Event.INIT = "init";
	return Event;
});