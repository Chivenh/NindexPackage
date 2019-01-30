/**
 * websockets测试
 * @author LFH
 * @since
 * @description
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//cookie
var sessionManager = require('express-session');//session
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var sockets = require('./wssRoutes/socket.bind');
//route管理
var indexRouter = require('./wssRoutes/index');

var app = express();
//设置模板引用目录,默认为/views,这里是项目的根目录寻找地址
app.set("views", ["./public/pugs", "./public/wssView"]);
//加入 pug模板语言在express中使用
app.set('view engine', 'pug');
// app.engine('html', require('pug').__express);
app.engine('html', require('pug').renderFile);

//注册session管理
app.use(sessionManager({
    secret: 'this is the secret for cookie',
    resave: false,
    saveUninitialized: true
}));

//{dev,prop}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//session拦截,要放在下面的路径映射之前,不然会无效
app.use(function (req, res, next) {
        next();
    }
);

//映射route
app.use('/', indexRouter);

module.exports = {
    app,
    /**socket绑定方法*/
    socketBind(io){
        for (let socketsKey in sockets) {
            sockets[socketsKey]( io.of(socketsKey));
        }
    }
};
