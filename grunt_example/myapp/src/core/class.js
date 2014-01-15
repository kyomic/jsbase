define(function(require, exports, module) {
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
            this.pid = this.className + "[" + Math.floor(Math.random() * 10000) + "]";
            this.pid = "" + Math.floor(Math.random() * 10000) + "";

            for (i = 0; i < len; i++) {
                if (typeof super0[i] == "function") {
                    //Log.log("super0=="+super0[i]);
                    //super0[i].apply(this,arguments);
                    if (super0[i].prototype.initialize) {
                        super0[i].prototype.initialize.apply(this, arguments);
                        //Log.log(this+"  ------>init.");
                    } else {
                        super0[i].apply(this, arguments);
                    }
                }
            }

            //单例,则不执行thisClass的 initialize构造
            //if( typeof thisClass.getInstance != "function"){
            if (this.initialize) this.initialize.apply(this, arguments);
            if( thisClass.__impl ){
                for(var i in thisClass.__impl.interface){
                    var val = thisClass.__impl.interface[i];
                    if( !this[i] || typeof val!= typeof this[i]){
                        throw new Error(""+ this.className +"类中未实现接口" + thisClass.__impl.name +"中方法:"+ i);
                    }
                }
                this.impl = thisClass.__impl.listInterfaceName();
            }
            //}


            //thisClass.prototype.pid = this.pid;
            //console.log(this+"...........pid="+ this.pid);
            //console.log(thisClass.prototype);
            //删除this中被重载的属性，将新的属性写入prototye
            var att,val;
            var i = 0;
            len = overrideList.length;
            for (i = 0; i < len; i++) {
                att = overrideList[i].att;
                val = overrideList[i].val;
                delete this[att];
                if( !arguments.callee.prototype.hasOwnProperty(att)){
                //    throw new Error(this+"'parent don't has attribute:" + att +",can't override attribute:" +att );
                }
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
            ;
            thisClass.implements = function( impl ){
                thisClass.__impl = impl;
            };
            /**
             *
             * 注意，重载后，会删除thisClass中的动态创建的属性，将新的属性值写入prototype
             * @param att
             * @param fun
             */
            thisClass.override = function(att, fun) {
                overrideList.push({"att":att,"val":fun});
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
                    if (s[i] == parent)return true;
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
    }
    return arguments.callee;
}();

return Creator;

})