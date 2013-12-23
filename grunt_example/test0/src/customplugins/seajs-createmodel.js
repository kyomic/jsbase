define(function(requre, exports,module){
	var global = window;
	console.log("...createmodel is initialized.")
	seajs.on("resolve", function(data) {
		//data.uri = Math.random() + "";
		console.log("onResolve:")
		console.log(data);
		var uri = seajs.resolve(data.id, data.refUri);
		data.uri = uri+"?random=" + Math.random();
		seajs.Module.get(data.uri);
		console.log(uri);
	});
	seajs.on("request", function(data) {
	    var name = data.uri;
	    if (name) {
	      xhr(data.requestUri+"&rnd="+Math.random(), function(content) {
	       //plugins[name].exec(data.uri, content)

	        data.onRequest()
	      })

	      data.requested = true
	    }
  	})
	seajs.create = function(){
		var arr = Array.prototype.slice.call( arguments );
		return seajs.use.apply( seajs, arr );
	};

	function xhr(url, callback) {
	    var r = global.ActiveXObject ?
	        new global.ActiveXObject("Microsoft.XMLHTTP") :
	        new global.XMLHttpRequest()

	    r.open("GET", url, true)

	    r.onreadystatechange = function() {
	      if (r.readyState === 4) {
	        // Support local file
	        if (r.status > 399 && r.status < 600) {
	          throw new Error("Could not load: " + url + ", status = " + r.status)
	        }
	        else {
	          callback(r.responseText)
	        }
	      }
	    }

	    return r.send(null)
  }


	console.log("seajs.create");
});