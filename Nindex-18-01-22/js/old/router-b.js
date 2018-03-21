"use strict";
var fs = require("fs");
var url = require("url");
var events = require("events");
var util = require("util");
var path = require("path");

var mimes = '...'.split(",");
var ALL_FOLDER_REG = /\/\*\*\//g;
var ALL_FOLDER_REG_STR = '/([\\w._-]*\/)*';　　//匹配XXX/XXX/XX/
var ALL_FILES_REG = /\*+/g;
var ALL_FILES_REG_STR = '[\\w._-]+';　　//匹配XX
var noop = function () {};

var Router = function (arg) {
    this.methods = {};

    if ((typeof arg == "object") && !(arg instanceof Array)) {
        this.maps = arg;
    } else if (typeof arg == "string") {
        try {
            var json = fs.readFileSync(arg).toString();
            this.maps = eval('(' + json + ')');
        } catch (e) {
            console.log(e);
            this.maps = {};
        }
    } else {
        this.maps = {};
    }

    this.handleMaps();
};

//继承事件类
util.inherits(Router, events.EventEmitter);

var rp = Router.prototype;

rp.constructor = Router;
rp.handleMaps = function () {
    this.filters = [];  //存放路由地址
    this.address = [];  //存放目标地址

    for (var k in this.maps) {
        var fil = trim(k);
        var ad = trim(this.maps[k]);

        fil = fil.charAt(0) == "/" ? fil : ("/" + fil);

        ad = ad.replace(ALL_FOLDER_REG, '__A__').replace(ALL_FILES_REG, '__B__');
        fil = fil.replace(/\?/g , "\\?").replace(ALL_FOLDER_REG, '__A__').replace(ALL_FILES_REG, '__B__');

        this.filters.push(fil);
        this.address.push(ad);
    }
};
rp.set = function (name, func) {
    if (!name)return;

    this.methods[name] = (func instanceof Function) ? func : noop;
};
rp.route = function (req, res) {
    var urlobj = url.parse(req.url);
    var pathname = urlobj.pathname;

    var i = 0;
    var match = false;
    var fil;

    for (; i < this.filters.length; i++) {
        fil = this.filters[i];
        var reg = new RegExp("^" + fil.replace(/__A__/g, ALL_FOLDER_REG_STR).replace(/__B__/g, ALL_FILES_REG_STR) + "$");

        if (reg.test(fil.indexOf("?") >= 0 ? (pathname = urlobj.path) : pathname)) {
            match = true;
            break;
        }
    }

    if (match) {
        var ad = this.address[i];
        var array = ad.split(':' , 2);

        if(array[0] === "url"){
            //如果是url则查找相应url的文件
            var filepath = getpath(fil , array[1] , pathname);

            this.emit("match", filepath , pathname);

            this.routeTo(res , filepath);
        }else if(array[0] === "func" && (array[1] in this.methods)){
            //如果是func则执行保存在methods里的方法
            this.methods[array[1]].call(this , req , res , pathname);
        }else {
            throw new Error("route Error");
        }
    }else {
        this.emit("notmatch");

        this.error(res);
    }
};
function getpath(fil , ad , pathname){
    var filepath = ad;
    if(/__(A|B)__/g.test(fil) && /__(A|B)__/g.test(ad)){
        var ay = fil.split("__");
        var dy = ad.split("__");

        var index = 0;
        for(var k=0;k<ay.length;k++){
            if(!ay[k]) continue;

            var reg;
            if (ay[k] === 'A' || ay[k] === 'B') {
                reg = new RegExp(ay[k] === 'A' ? ALL_FOLDER_REG_STR : ALL_FILES_REG_STR);

                //扫描路径，当遇到AB关键字时处理，如果两者不相等，停下dy的扫描，继续执行对ay的扫描，直至遇到相等数值
                while(index < dy.length){
                    if(dy[index] === 'A' || dy[index] === 'B'){
                        if(dy[index] === ay[k]){
                            dy[index] = pathname.match(reg)[0];
                            index++;
                        }
                        break;
                    }
                    index++;
                }
            } else {
                reg = new RegExp(ay[k]);
            }

            pathname = pathname.replace(reg, '');
        }

        filepath =  dy.join("");
    }

    filepath = path.normalize(filepath);
    filepath = filepath.charAt(0) == path.sep ? filepath.substring(1,filepath.length):filepath;

    return filepath;
}
rp.routeTo = function(res , filepath){
    var that = this;
    fs.stat(filepath , function(err , stats){
        if(err || !stats.isFile()){
            that.emit("error" , err || (new Error("path is not file")));

            that.error(res);
            return;
        }

        var fileKind = filepath.substring((filepath.lastIndexOf(".")+1)||0 , filepath.length);
        var readstream = fs.createReadStream(filepath);

        var index = mimes.indexOf('.'+fileKind);
        var options = {
            'Cache-Control':'no-cache',
            'Content-Type': mimes[index+1]+';charset=utf-8',
            'Content-Length':stats.size
        };
        res.writeHead(200, options);
        readstream.pipe(res);
    });
}

rp.error = function(res){
    res.writeHead(404);
    res.end("404 not found");
}