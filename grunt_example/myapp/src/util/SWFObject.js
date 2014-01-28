define( function( require, module, exports){
	var DOMUtil = require("./DOMUtil");
	var SWFObject = function(u, id, w, h, v, c) {
		this.params = {};
		this.variables = {};
		this.url = u;
		this.id = id;
		this.addParam = function(name, val) {
			this.params[name] = val;
		};
		this.getParam = function(name) {
			return this.params[name];
		};
		this.addVariable = function(name, val) {
			this.variables[name] = val;
		};
		this.getVariable = function() {
			var arr = [];
			for (var ele in this.variables) {
				arr.push(ele + "=" + this.variables[ele]);
			}
			return arr;
		};
		this.write = function(id) {
			var o = DOMUtil.getDOM(id);
			var html = '';
			var flashvars = this.getVariable();
			if (flashvars.length > 0) {
				flashvars = flashvars.join("&");
			}
			if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
				this.addParam("name", this.id);
				this.addParam("id", this.id);
				this.addParam("src", this.url);
				this.addParam("flashvars", flashvars);
				this.addParam("type", "application/x-shockwave-flash");
				html += '<embed ';
				for (var i in this.params) {
					html += i + '="' + this.params[i] + '" ';
				}
				html += '/>';
			} else {
				html += '<object id="' + this.id + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + this.getParam("width") + '" height="' + this.getParam("height") + '" type="application/x-shockwave-flash">';
				html += '<param name="movie" value="' + this.url + '" />';
				for (var i in this.params) {
					html += '<param name="' + i + '"value="' + this.params[i] + '" />';
				}
				html += '<param name="flashvars" value="' + flashvars + '" />';
			}
			o.innerHTML = html;
		};
		this.getSWF = function(){
			return document.getElementById( this.id );
		};
		if (typeof w != "undefined") {
			this.addParam("width", w);
		}
		if (typeof h != "undefined") {
			this.addParam("height", h);
		}
	};
	return SWFObject;
});