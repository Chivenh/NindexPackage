/**主入口 js*/

var server = require("./js/envUtil/expressRouter"); //获取路由模块
server.listen(8051); //开启服务(默认8049).
var Nindex = server.Nindex;
var process = require("process"); //进程模块
/**捕捉进程异常,进行相关处理,以免关掉整个主进程*/
process.on('uncaughtException', (err) => {
    console.log('Caught exception: ' + err);
    setTimeout(() => {
        console.log("错误待修复...");
    }, 3000);
});

var myPath = "./js/server/";
var mines=["save"];//加载息的模块.
mines.forEach(i=>{
    require(myPath+i)(Nindex);
});

