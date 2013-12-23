define( function( require,exports,module ){
	exports.userinfo = {
		name:"A",
		age:111
	}

	var User = function(){
		this.name = "A1";
		this.age = 2222;
	};
	exports.userinfo = new User();
})