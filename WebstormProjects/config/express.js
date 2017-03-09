var express=    require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url=require('Url');
var qs=require('QueryString');
var domain = require('domain');
//var server = require('http').create(app);
module.exports=function(){
    var app=express();

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(function(req, res, next) {
        // 设置所有HTTP请求的超时时间
        //req.setTimeout(5000);
        // 设置所有HTTP请求的服务器响应超时时间
        res.setTimeout(1000);
        next();
    });


    require('../app/routes/index.server.routes.js')(app);
    app.use(express.static('./public'));

    return app;
};

/**
 * Created by Administrator on 2015/11/13.
 */
