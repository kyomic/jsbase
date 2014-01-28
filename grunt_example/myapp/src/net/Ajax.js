define(function(require, exports, module) {
	var Creator = require("../core/Class");
	var EventDispatcher = require("../core/EventDispatcher");
	var URLRequest = require("./URLRequest");
	var Event = require("../event/Event");


	var Log = require("../log/Log");
	var Ajax = Creator.create("Ajax", EventDispatcher);

	Ajax.prototype.initialize = function() {
		var that = this;
		var TIME_OUT = 30 * 60 * 1000; //30Minute timeout
		//请求JS时用的DOM
		var scriptobj = null;
		var xmlobj = null;
		var request = null;
		var timeout;
		var xmlhead = {};
		//异步处理
		this.async = true;
		this.script = false;
		this.request = null;
		this.uuid = Math.random() * 100000;
		this.get = function(req, timeout) {
			if(!(req instanceof URLRequest) ){
				throw new Error("参数错误.");
			}
			if (typeof timeout != "undefined" && timeout > 0) {
				TIME_OUT = timeout;
			}
			if (this.xmlobj) {
				this.close();
			}
			request = req;
			if (!request) {
				throw new Error("*** Error:" + this + ".get: URLRequest is null ***");
			}
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			} catch (e) {
				//alert("Permission UniversalBrowserRead denied."); 
			}
			if (this.script) {
				sendScriptRequest();
			} else {
				sendXMLRequest();
			}
		}

		this.setRequestHeader = function(headType, headValue) {
			xmlhead[headType] = headValue;
		};
		this.close = function() {
			if (this.script) {
				if (scriptobj) {
					scriptobj.onload = scriptobj.onreadystatechange = null;
					var head = document.getElementsByTagName("head")[0];
					try {
						head.removeChild(scriptobj);
						scriptobj = null;
					} catch (e) {

					}
				}
			} else {
				if (xmlobj) {

					xmlobj.onreadystatechange = function() {};
					try {
						xmlobj.abort();
					} catch (e) {}
					xmlobj = null;
				}
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
			}
		}
		var sendXMLRequest = function() {
			if (xmlobj) {
				that.close();
			}
			if (!xmlobj) {
				xmlobj = Ajax.createXMLHttpRequest();
			}
			//异步方式

			xmlobj.onreadystatechange = function() {
				Log.log(this+"state change:xmlobj.readyState="+xmlobj.readyState+",status="+xmlobj.status);
				if (xmlobj.readyState == 4) {
					var status = "";
					try {
						status = xmlobj.status;
					} catch (e) {}
					Log.log("state change:xmlobj.status=" + status);
					//document.getElementById("user1").innerHTML="数据正在加载...";
					var data = {
						status: xmlobj.status,
						content: xmlobj.responseText
					}
					if (timeout) {
						clearTimeout(timeout);
						timeout = undefined;
					}
					that.data = data;
					if (status == 200) {
						that.dispatchEvent(new Event("complete", data));
					} else {
						that.dispatchEvent(new Event("error", data));
					}
					that.close();
				}
			}
			//true表示异步,false表示同步 
			xmlobj.open(request.method, request.url, that.async);
			//xmlobj.setRequestHeader("Accept-Charset", "utf-8");
			if (that.async) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = undefined;
				}
				var timeouthandler = function(xmlobj) {
					var status = "";
					var responseText = "";
					try {
						if (xmlobj) {
							status = xmlobj.status;
							responseText = xmlobj.responseText;
						}
					} catch (e) {
						//Log.log("*** Error:"+e +" ***");
					}
					var data = {
						status: status,
						content: responseText
					}
					that.data = data;
					Log.log("status==" + status);
					if (status == 200) {
						this.dispatchEvent(new Event("complete", data));
					} else {
						//Log.log(this.dispatchEvent);
						this.dispatchEvent(new Event("error", data));
					}
					this.close();
				}
				timeout = setTimeout(function() {
					timeouthandler.apply(that);
				}, TIME_OUT, xmlobj);
			}
			//Log.log("Ajax."+request.method+",url="+request.url);
			for (headType in xmlhead) {
				xmlobj.setRequestHeader(headType, xmlhead[headType]);
			}
			if( request.blob ){
				xmlobj.send(request.blob);
			}else{
				xmlobj.send(null);
			}
			
		}

		var onAjaxTimeout = function() {
			alert("this==" + this);
		}

		var sendScriptRequest = function() {
			var head = document.getElementsByTagName("head")[0];
			if (!scriptobj) {
				scriptobj = document.createElement("script");
			}
			if (that.charset) {
				scriptobj.charset = that.charset;
			}
			Log.log("Ajax." + request.method + ",url=" + request.url);
			//log.log( "callback=="+ request.getParams("callback") );
			scriptobj.src = request.url;
			scriptobj.onload = scriptobj.onreadystatechange = function(arg) {
				console.log(scriptobj.innerHTML)
				Log.log("onreadystatechange");
				if (!scriptobj.readyState || scriptobj.readyState == "loaded" || scriptobj.readyState == "complete") {
					var val = request.getParams("callback") || request.getParams("cb");
					var data = {
						status: 0
					};
					if (val) {
						data.status = 200;
						data.content = window[val];
					}
					that.dispatchEvent(new Event("complete", data));
					try {
						//head.removeChild(scriptobj);
						scriptobj = null;
					} catch (e) {}
				}
			};
			head.appendChild(scriptobj);
		};
	}
	Ajax.createXMLHttpRequest = function() {
		var xmlHttp;
		if (window.ActiveXObject) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e1) {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			}
		} else if (window.XMLHttpRequest) {
			xmlHttp = new XMLHttpRequest();
		}
		if (!xmlHttp) {
			throw new Error("Error:Ajax Cant't create XMLHttp Object!");
		}
		return xmlHttp;
	};
	return Ajax;
})