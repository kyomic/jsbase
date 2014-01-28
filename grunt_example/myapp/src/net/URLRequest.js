define( function(require, exports, module ){
	/**
	 *	URL请求对象,用于描述Http请求信息
	 *
	 *	@param url: 请求的服务器地址
	 *	@param method: 请求的类型
	 *	@param data: 请求参数信息
	 *	@param head: 请求头信息
	 *
	*/
	function URLRequest(url,method,data, blob){
		if( !url || url.indexOf("http://")==-1 ){
			throw new Error("*** Error: URLRequest 构造出错, 无效的URL ***");
		}
		this.url = url;
		this.method = method||"get";
		this.data = data;
		this.blob = blob || null;
		if(this.data)
		{
			var u = [];
			if(this.url.indexOf("?")==-1)
			{
				u.push(this.url + "?");
			}
			else
			{
				u.push(this.url + "&");
			}
			for(var item in this.data)
			{
				u.push(item + "=" + this.data[item] + "&");
			}
			this.url = u.join("");
		}

		this.getParams = function( att ){
			var reg = new RegExp("[&\\?]" + att + "=([^&\\?]+)","ig");
			if( att ){
				var arr = reg.exec( this.url );
				if( arr && arr.length>=2){
					return arr[1];
				}
			}
			return "";
		}
	}
	return URLRequest;
})