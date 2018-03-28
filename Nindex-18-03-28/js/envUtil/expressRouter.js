/**
 * http://usejsdoc.org/
 * 使用express 创建服务器.监听端口,绑定路由.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');//此模块处理post请求体
var Nindex = express();

/**此两行代码必须写在下面所有路由的前面*/
Nindex.use(bodyParser.json()); // for parsing application/json
Nindex.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**将下面两个目录的资源设置为静态资源*/
Nindex.use("/view",express.static('view'));
Nindex.use("/lib",express.static('lib'));


/* GET home page. */
Nindex.get("/", (req, res, next)=>{
	res.sendfile("./index.html");
});
Nindex.all("*",(req, res, next)=>{
	console.info(req.url);
	next();
});
Nindex.get("/.*\.[(json)(txt)]",(req, res, next)=>{
    try {
        res.sendfile(req.url);
    } catch (e) {
        // TODO: handle exception
        res.sendfile("./index.html");
    }
});
module.exports={
		exit:function () {
		    
		},
        listen:function(port){
            var _port=port||8049;
            Nindex.listen(_port);
			console.info("已开启["+(_port)+"]服务!");
		},Nindex:Nindex
};