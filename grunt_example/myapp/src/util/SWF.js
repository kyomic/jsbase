/**
*	Event:
	ready swf准备好
	error swf异常，包括接口调用异常
*/
define( function( require, module, exports){
	var Creator			= require("../core/Class");
	var EventDispatcher = require("../core/EventDispatcher");
	var Event 			= require("../event/Event");
	var SWFObject       = require("./SWFObject");
	var DOMUtil			= require("./DOMUtil");

	var Log 			= require("../log/Log");
	var LazyFunction	= require("../util/LazyFunction");
	var FunctionVO		= require("../vo/FunctionVO");

	var SWF = Creator.create("SWF", EventDispatcher);
	SWF.instanceNums = 0;
	SWF.prototype.initialize = function(src, dom, flashvars, params) {
	    var root = DOMUtil.getDOM(dom) || window.document.body;
	    var id = "SWF_" + (new Date().getTime()) + "" + parseInt(Math.random() * 10000);
	    var swfobject = null;
	    var src = src;
	    var flashvars = flashvars || {};
	    var params = params||{};
	    var appname = "app_" + this.pid;
	    var that = this;
	    var callback = [];
	    var lazyCall = new LazyFunction();

	    var eventCache = {};
	    //匿名函数ID
	    var anonymousFun = {};
	    var isReady = false;
	    if( SWF.instanceNums > 50 ){
	        throw new Error("SWF 实例个数不可以超过50个，这会造成性能问题. ");
	    }else{
	        SWF.instanceNums += 1;
	    }
	    Log.log(appname);
	    window[appname] = this;
	    var create = function() {
	        swfobject = new SWFObject(src + "?rnd" + Math.random(), id, params["width"] || 10, params["height"]||10, "9", "#ffffff");
	        swfobject.addParam("wmode", "transparent");
	        //so.addParam("wmode","Opaque windowless");
	        swfobject.addParam("allowScriptAccess", "always");
	        swfobject.addParam("allowNetworking", "all");
	        swfobject.addVariable("key", "");
	        swfobject.addVariable("callbackContext", appname);
	        swfobject.addVariable("callbackInit", "onSWFInit");
	        var domid = "swfcontainer_" + appname;
	        var dom = DOMUtil.create("div", domid);
	        root.appendChild(dom);
	        swfobject.write(domid);
	    };

	    this.getSWF = function() {
	        if (swfobject) {
	            return swfobject.getSWF();
	        }
	        return null;
	    };

	    this.call = function() {
	    	console.log("isReady="+ isReady)
	        if (!isReady) {
	        	lazyCall.push( new FunctionVO( this.call, arguments, this ));
	            //callback.push({"funs": this.call, "args":arguments });
	            return;
	        }
	        var obj = this.getSWF();

	        if (!obj) {
	            this.dispatchEvent(new Event("error", "SWF还未准备好,请侦听ready事件再操作."));
	            return null;
	        }
	        var arr = Array.prototype.slice.call(arguments);

	        var fun = arr[0];
	        var res = null;
	        if (fun) {
	            if (isReady) {
	                if (typeof obj[fun] != "undefined") {
	                    try {
	                    	//ie 7/8必须要设定第二个参数(bug?)
	                        var args = arr.splice(1, arr.length-1);
	                        res = obj[fun].apply(obj, args);
	                    } catch(e) {
	                    	console.log("SWFLog.call:"+e);
	                        this.dispatchEvent(new Event("error", e));
	                    }
	                } else {
	                    this.dispatchEvent(new Event("error", arr[0] + "不是函数."));
	                }
	            } else {
	                this.dispatchEvent(new Event("error", "SWF还未准备好,请侦听ready事件再操作."));
	            }
	        }
	        return res;
	    };
	    this.onSWFInit = function() {
	        isReady = true;
	        this.dispatchEvent(new Event("ready"));
	        lazyCall.exec();
	        /*return;
	        var i,data;
	        for (i = 0; i < callback.length; i++) {
	            try {
	                data = callback[i] || {};
	                console.log("func===="+data["funs"]+",args===="+data["args"]);
	                data["funs"].apply(this, data["args"]);
	           } catch(e) {	            	
	           		console.log("SWFLog.onSWFInit:" + (e ? e.description: e.toString()));
	                this.dispatchEvent(new Event("error", e));
	           }
	        }*/
	    };
	    /**
	     *    Protected function onSWFCall
	     *    保护形方法, Flash准备好时会回调此函数 (不建议在外部调用)
	     *
	     *    @param evt:Event
	     *    @param data:addSWFCallback中的 args数据
	     *    @param anonymousId:匿名函数id
	     */
	    this.onSWFCall = function(evt, data, anonymousId) {
	        var context = false;
	        //TODO
	        //这个context判断性能不太好
	        for (var i in this) {
	            if (this[i] == anonymousFun[anonymousId]) {
	                context = true;
	                break;
	            }
	        }
	        if (anonymousId && anonymousFun[anonymousId]) {
	            anonymousFun[anonymousId].apply(context ? this : null, [evt, data]);
	        }
	    };
	    this.addSWFListener = function(type, handler, args) {
	    	//alert("addSWFE...."+",isReady=" + isReady)
	        if (! isReady) {
	            //callback.push({"funs": this.addSWFListener, "args":arguments });
	            lazyCall.push( new FunctionVO( this.addSWFListener, arguments, this ));
	            return;
	        }
	        if( ! eventCache[type] ){
	        	eventCache[type] = [];
	        }
	        //alert("indexof="+Array.prototype.indexOf);
	        if( eventCache[type].indexOf( handler ) == -1 ){
	        	//alert("addSWFEvent.")
	        	eventCache[type].push( handler );
	        	//add new function
	        	var id = "f_" + Math.random() * 100000;
	        	anonymousFun[id] = handler;
	        	this.getSWF().addSWFListener(type, "onSWFCall", args, id);

	        }
	        return;
	        var id = "f_" + Math.random() * 100000;
	        if (!anonymousFun[id]) {
	            anonymousFun[id] = handler;
	        }
	        this.getSWF().addSWFListener(type, "onSWFCall", args, id);
	    };
	    create();
	}
	return SWF;
});