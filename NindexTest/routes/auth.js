var express = require('express');
var router = express.Router();
var config = require("../config");
var httpClient = require("../utils/httpClient");
var mySqlUtils = require("../utils/mySqlUtils");
var userSqls=require("../sqls/user");
/*qq第三方登录实现*/
var configQQ = config.qq;
var dataSource=mySqlUtils({
    database:"hjs_trading_1215",
    user:"hjs",
    password:"hjshjs"
});
//qq初始校验地址
var defaultAuthUrl = function (options = {}) {
    var state = options.state || 'test',
        scope = options.scope || 'get_user_info',
        display = options.display || 'pc';
    //encodeURIComponent 编码路径
    var addon = "?" + ["response_type=code", `client_id=${configQQ.appId}`,
        `redirect_uri=${encodeURIComponent(configQQ.redirectURI)}`, `state=${state}`,
        `display=${display}`, `scope=${scope}`].join("&");
    return configQQ.authorize + addon;
};
//qq使用当次登录时获取的code去获取token
var authTokenUrl = function (code) {
    return `${configQQ.authToken}?` + ["grant_type=authorization_code",
        `client_id=${configQQ.appId}`,
        `client_secret=${configQQ.appKey}`,
        `code=${code}`,
        `redirect_uri=${encodeURIComponent(configQQ.redirectTokenURI)}`].join("&");
};

//qq使用token去获取用户openId
var authOpenIdUrl=function (token) {
    return `${configQQ.authMe}?access_token=${token}`;
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
//处理callback回传数据
var dealCallBackParams=(params)=>{
    if(params.startsWith("callback")){
        var data=params.replace(/(callback|\(|\)|;|\s+)/gi,"");
        return JSON.parse(data);
    }
    return {};
};

//初始校验,获取authorization_code
router.get("/auth", function (req, res, next) {
    var state=`s_${new Date().getTime()}`;
    req.session.preState=state;
    req.session.appId=configQQ.appId;
    res.redirect(defaultAuthUrl({state:state}));
});
//根据获取的code再次获取token
router.get("/auth/code", function (req, res, next) {
    var data = req.query;
    var saveData=req.session;
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

//登录成功回传openId
router.post("/auth/info", function (req, res, next) {
    var data=req.body;
    var saveData=req.session;
    httpClient.sget(authOpenIdUrl(data.token), {}, {
        success: function (data) {
            var $data=dealCallBackParams(data);
            $data.client_id===saveData.appId&&( saveData.openId = $data.openid);
            dataSource.execute(userSqls.all,function(rows){
                saveData.users=rows;
                //使用模板要指定后缀
                res.render("successView.html", saveData);
            });

        }, error: function (error) {
            console.info(error);
        }
    });
});
//去注册
router.get("/auth/register", function (req, res, next) {
    //res.redirect(defaultAuthUrl);

});

module.exports = router;