/**
 * 创建项目服务器
 */
var http = require('http'),fs = require('fs'), url = require('url'),router=require("./router");
console.info(router);
var server=function(){
// 创建服务器
	http.createServer(router).listen(8049);
// 控制台会输出以下信息
	console.log('Server running at http://127.0.0.1:8049/');
};
server();
module.exports={};