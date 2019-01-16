var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
//route管理
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersAuth = require('./routes/auth');

var app = express();
//设置模板引用目录,默认为/views,这里是项目的根目录寻找地址
app.set("views",["./public/pugs","/"]);
//加入 pug模板语言在express中使用
app.set('view engine', 'pug');
// app.engine('html', require('pug').__express);
app.engine('html', require('pug').renderFile);
//{dev,prop}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
//映射route
app.use('/', indexRouter);
app.use('/oauth2', usersAuth);
app.use('/users', usersRouter);

module.exports = app;
