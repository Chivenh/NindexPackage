var express = require('express');
var router = express.Router();
var config = require("../config");
var httpClient = require("../utils/httpClient");
/*qq第三方登录实现*/
var configQQ = config.qq;

var saveData = {appId: configQQ.appId};
//qq初始校验地址
var defaultAuthUrl = function (options = {}) {
    var state = saveData.preState = options.state || 'test',
        scope = options.scope || 'get_user_info',
        display = options.display || 'pc';
    //encodeURIComponent 编码路径
    var addon = "?" + ["response_type=code", `client_id=${configQQ.appId}`,
        `redirect_uri=${encodeURIComponent(configQQ.redirectURI)}`, `state=${state}`,
        `display=${display}`, `scope=${scope}`].join("&");
    return configQQ.authorize + addon;
}();
//qq使用当次登录时获取的code去获取token
var authTokenUrl = function (code) {
    return `${configQQ.authToken}?` + ["grant_type=authorization_code",
        `client_id=${configQQ.appId}`,
        `client_secret=${configQQ.appKey}`,
        `code=${code}`,
        `redirect_uri=${encodeURIComponent(configQQ.redirectTokenURI)}`].join("&");
};

//处理get请求回传数据
var dealUrlParams=(params)=>{
    var data=params||"";
    return function(){
        var _= data.split("&");
        var __={};
        _.forEach(i=>{
            var _i=i.split("=");
            __[_i[0]]=_i[1];
        });
        return __;
    }(data);
};

//初始校验,获取authorization_code
router.get("/auth", function (req, res, next) {
    res.redirect(defaultAuthUrl);
});
//根据获取的code再次获取token
router.get("/auth/code", function (req, res, next) {
    var data = req.query;
    if (data.state && data.code) {
        if (data.state === saveData.preState) {
            saveData.code = data.code;
            httpClient.sget(authTokenUrl(data.code), {}, {
                success: function (data) {
                    var $data=dealUrlParams(data);
                    saveData.token = $data.access_token;
                    //使用模板要指定后缀
                    res.render("loginView.html", saveData);
                }, error: function (error) {
                    console.info(error);
                }
            });
        } else {
            res.send(`Error: 你的请求无效!`);
        }
    }
});
//去登录
router.get("/auth/token", function (req, res, next) {
    //res.redirect(defaultAuthUrl);
});
//登录成功回传
router.post("/auth/login", function (req, res, next) {
    //res.redirect(defaultAuthUrl);
    var data=req.body;
    console.info(data);
    res.render("successView.html", saveData);
});
//去注册
router.get("/auth/register", function (req, res, next) {
    //res.redirect(defaultAuthUrl);

});

module.exports = router;