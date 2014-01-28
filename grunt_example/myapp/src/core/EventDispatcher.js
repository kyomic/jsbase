define(function(require, exports, module) {
	var Event = require("../event/Event");
	var dispatcher = function(){
		var cache = {};
		this.addEventListener = function(type,fun)
		{	
			if(!type || !fun || typeof fun!="function" )throw new Error("*** Error:"+this+".addEventListener arguments error. ***");
			if( !cache[type] )
			{
				cache[type] = { type : type };
			}
			if( !cache[type].fun)
			{
				cache[type].fun = [];
			}
			cache[type].fun.push(fun);
		}
		
		this.removeEventListener = function(type,fun)
		{
			if(fun && typeof fun!="function")throw new Error("*** Error:"+this+".removeEventListener arguments error. ***");
			if(!type)
			{
				//remove all listener
				cache = {};
				return;
			}
			if(cache[type])
			{
				if(cache[type].fun)
				{
					for(var i=0;i<cache[type].fun.length;i++)
					{
						if(cache[type].fun[i]==fun)
						{
							cache[type].fun.splice(i,1);
							break;
						}
					}
				}
				else
				{
					// remove type listener
					cache[type] = null;
				}
			}
		}
		
		this.dispatchEvent = function(evt)
		{
			if(!evt ||(! evt instanceof Event))throw new Error("*** Error:"+this+".dispatchEvent arguments error. ***");
			var funs = null;
			var type = evt.type;
			evt.target = this;
			if(cache[type])
			{
				funs = cache[type].fun;
			}
			if(funs)
			{
				for(var i=0;i<funs.length;i++)
				{
					try
					{
						funs[i].call(this,evt);
						//funs[i](evt);
					}
					catch (e)
					{
					}
				}
			}
		}

		this.hasListener = function(type)
		{
			if(!type)throw new Error("*** Error:"+this+".hasListener arguments error. ***");
			return cache[type]==null||cache[type]==undefined;
		}

		this.getListeners = function(type)
		{
			if(!type)throw new Error("*** Error:"+this+".getListeners arguments error. ***");
			return cache[type]? (cache[type].funs || []) : [];
		}

		this.removeAllEvent = function(){
			cache = {};
		}

		this.destroy = function(){
			this.removeAllEvent();
		}
	}
	return dispatcher;
});