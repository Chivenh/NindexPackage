/**主入口 js*/

var server = require("./js/envUtil/expressRouter"); //获取路由模块
server.listen(); //开启服务(默认8049).
var Nindex = server.Nindex;
var process = require("process"); //进程模块
/**捕捉进程异常,进行相关处理,以免关掉整个主进程*/
process.on('uncaughtException', (err) => {
    console.log('Caught exception: ' + err);
    setTimeout(() => {
        console.log("错误待修复...");
    }, 3000);
});

/**
 *./js/my/myUpload",//文件上传模块
 *./js/my/myFileDeal,//文件处理模块
 *./js/my/myDataBase//数据库模块
 */
var myPath = "./js/my/";
["myUpload", "myFileDeal", "myDataBase"].forEach((i) => {
    require(myPath + i)(Nindex); //初始化自己的模块
});

//var _b= require(myPath+"NumberTransferUtil");
//var _n1= _b.transfer(11302);
//var _n2= _b.transferCapital(11302);
//console.info(_n1,"\n",_n2);


