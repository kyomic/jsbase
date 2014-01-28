(function(doc){
    var u;
    var debug = location.href.indexOf('debug') > 0 ? true:false;
    var logger = function(){
        if( !debug ) return;
        if( !u ){
            u = document.createElement("div");
            doc.body.appendChild(u);
        }
        var arr = Array.prototype.slice.call(arguments);
        u.innerHTML += arr.join(",") + "<br>";
        if( window.console ){
            console.log(arguments);
        }
    }
    if( typeof window.logger == "undefined"){
        window.logger = logger;
    }
    logger("init log");
})(document);
(function(win, doc){

//var html5 = location.search.indexOf('ipad') > 0 || /ip(?=od|ad|hone)/i.test(navigator.userAgent),
var ua = navigator.userAgent,
    ie = /msie/i.test(ua) || (/rv:11.0/.test(ua) && /Trident\/7.0/.test(ua)),
html5 = location.search.indexOf('ipad') > 0 || /ip(?=od|ad|hone)/i.test(ua) || /SGP341/i.test(ua) ||/AppleWebKit.*Mobile/i.test(ua) ||/AppleWebKit.*Mobile/i.test(ua) || /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE|Mobi|UCWEB|MQQBrowser|Mini|Nexus|UC/.test(ua) || (ua == 'Mozilla/5.0 (X11; U; Linux i686; zh-CN; rv:1.2.3.4) Gecko/'),
	Element = function (el) {
		return {
			data : function (name, value) {
				name = 'data-' + name;
				return value !== undefined ?
						el.setAttribute(name, value) :
						el.getAttribute(name);
			}
		};
	},
	
	$time = function () {
		return (+new Date).toString(36);
	},
	
	$ = function (el) {
		return new Element(typeof el == 'string' ? doc.id(el) : el);
	},

    log = location.href.indexOf('debug') > 0 ? function (msg) {console.log(msg);} : function () {},
	
	scripts = doc.getElementsByTagName('script'),
	script = $(scripts[scripts.length - 1]),
	
	vars = script.data('params') || '',
	options = {},
    // 播放器类型，默认为0:点播, 1直播, 2,伪直播（暂不支持)
    playerType = script.data('live') === "1" ? 1:0,
	width = script.data('width') || 414,
	height = script.data('height') || 305,
    preload = script.data('preload'),
    swf = script.data('player'),
	vid = script.data('vid'),
    version = script.data('ver') || 'IPD',
	id = script.data('id') || ('ku6_player' + $time()),
    holder = script.data('holder'),
    Status = { uninit : -1, init : 0, paused : 1, playing : 2, ended : 3},
    notavalid = 'N/A',
    // HTML5 attributes
    properties = {
        width: width,
        height: height,
        id: id
    },
    property,
	html,
	Player,
    guid,
    binds,
    // FlashObject params
    params,
    // vars的object形式
    flashvars,
     // 支持不设置param-vid播点播视频
    metchvid = /http:\/\/player\.ku6\.com\/\w+\/([^\/]+)\/v\.swf/.exec(swf),
    // GSLB重试服务器
    gslbServers = [],
    param;
    for (var i = 21; i < 32; i++) {
        gslbServers.push("122.11.32." + i);
    };
    if( metchvid && metchvid[1] && !vid){
        vid = metchvid[1];
    }
    flashvars = (/^[\?\&]?(.+)/).exec(vars)[1];
    var arr = flashvars.split("&");
    var kvtmp;
    flashvars = {};
    for(var i=0;i<arr.length;i++){
        kvtmp = (arr[i]+"").split("=");
        if( kvtmp[0]){
            flashvars[kvtmp[0]] = kvtmp[1] || "";
        }
    }
    
    mobile = html5;
    window.logger("playerType:" + playerType);
    window.logger(ua);
    ua = ua.toLowerCase();
    if(ua.indexOf('android') > -1 || ua.indexOf('adr') > -1){
        //rua = 'android';
        // android下的直播都采用flash
        mobile = true;
        if( playerType == 1){
            html5 = false;
        }
    }
    window.logger("html5:"+html5);
    //html5 = false;
if (html5) {
    guid = function () {
        function rt(n) {
            var i = 0, s = '';
            for (; i < n; i++){
                s += (Math.random()*15|0).toString(16);
            }
            return s;
        }
        return [rt(8), rt(4), rt(4), rt(4), Date.now().toString(16).substr(-8) + rt(4)].join('-');
    };
    binds = function(self, names){
        var i = 0, name;
        for (; name = names[i]; i++){
            self[name] = (function(fn){
                return function(){
                    if (arguments.length) return fn.apply(self, arguments);
                    return fn.call(self);
                };
            })(self[name]);
        }
	};
	Player = function (vid, id, options) {
        this.init.call(this, vid, id, options);
	};
	Player.prototype = {

        init: function (vid, id, options) {
            var self = this,
                domready = 'DOMContentLoaded';
            self.vid = vid;
            self.id = id;
            self.options = options;
            self.trycount = 0;
            self.maxtry = options.maxtry || 3;
            //只重连一次
            self.isReconnect = false;
            self.timeout = options.timeout || 10000;
            self.uuid = 'uuid=' + guid();
            self.ref = 'ref=' + encodeURIComponent(location.href);
            self.ver = ['ver=', ' 0.1.1'].join(options.ver);
            self.url = 'http://st.vq.ku6.cn/vq/';
            self.state = Status.uninit;//-1 未初始化 0 初始化 1暂停 2正在播放 3 播放完毕

            binds(self, ['retry', 'report', 'canplay', 'play', 'iView', 'vView', 'cView']);

            win.addEventListener(
                domready, 
                function () {
                    self.observe();
                    win.removeEventListener(domready, arguments.callee, false);
                    self.showTips("正在载入影片...", true);
                }, 
                false
            );            
        },

        getPosition: function (element) {
            if (element.getPosition) {
                return element.getPosition();
            }
            var position = { x:0, y:0 },
                compute = doc.defaultView.getComputedStyle,
                computed;

            while (element && element != doc.body){
                position.x += element.offsetLeft;
                position.y += element.offsetTop;

                if (element != this){
                    computed = compute( element, null);
                    position.x += parseInt(computed.getPropertyValue('border-left-width'));
                    position.y += parseInt(computed.getPropertyValue('border-top-width'));
                }

                element = element.offsetParent;
            }

            return position;
        },
        
        showTips: function ( tipinfo, force) {
            var self = this,
                video = self.video,
                tips,
                pos;

            if (!force && (self.tips !== undefined || !video.poster)) {
                return;
            }
            tips = self.tips;
            if( !tips ){
                tips = doc.createElement('span');
                self.tips = tips;
                doc.body.appendChild(tips);
            }
            pos = self.getPosition(video);
            logger(pos, height);
            tips.style.cssText = 'position:absolute;left:' + ((parseInt(pos.x)||0) + parseInt(width)/2 - 66) + 'px;top:' + ((parseInt(pos.y)||0) + parseInt(height) - 66) + 'px;letter-spacing:1px;color:white;background:rgba(0,0,0,.1);font-size:18px';
            tips.innerHTML = tipinfo;
        },

        hideTips: function () {
            var self = this,
                tips = self.tips;

            if (tips) {
                tips.parentNode.removeChild(tips);
                self.tips = 0;
            }
        },

        clear: function () {
            clearTimeout(this.timer);
        },
        retry: function () {
            
            var self = this,
                video = self.video,
                state = self.state;
            self.clear();
            if(state !== Status.uninit) return;
            self.trycount ++;
            if (self.trycount > self.maxtry) {
                self.showTips("视频无法播放", true);
                return;
            }
            window.logger("retry");
            log('retry url:' + video.currentSrc + ' state:' + state + ' video.paused:' + video.paused);
            var url = self.src;
            var ip = gslbServers[Math.floor(Math.random() * gslbServers.length)]; 
            url = url.replace("main.gslb.ku6.com", ip);
            video.setAttribute('src', url + '&retry=' + self.trycount);
            video.load();
            log('trycount:' + self.trycount);
            self.timer = setTimeout( self.trycount < self.maxtry ? self.retry : self.vView, self.timeout);
        },

        report: function (e) {
            var self = this,
                error = self.video.error,
                code = error && error.code;
            window.logger("onError:", error, code );
            if(!error) return;
            switch (code){
            case 1://MEDIA_ERR_ABORTED,媒体资源获取异常
                break;
            case 2://MEDIA_ERR_NETWORK,网络错误
                self.clear();
                break;
            case 3://MEDIA_ERR_DECODE,媒体解码错误
                break;
            case 4://MEDIA_ERR_SRC_NOT_SUPPORTED,不支持的视频格式
                self.retry();
                break;           
            }
            self.send('play?', ['error=' + (810 + code), 'retry=' + self.trycount, 'utime=' + (+new Date - self.beginTime), 'time=' + notavalid, 'gutime=' + notavalid, 'ksp=' + notavalid, 'hd=1', 'videorate=' + notavalid, 'location=' + notavalid, 'gone=' + notavalid, 'split=' + notavalid, 'drag=' + notavalid, 'fileuid=' + notavalid, 'cid=' + notavalid, 'vvsplit=' + notavalid]);   

        },
        
        canplay: function () {
            var self = this,
                video = self.video;
            if (self.trycount > 0 && video.paused) {
                video.play();
            };
            self.hideTips();
        },

        play: function () {
            var self = this,
                video = self.video;
            self.beginTime = +new Date;
            if (self.state == Status.ended) {
                video.setAttribute('src', video.currentSrc);
                video.play();
                self.state = Status.uninit;
                return;
            }
            //self.showTips();
            self.showTips("正在载入影片...", true);
            self.clear();
            self.timer = setTimeout(self.retry, self.timeout);           
        },
        
        iView: function () {
            var self = this,
                video = self.video;
            self.clear();
            video.removeEventListener('loadstart', self.iView, false);
            self.send('init?', ['flash=iOS Video', self.ref]);
            if (video.getAttribute('preload') || self.options.auto) {
                video.load();
            }
        },

        vView: function (loaded) {
            var self = this,
                video = self.video,
                count = self.trycount,
                code = count;
            if(code) {
                code = loaded ? 0 : (count < self.maxtry ? 800 + count : 850);
            }

            self.state = Status.init;

            if (!!video.duration) {
                self.clear();
                self.send('play?', ['error=' + code, 'retry=' + self.trycount, 'utime=' + (+new Date - self.beginTime), 'time=' + notavalid, 'gutime=' + notavalid, 'ksp=' + notavalid, 'hd=1', 'videorate=' + notavalid, 'location=' + notavalid, 'gone=' + notavalid, 'split=' + notavalid, 'drag=' + notavalid, 'fileuid=' + notavalid, 'cid=' + notavalid, 'vvsplit=' + notavalid]);          
                self.timer = setTimeout(function(){self.cView(0, true)}, self.timeout);
            }
        },

        cView: function (e, force) {
            var self = this,
                video = self.video;
            log('cv:' + self.state + ',force:' + !!force);
            if(self.state != Status.init && !force) return;
            self.state = Status.playing;
            if (!!video.duration ) {
                self.clear();
                self.send('cv?', ['flash=iOS Video', 'split=' + notavalid, 'cid=' + notavalid, self.ref]);
            }            
            self.hideTips();
        },

        send: function (type, params) {
            var self = this,
                src;
            params.push(self.ver);
            params.push('vid=' + self.vid);
            params.push(self.uuid);
            params.push('rnd=' + Date.now().toString(36));
            src = self.url + type + params.join('&');
            new Image().src = src;
            log(src);
        },

        observe: function (remove){
            var self = this,
                opt = self.options,
                video = self.video = doc.getElementById(this.id),
                action = (remove ? 'remove' : 'add') + 'EventListener';
            self.src = video.src;            

            video[action]('error', self.report, false);
            video[action]('loadstart', self.iView, false);
            video[action]('play', self.play, false);
            video[action]('pause', function(){self.state = Status.paused;}, false);
            video[action]('durationchange', function(){log('duration:' + video.duration);self.vView(true)}, false);
            video[action]('canplay', self.canplay, false);
            video[action]('playing', self.cView, false);
            video[action]('ended', function(){self.state = Status.ended;log('ended')}, false);

            if (!remove) {
                if (opt.auto) {
                    video[action]('canplay', function(){video.play();video.removeEventListener('canplay', arguments.callee, false);}, false);
                }
            }
        }
	};
	
	if (vars) {
		vars.split('&').forEach(function (item) {
			item = item.split('=');
			options[item[0]] = item[1];
		});
        options.ver = version;
	}
    if( playerType == 1){
        properties.src = 'http://main.gslb.ku6.com/broadcast/mob?channel=' + flashvars["p"] + '&stype=m3u8';
    }else{
        properties.src = 'http://v.ku6.com/fetchwebm/' + vid + '.m3u8';
    }
    //properties.src = 'http://main.gslb.ku6.com/broadcast/mob.webm';
	if (options.img) {
		properties.poster = options.img;
	}
    if (options.auto) {
        properties.autoplay = true;
    } else if (preload) {
        properties.preload = 'auto';
    }
	
	html = '<video controls autoplay ';
    for (property in properties) html += ' ' + property + '="' + properties[property] + '"';
	html += '></video>';
	new Player(vid, id, options);    
	
} else {
    var v,w,swfPlugin,
    p = 'Shockwave Flash';
    var pluginInstallUrl = "http://www.adobe.com/go/getflashplayer/";
    if( mobile ){
        pluginInstallUrl = "http://hd.ku6.com/static/file/com.adobe.flashplayer_111115081.apk";
    }
    if (ie) {
        try {
            swfPlugin = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swfPlugin) {
                v = swfPlugin.GetVariable("$version").split(" ")[1].replace(/,/, '.').replace(/,/g, '')
            }
        } catch(e) {}
    } else {
        if (navigator.plugins && typeof navigator.plugins[p] == 'object') {
            swfPlugin = navigator.plugins[p].description;
            if (swfPlugin) {
                w = swfPlugin.split(" ");
                for (var i = 0; i < w.length; ++i) {
                    if (isNaN(parseInt(w[i]))) {
                        continue
                    };
                    v = w[i]
                }
            }
        }
    };
    params = {
        quality: 'high',
        allowScriptAccess: script.data('allowscriptaccess') || 'always',
        allowFullScreen: script.data('allowfullscreen') || true,
        wMode: script.data('wmode') || 'transparent',
        swLiveConnect: true,
        bgColor: '#000000'
    };
    if (swf) {
        if (swf.indexOf(vid) < 0 && swf.indexOf('vid') < 0) {           
            vars += '&vid=' + vid;           
        }
    } else {
        swf = 'http://player.ku6.com/refer/' + vid + '/v.swf';
    }
    if( playerType == 1){
        swf = 'http://player.ku6.com/refer/live.swf';
    }
    if( mobile ){
        vars = vars.indexOf("&") == -1 ? (vars+'?volume=1'):(vars+'&volume=1');
    }
    window.logger(vars);
    params.flashvars = vars;
    if (win.ActiveXObject){
        properties.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
        params.movie = swf;
    } else {
        properties.type = 'application/x-shockwave-flash';
        properties.data = swf;
    }
    if (isNaN(parseFloat(v)) || parseFloat(v) < 10 ) {
        html = '<p style="text-align:center;width:'+(width?width+'px':'auto')+';height:'+(height?height+'px':'auto')+'">您没有安装FlashPlayer或者FlashPlayer版本低于10.0.0<br/>为了能够正常观看视频，请您点此,<a href="'+ pluginInstallUrl +'" target="_black">下载最新插件</a></p>';
        //html = '<p style="text-align:center;width:'+(width?width+'px':'auto')+';height:'+(height?height+'px':'auto')+'">\u60A8\u6CA1\u6709\u5B89\u88C5FlashPlayer\u6216\u8005FlashPlayer\u7248\u672C\u4F4E\u4E8E10.0.0<br/>\u4E3A\u4E86\u80FD\u591F\u6B63\u5E38\u89C2\u770B\u89C6\u9891\uFF0C\u8BF7\u60A8\u70B9\u6B64,<a href="http://www.adobe.com/go/getflashplayer/" target="_black">\u4E0B\u8F7D\u6700\u65B0PC\u7248\u672C</a>\uFF0C\u6216\u8005\u8BBF\u95EEAndroid\u5E02\u573A\u4E0B\u8F7D\u6700\u65B0\u7248\u672C</p>';
        window.logger("no support!");
    }else{
        html = '<object style="outline:none" id="' + id + '"';
        for (property in properties) html += ' ' + property + '="' + properties[property] + '"';
        html += '>';
        for (param in params){
            if (params[param]) html += '<param name="' + param + '" value="' + params[param] + '" />';
        }
        html += '</object>';
        window.logger("support!");
    }
    
}
if (holder) {
    holder = doc.getElementById(holder);
    if (holder) {
        return holder.innerHTML = html;
    }
}
doc.write(html);

})(this, document);