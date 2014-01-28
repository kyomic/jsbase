define( function( require, module, exports){
	var SWF = require("./util/SWF");

	var SWFLog = require("./util/SWFLog");

	var Ajax = require("./net/Ajax");
	/*var s = new SWF("Loger.swf");
	var onSWFEvent = function(e){
		console.log(e);
	}
	s.addEventListener( "ready", onSWFEvent );
	s.addEventListener( "error", onSWFEvent );
	s.call("log","1111");
	s.call("a");*/
	var s = new SWFLog();
	s.log("sfsdfdf", 2);


	var a = new Ajax();
	var onAjaxEvent = function(evt){
		console.log(a)
		console.log("onAjaxEvent:" , evt);
	}
	a.addEventListener("complete", onAjaxEvent);
	a.addEventListener("error", onAjaxEvent);
	var URLRequest = require("./net/URLRequest");
	a.script = true;

	var re = new URLRequest("http://www");
	re.url = "http://abc.ku6.com/jsbase/grunt_example/myapp/swf_test.html?dev";
	re.url = "http://v.ku6.com/special/show_6588122/DwM2XWaG0uJpUcwjEFAKVA...html";
	re.url = "http://v.ku6.com/fetchVideo4Player/EAEUjDKsPi3VUhBg.html";
	//a.get( re );
	//a.get( new URLRequest(""));
	
	//a.get( new URLRequest(""));


	/*
	var jQuery = require("jquery");
	jQuery.getScript( "http://v.ku6.com/fetchVideo4Player/EAEUjDKsPi3VUhBg.html", function( data, textStatus, jqxhr ) {
		console.log( data ); // Data returned
		console.log( textStatus ); // Success
		console.log( jqxhr.status ); // 200
		console.log( "Load was performed." );
		});*/
	/*var jQuery = require("jquery");
	jQuery.getJSON("http://v.ku6.com/fetchVideo4Player/EAEUjDKsPi3VUhBg.html", function(){
		console.log(arguments);
	})*/
	
})