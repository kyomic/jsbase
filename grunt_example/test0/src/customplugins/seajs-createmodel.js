define(function(requre, exports,module){
	var global = window;
	console.log("...createmodel is initialized.")
	seajs.on("resolve", function(data) {
		//data.uri = Math.random() + "";
		console.log("onResolve:")
		console.log(data);

		console.log("module=")
		console.log( module)
		/*var uri = seajs.resolve(data.id, data.refUri);
		data.uri = uri+"?random=" + Math.random();
		console.log(seajs.Module)
		console.log(seajs.Module.get)
		seajs.Module.get(data.uri);
		console.log(uri);*/
	});
	seajs.on("request", function(data) {
		
	    var name = data.uri;
	    if (name) {
	      xhr(data.requestUri, function(content) {
	       //plugins[name].exec(data.uri, content)

	        data.onRequest()
	      })

	      data.requested = true
	    }
  	})
	seajs.create = function (ids, callback, uri) {

	  var mod = Module.get(uri, isArray(ids) ? ids : [ids])

	  mod.callback = function() {
	    var exports = []
	    var uris = mod.resolve()

	    for (var i = 0, len = uris.length; i < len; i++) {
	      exports[i] = cachedMods[uris[i]].exec()
	    }

	    if (callback) {
	      callback.apply(global, exports)
	    }

	    delete mod.callback
	  }

	  mod.load()
	}

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