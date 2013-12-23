define( function(require,exports,module){
	var info = require("./Model");
	console.log("id=="+info.id+",this.id="+module.id);
	console.log( module );
	for(var i in info.userinfo){
		console.log(i+"____"+info.userinfo[i]);
	}
	info.userinfo.name = "kyomic";
	console.log("after modify.");
	for(var i in info.userinfo){
		console.log(i+"____"+info.userinfo[i]);
	}

	
	require.async('./Model', function(info) {
		console.log(info);
	    console.log("load model.");
	    for(var i in info.userinfo){
			console.log(i+"____"+info.userinfo[i]);
		}
	});
	
});