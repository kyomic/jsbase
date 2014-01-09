define("TestMain", [ "./media/VideoPlayer", "./core/class", "./media/MediaPlayer", "./core/EventDispatcher", "./log/log" ], function(require, exports, module) {
    var mediaplayer = require("./media/VideoPlayer");
    var media = new mediaplayer();
    media.play();
    console.log(media);
});

define("media/VideoPlayer", [ "core/class", "media/MediaPlayer", "core/EventDispatcher", "log/log" ], function(require, exports, module) {
    var clsCreator = require("core/class");
    var parentClass = require("media/MediaPlayer");
    var player = clsCreator.create("VideoPlayer", parentClass);
    player.prototype.initialize = function() {};
    //重载父类的方法
    player.override("play", function() {
        console.log("VideoPlayer.play:", arguments);
        //调用父类的接口
        this.super0().play();
    });
    return player;
});

define("core/class", [], function(require, exports, module) {
    /**
 * Class创建器，支持多继承。只有第一父类采用 prototype继承，后续父类采用属性拷贝的方式。（可以参见create函数）
 *
 * obj.initialize() 对象的构造器，对象创建时，会自己执行此方法
 *
 * obj.className 对象的类名
 * obj.superClasses  对象的父类定义（可以拥用多个父类）
 * obj.super0() 对象的父类的引用 Creator.create的第二个参数
 * obj.instanceof(target)  判断对象是否为target的子类
 *
 * @author kyomic
 * @mail:kyomic@163.com
 * version:1.1
 *
 */
    var Creator = function() {
        if (arguments.callee == Creator) {
            throw new Error("静态类 Creator 不允许被构造.");
        }
        arguments.callee.create = function() {
            var arg = arguments;
            var superClasses = [];
            //重载对象数组
            var overrideList = [];
            var thisClass = function() {
                var super0 = thisClass.prototype.superClasses || [];
                var i = 0;
                var len = super0.length;
                //Log.log("super.length="+len);
                this.pid = this.className + "[" + Math.floor(Math.random() * 1e4) + "]";
                this.pid = "" + Math.floor(Math.random() * 1e4) + "";
                for (i = 0; i < len; i++) {
                    if (typeof super0[i] == "function") {
                        //Log.log("super0=="+super0[i]);
                        //super0[i].apply(this,arguments);
                        if (super0[i].prototype.initialize) {
                            super0[i].prototype.initialize.apply(this, arguments);
                        } else {
                            super0[i].apply(this, arguments);
                        }
                    }
                }
                //单例,则不执行thisClass的 initialize构造
                //if( typeof thisClass.getInstance != "function"){
                if (this.initialize) this.initialize.apply(this, arguments);
                //}
                //thisClass.prototype.pid = this.pid;
                //console.log(this+"...........pid="+ this.pid);
                //console.log(thisClass.prototype);
                //删除this中被重载的属性，将新的属性写入prototye
                var att, val;
                var i = 0;
                len = overrideList.length;
                for (i = 0; i < len; i++) {
                    att = overrideList[i].att;
                    val = overrideList[i].val;
                    delete this[att];
                    if (!arguments.callee.prototype.hasOwnProperty(att)) {}
                    arguments.callee.prototype[att] = val;
                }
            };
            if (arg.length < 1) {
                throw new Error("Creator 构造至少需要两个参数.");
            } else {
                var cls = null;
                for (var i = 1; i < arg.length; i++) {
                    cls = arg[i];
                    if (typeof cls == "function") {
                        superClasses.push(cls);
                        if (i > 1) {
                            //对于多个父类...怎么处理呢,进行属性拷贝吧。
                            for (var item in cls.prototype) {
                                thisClass.prototype[item] = cls.prototype[item];
                            }
                        } else {
                            var tmpF = new Function();
                            tmpF.prototype = new cls();
                            thisClass.prototype = new tmpF();
                            thisClass.prototype.constructor = thisClass;
                        }
                    }
                }
                /**
             *
             * 注意，重载后，会删除thisClass中的动态创建的属性，将新的属性值写入prototype
             * @param att
             * @param fun
             */
                thisClass.override = function(att, fun) {
                    overrideList.push({
                        att: att,
                        val: fun
                    });
                };
                thisClass.prototype.toString = function() {
                    return "[ object " + this.className + " ]";
                };
                thisClass.prototype.super0 = function() {
                    var s = superClasses || [];
                    if (s && s.length > 0) {
                        return new s[0]();
                    }
                    return this;
                };
                thisClass.prototype.instanceof0 = function(parent) {
                    var s = thisClass.prototype.superClasses || [];
                    for (var i = 0; i < s.length; i++) {
                        if (s[i] == parent) return true;
                        if (s[i] && s[i].instanceof0) {
                            if (s[i].instanceof0(parent)) return true;
                        }
                    }
                    return false;
                };
                thisClass.prototype.superClasses = superClasses;
                thisClass.prototype.className = arg[0];
            }
            return thisClass;
        };
        return arguments.callee;
    }();
    return Creator;
});

