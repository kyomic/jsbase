
var c = define({a:"./test"});
alert(c);
define(function(require, exports, module){
	require("./test");

	alert(c);
	console.log("loadtest. run");
	console.log(module.dependencies);
	console.log(require.resolve('./'));
	require.async("test.js?a=1", function(){
		console.log("onloaded.");
		console.log(arguments);
	});

	exports.test = function(){
		console.log("loadtest. test is called.");
	};

	/*
	return {
		test2:function(){
			console.log("loadtest. test2 is called.");
		}
	}
	*/

	var aaa = require("./test");
	aaa = { x:0};
});