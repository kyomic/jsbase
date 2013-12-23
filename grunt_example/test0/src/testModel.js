define( function(require,exports,module){
	var info = require("./Model");
	for(var i in info.userinfo){
		console.log(i+"____"+info.userinfo[i]);
	}
	info.userinfo.name = "kyomic";
	console.log("after modify.");
	for(var i in info.userinfo){
		console.log(i+"____"+info.userinfo[i]);
	}
	console.log("after reload model");
	var info2 = require("./Model");
	for(var i in info.userinfo){
		console.log(i+"____"+info.userinfo[i]);
	}
});