define( function( require, module, exports ){
	var Creator 		= require("../core/class");
	var MouseEvent = Creator.create("MouseEvent");
	MouseEvent.prototype.initialize = function( type, data , x, y){
		this.type = type;
		this.data = data;
		this.x = (typeof x=="undefined" || !x || isNaN(Number(x)) ) ? 0: x;
		this.y = (typeof y=="undefined" || !y || isNaN(Number(y)) ) ? 0: y;
		this.toString = function(){
			return "[MouseEvent type='" + this.type + "' data='" + this.data + "' target='" + this.target + "' x="+ this.x +" y="+this.y+" ]";
		};
	};
	return MouseEvent;
});