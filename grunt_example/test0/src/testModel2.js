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

	setTimeout( function(){
		// use和requre一致，数据共享
		seajs.use('./Model', function(info) {
	    	console.log("load model.");
	    	for(var i in info.userinfo){
				console.log(i+"____"+info.userinfo[i]);
			}
		});
	},1000);
	
});