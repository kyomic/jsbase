define( function( require, module, exports ){
	var DOMUtil = {
		isDOMReady:function()
		{	
			var doc = window.document;
			if((typeof doc.readyState != "undefined" && doc.readyState == "complete") ||((doc.getElementsByTagName("body")[0] || doc.body)))
			{
				return true;
			}
			return false;
		},
		registry:function()
		{
			var timer;
			var isReady = DOMUtil.isDOMReady();
			var onReady = function(e)
			{
				e = JSEvent.getEvent(e);
				isReady = DOMUtil.isDOMReady();
				JSEvent.removeDOMListener(document, "DOMContentLoaded", onReady);
				JSEvent.removeDOMListener(document, "readystatechange", onReady);
				//JSEvent.trigger(document, "domready", e);
				if(document.attachEvent)
				{
					if ((/loaded|complete/).test(document.readyState))
					{
						if(timer)
						{
							clearInterval(timer);
							timer = 0;
						}
						JSEvent.trigger(document, "domready");
					};
				}else
				{
					JSEvent.trigger(document, "domready");
				}
			}
			if(isReady)
			{
				onReady();
			}else
			{
				JSEvent.addDOMListener(document, "DOMContentLoaded", onReady);
				JSEvent.addDOMListener(document, "readystatechange", onReady);
				if(document.attachEvent){
					if (window == window.top) {
						timer = setInterval(function() {
							try {
								isReady || document.documentElement.doScroll('left'); //在IE下用能否执行doScroll判断 dom是否加载完毕
							} catch(e) {
								return;
							}
							onReady();
						},5);
					}
				}
			}
		},
		create:function(type, id) {
			var dom = document.createElement(type);
			if (id)dom.setAttribute("id", id);
			return dom;
		},
		remove:function(id)
		{
			var dom = DOMUtil.getDOM(id);
			if(dom && dom.parentNode)
			{
				try{
					dom.parentNode.removeChild(dom);
				}catch(e)
				{
				}
			}
		},
		contains:function(root, el) {
			if (root.compareDocumentPosition)
				return root === el || !!(root.compareDocumentPosition(el) & 16);
			if (root.contains && el.nodeType === 1){
				return root.contains(el) && root !== el;
			}
			while ((el = el.parentNode))
				if (el === root) return true;
			return false;
		},
		getDOM:function(id) {
			if(!id) return undefined;
			if (typeof id != "string") {
				//throw new Error(" DOMProxy.getDOM 需要字符串做为参数!");
				if(DOMUtil.isDOM(id))
				{
					return id;
				}else
				{
					return undefined;
				}
			}
			return document.getElementById(id);
		},
		getCompatDoc:function()
		{
			var doc = document;
			var html = document.documentElement || doc.getElementsByTagName('html')[0];
			return (!doc.compatMode || doc.compatMode == 'CSS1Compat') ? doc : doc.body;
		},
		getComputedStyle:function(dom, style)
		{
			dom = DOMUtil.getDOM(dom);
			if(!dom) return null;
			if (dom.currentStyle) return dom.currentStyle[Strings.camelCase(style)];
			var defaultView = DOMUtil.getCompatDoc().defaultView;
			var computed = defaultView ? defaultView.getComputedStyle(dom, null) : null;
			return (computed) ? computed.getPropertyValue(style) : null;
		},
		isDOM:function(obj) {
			if (typeof obj != "object") {
				return false;
			}
			if (obj.appendChild) {
				return true;
			} else {
				return false;
			}
		},
		get:function()
		{
		},
		getElementsByClassName:function(cls, tag, context)
		{
			var doc = context || window.document;
			if(doc)
			{
				var getElementsByClass = doc.getElementsByClassName;
				if(!getElementsByClass)
				{
					getElementsByClass = function( cls )
					{
						cls = cls.replace(/\-/g, "\\-");
						var ele = doc.getElementsByTagName(tag || "*");
						var reg = new RegExp("(^|\\s)" + cls + "(\\s|$)");
						var i = 0;
						var len = ele.length;
						var res = [];
						for(i = 0; i < len; i ++ )
						{
							 if(reg.test(ele.className )) res.push( ele );
						}
						return ele;
					}
				}
				if(!doc.getElementsByClassName)
				{
					if(doc.querySelectorAll){
						return doc.querySelectorAll((tag ? tag : '') + '.' + cls);
					}
					else{
						doc.getElementsByClassName = getElementsByClass;
					}
				}
				return doc.getElementsByClassName( cls );
			}
			return [];
		},
		setAlpha:function(o,alp){
			if(Utils.isIE()){
				o.style.filter = "alpha(opacity='"+alp+"')";
			}else{
				o.style.opacity = Math.floor(alp/10)/10;
			}
		},
		getAlpha:function(dom)
		{
			dom = DOMUtil.getDOM(dom);
			if(dom)
			{
				if(dom.style.opacity != null)
				{
					return dom.style.opacity || DOMUtil.getComputedStyle(dom, 'opacity');
				}else if(dom.style.filter != null)
				{
					var filter = (dom.style.filter || DOMUtil.getComputedStyle('filter'));
					var opacity;
					if(filter)
					{
						opacity = filter.match(/alpha\(opacity=([\d.]+)\)/i);
						if(opacity)
						{
							return (opacity[1] / 100);
						}
					}
				}
			}
			return 1;
		},
		fix2Number:function(str)
		{
			if(typeof str=="number") return parseFloat( str ) || 0;
			if(str && str.indexOf("px")!=-1)
			{
				return parseFloat(str.split("px")[0])||0;
			}
			return 0;
		},
		setStyle:function(dom, att, val){
			dom = DOMUtil.getDOM(dom);
			if(!dom) return null;
			var reg = /^(?:width|height|top|left|right|bottom|margin|padding)/i;
			if(reg.test(att))
			{
				val += 'px';
			}
			if(typeof att=="string")
			{
				dom.style[att] = val;
			}else if(typeof att=="object")
			{
				var arr = [];
				for(var i in att)
				{
					val = att[i];
					if(reg.test(i))
					{
						val += 'px';
					}
					arr.push(i + ':' + val);
				}
				dom.style["cssText"] = arr.join(";");
			}
		},
		getStyle:function(dom, style)
		{
			dom = DOMUtil.getDOM(dom);
			if(!dom) return null;
			if(style == 'alpha' || style == 'opacity') return DOMUtil.getAlpha(dom);
			if(style == 'cssFloat' || style == 'styleFloat' || style == 'float')
			{
				if(dom.style.cssFloat != null){
					style = 'cssFloat';
				}else if(dom.style.styleFloat != null)
				{
					style = 'styleFloat';
				}
			}
			Log.log(dom.style.cssFloat);
			//style = style == 'float' ? 'cssFloat' : 'styleFloat';
			var value = dom.style[style];
			
			if(!value || value=="auto")
			{
				value = DOMUtil.getComputedStyle(dom, style);
			}
			//alert("styleValue=="+value+",style="+style);
			//IE,Opera的宽度
			//alert(Runtime.UA);
			if((Runtime.browser == "ie" && isNaN(Number(value))) || Runtime.browser == "opera")
			{
				if ((/^(height|width)$/).test(style)){
					var values = (style == 'width') ? ['left', 'right'] : ['top', 'bottom'], size = 0;
					var v;
					if( values.each){
						values.each(function(value){
							v = DOMUtil.getStyle(dom, 'border-' + value + '-width');
							size += this.getStyle().toInt() + DOMUtil.getStyle(dom, 'padding-' + value).toInt();
						}, this);
					}
					//return this['offset' + property.capitalize()] - size + 'px';
				}
			}
			return value;
		},
		addStyleSheet:function(cssCode, doc)
		{
			if(!+"\v1"){//增加自动转换透明度功能，用户只需输入W3C的透明样式，它会自动转换成IE的透明滤镜
				var t = cssCode.match(/opacity:(\d?\.\d+);/);
				if(t!= null){
					cssCode = cssCode.replace(t[0], "filter:alpha(opacity="+ parseFloat(t[1]) * 100+")")
				}
			}
			if(!doc) doc = document;
			cssCode = cssCode + "\n";
			var headElement = doc.getElementsByTagName("head")[0]; 
			var styleElements = headElement.getElementsByTagName("style"); 
			if(styleElements.length == 0){//如果不存在style元素则创建
				if(doc.createStyleSheet){    //ie
					doc.createStyleSheet();
				}else{
					var tempStyleElement = doc.createElement('style');//w3c
					tempStyleElement.setAttribute("type", "text/css");
					headElement.appendChild(tempStyleElement);
				}
			}
			var styleElement = headElement.getElementsByTagName("style")[0];

			var media = styleElement.getAttribute("media");
			if(media != null && !/screen/.test(media.toLowerCase()) ){
				styleElement.setAttribute("media","screen");
			}
			if(styleElement.styleSheet){    //ie
				styleElement.styleSheet.cssText += cssCode;
			}else if(doc.getBoxObjectFor){
				styleElement.innerHTML += cssCode;//火狐支持直接innerHTML添加样式表字串
			}else{
				styleElement.appendChild(doc.createTextNode(cssCode))
			} 
		},
		getClass:function(ele) {
			return ele.className.replace(/\s+/,' ').split(' ');
		},
		hasClass:function(ele,cls) {
			return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
		},
		addClass:function(ele,cls) {
			if (!this.hasClass(ele,cls)) ele.className += " "+cls;
		},
		removeClass: function(ele,cls) {
			if (hasClass(ele,cls)) {
				var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
				ele.className=ele.className.replace(reg,' ');
			} 
		}
	}
	return DOMUtil;
})