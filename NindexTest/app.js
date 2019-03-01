var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//cookie
var sessionManager = require('express-session');//session
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
//route管理
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersAuth = require('./routes/auth');

var app = express();
//设置模板引用目录,默认为/views,这里是项目的根目录寻找地址
app.set("views", ["./public/pugs", "./public/view"]);
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

const SESSION_FILTER=function(){
//session拦截,要放在下面的路径映射之前,不然会无效
    let passUrls=[/^\/[^/]*$/,/^\/oauth2\/auth[^/]*$/,/^\/oauth2\/auth\/code[^/]*$/];
    app.use(function (req, res, next) {
            var url = req.originalUrl;
            if (!passUrls.some(reg=>reg.test(url)) && undefined === req.session.code) {
                //解决内嵌iframe时session拦截问题
                res.send('<script>top.location.href="/";</script>');
                return;
            }
            next();
        }
    );
};

//映射route
app.use('/', indexRouter);
// app.use('/oauth2', usersAuth);
app.use('/users', usersRouter);



module.exports = app;
