/**
 * httpClient
 * @author LFH
 * @since 2019/1/16 12:53
 * @description
 */
let http = require("http");
let https = require("https");
let url = require("url");
let querystring=require('querystring');
const CHASRSET="utf-8";
const EMPTY_OBJ={};
let $request=(http,method)=>{
    return function (urlStr,params={},response=EMPTY_OBJ,options={}) {
        let $method=( method||"GET") .toUpperCase();
        let $url=url.parse(urlStr);//处理url参数为url对象
        switch ($method) {
            case "GET":
                http.get($url,(res)=>{
                    res.setEncoding(CHASRSET);
                    res.on("data",data=>{
                        response.success&&response.success(data);
                    });
                    res.on("end",()=>{
                        response.end&&response.end();
                    });
                }).on("error",error=>{
                    response.error&&response.error(error);
                });
                break;
            case "POST":
                var postData=querystring(params);
                options.headers=Object.assign( {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                },options.headers||{});
                let req=http.request($url,options,(res)=>{
                    res.setEncoding(CHASRSET);
                    res.on("data",(data)=>{
                        response.success&&response.success(data);
                    });
                    res.on("end",()=>{
                        response.end&&response.end();
                    });
                }).on("error",(error)=>{
                    response.error&&response.error(error);
                });
                // 将数据写入到请求主体。
                req.write(postData);
                req.end();
                break;
            default:
                return ;
        }

    };
};
module.exports = {
    post:$request(http,"POST"),
    get:$request(http,"get"),
    spost:$request(https,"POST"),
    sget:$request(https,"get")
};