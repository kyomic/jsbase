define(function(require, exports, module) {
	var jquery 			= require("jquery");
	var clsCreator 		= require("../core/class");
	var EventDispatcher = require("../core/EventDispatcher");

	var cls = clsCreator.create("KUI", EventDispatcher );
	

	cls.prototype.initialize = function( parent ){
		this._uuid = "";		
		this.container = document.createElement("div");
		
		this.parent = parent ? ( parent.nodeType == 1? parent :document.getElementById(parent)) :document.body;
	};
	cls.prototype.draw = function(){
		console.log("KUI.draw:", arguments);
		try{
			this.parent.appendChild( this.container );
		}catch(ex){};
		this.container.setAttribute("data-uid", this.uuid());
	};
	cls.prototype.uuid = function(){var _uuid;
		if( !_uuid ){
			_uuid = this.className + "_" + this.pid;
		}
		return _uuid;
	};
	cls.prototype.destroy = function(){
		try{
			this.parent.removeChild( this.container );
		}catch(ex){};
	};
	return cls;
});