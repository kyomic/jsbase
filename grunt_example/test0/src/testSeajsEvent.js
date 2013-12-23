/**

resolve       -- 将 id 解析成为 uri 时触发
load          -- 开始加载文件时触发
fetch         -- 具体获取某个 uri 时触发
request       -- 发送请求时触发
define         -- 执行 define 方法时触发
exec         -- 执行 module.factory 时触发
config         -- 调用 seajs.config 时触发
error          -- 加载脚本文件出现 404 或其他错误时触发

*/

define(function(require,exports,module){
	seajs.on("resolve", function(data) {
		console.log("onresole:", data );
	});
	seajs.on("request", function(data) {
		console.log("onrequest:", data );
	});

	seajs.on("define", function( data ){
		console.log("onDefine:", data );
	})
	seajs.on("exec", function( data ){
		console.log("onExec:", data );
	});
	seajs.on("error", function( data){
		console.log("onError:", data)
	});

	seajs.on("load", function(data){
		console.log("onLoad:", data);
	})
	seajs.on("request", function(data){
		console.log("onrequest:", data)
	})
	console.log("user model.js")

	//setTimeout( function(){
		var model = seajs.use("./Model");
	//},1000);

	//var model2 = require("./ccc");

	//console.log("Model", seajs.Module);

	seajs.on("a", function(data){
		console.log("onEmmit", data)
	})
	seajs.emit("exec",{a:1});

	
});