define("media/MediaPlayer", [ "core/class", "core/EventDispatcher", "log/log" ], function(require, exports, module) {
    /**
	*	媒体播放器基类
	*/
    var clsCreator = require("core/class");
    var EventDispatcher = require("core/EventDispatcher");
    var log = require("log/log");
    var cls = clsCreator.create("MediaPlayer", EventDispatcher);
    cls.prototype.initialize = function() {
        this.play = function(time) {
            log.log(" mediaplayer.play:", arguments);
        }, this.pause = function() {
            log.log(" mediaplayer.pause:", arguments);
        }, this.resume = function() {
            log.log(" mediaplayer.resume:", arguments);
        }, this.seek = function(time) {
            log.log(" mediaplayer.seek:", arguments);
        }, this.stop = function() {
            log.log(" mediaplayer.stop:", arguments);
        };
    };
    return cls;
});

define("core/EventDispatcher", [], function(require, exports, module) {
    var dispatcher = function() {
        var cache = {};
        this.addEventListener = function(type, fun) {
            if (!type || !fun || typeof fun != "function") throw new Error("*** Error:" + this + ".addEventListener arguments error. ***");
            if (!cache[type]) {
                cache[type] = {
                    type: type
                };
            }
            if (!cache[type].fun) {
                cache[type].fun = [];
            }
            cache[type].fun.push(fun);
        };
        this.removeEventListener = function(type, fun) {
            if (fun && typeof fun != "function") throw new Error("*** Error:" + this + ".removeEventListener arguments error. ***");
            if (!type) {
                //remove all listener
                cache = {};
                return;
            }
            if (cache[type]) {
                if (cache[type].fun) {
                    for (var i = 0; i < cache[type].fun.length; i++) {
                        if (cache[type].fun[i] == fun) {
                            cache[type].fun.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    // remove type listener
                    cache[type] = null;
                }
            }
        };
        this.dispatchEvent = function(evt) {
            if (!evt || !evt instanceof Event) throw new Error("*** Error:" + this + ".dispatchEvent arguments error. ***");
            var funs = null;
            var type = evt.type;
            evt.target = this;
            if (cache[type]) {
                funs = cache[type].fun;
            }
            if (funs) {
                for (var i = 0; i < funs.length; i++) {
                    try {
                        funs[i].call(this, evt);
                    } catch (e) {}
                }
            }
        };
        this.hasListener = function(type) {
            if (!type) throw new Error("*** Error:" + this + ".hasListener arguments error. ***");
            return cache[type] == null || cache[type] == undefined;
        };
        this.getListeners = function(type) {
            if (!type) throw new Error("*** Error:" + this + ".getListeners arguments error. ***");
            return cache[type] ? cache[type].funs || [] : [];
        };
        this.removeAllEvent = function() {
            cache = {};
        };
        this.destroy = function() {
            this.removeAllEvent();
        };
    };
    return dispatcher;
});

define("log/log", [], function(require, exports, module) {
    exports.log = function() {
        if (window.console && window.console.log) {
            window.console.log.apply(window.console, arguments);
        }
    };
});
