define(function(require) {
	/*require("seajs-text");

  // 获取文本内容
  var tpl = require('./data.tpl');
  console.log(tpl);*/

  /*console.log("config seajs.");
  seajs.config({
  	base: './',
  	preload: ["../seajs/seajs-text/1.0.3/seajs-text"],
  	map: [
		    [".js", ".js?" + new Date().getTime()]
		  ]
  })*/

	
  	/*
  	这么写，会先加载data.tpl.js
  	seajs.use("seajs-text", function(data){
  		console.log("onUse:", data);
  		require('./data.tpl');
  	})*/
   
   var a = seajs.create("./src/Model", function( data){
   		console.log("name="+data.userinfo.name);
   		data.userinfo.name = "aaa";
   		console.log( "after modify:name=" + data.userinfo.name );
   });


   setTimeout( function(){
   		var a = seajs.create("./src/Model", function( data){
	   		console.log("name="+data.userinfo.name);
	   		data.userinfo.name = "aaa";
	   		console.log( "after modify:name=" + data.userinfo.name );
	   });
   },1000)
});