/*配置参数等*/
var config={
    port:8900,
    qq:{
        appId:"101543040",
        appKey: "b9d055537e986a17efcff31859c179bc",
        redirectURI:"https://buyer.hjs.56rely.com/oauth2/auth/code",
        redirectTokenURI:"https://buyer.hjs.56rely.com/oauth2/auth/token",
        //第一步:先进行登录获取code
        authorize:"https://graph.qq.com/oauth2.0/authorize",
        //第二步:用code去获取token
        authToken:"https://graph.qq.com/oauth2.0/token",
        //用token去获取对应QQ用户openId
        authMe:"https://graph.qq.com/oauth2.0/me",
    },wss:{

    }
};
module.exports=config;