"use strict";

global.rootPath = __dirname;

var Express = require("express"),
    Util = require("util"),
    Http = require("http"),
    Path = require("path"),
    Settings= require("./settings"),
    AccessLog = require("./handler/logHandler").logger({file: 'access'});

process.on("uncaughtException", function (err) {
    AccessLog.error(null, "uncaughtException:" + err.stack);
});

var App = Express();
App.set('env', Settings.env || 'development');
App.set('port', Settings.port || 4000);
App.set('views', global.rootPath + '/views');
App.set('view cache', false);
App.set('view engine', 'ejs');
App.engine('html', require('ejs').renderFile);
App.use(require('compression')());
App.use(Express.static(Path.join(global.rootPath, './public'), {maxAge:1}));
App.use(require('serve-favicon')(Path.join(global.rootPath + '/public/images/favicon.ico')));
App.use(require('connect-timeout')(Settings.header.reqTimeOut));
App.use(require('connect-flash')());

var BodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
App.use(BodyParser.urlencoded({ extended: false }));
// parse application/json
App.use(BodyParser.json());

App.use(require('method-override')());
App.use(require('cookie-parser')());

var session = require('express-session');
App.use(session({
    key: Settings.header.session.key,
    secret: Settings.header.session.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {path: '/', httpOnly: true, maxAge: Settings.header.session.maxAge}
}));

// development only
if ('development' === App.get('env')) {
    App.use(require('errorhandler')());
}

//(NODE_ENV=production node app.js)  or  (set NODE_ENV=production)
if ('production' === App.get('env')) {
    App.use(require('errorhandler')());
}

App.use(function(req, res, next) {
    req.on('timeout', function(){
        res.end('Request Timeout');
    });

    AccessLog.info(req, req.url);
    next();
});

//配置路由

var routesPath = {
    index:"./routes/index",
    user: "./routes/admin/user"
};

// 加载routes
var routesList = {};
for(var i in routesPath) {
    routesList[i] = require(routesPath[i]);
    routesList[i](App);
}

App.use(function (err, req, res, next) {
    if(err.status === 503){
        res.end('Error:Request timeout!');
        return;
    } else {
        var e = JSON.stringify(err);
        AccessLog.warn(req, e);
        next(err);
    }
});

App.all('*', function(req, res, next){
    res.end('404 Error');
});


if(!module.parent) {
    Http.createServer(App).listen(App.get('port'), function(){
        AccessLog.info(null, Util.format('ali_blog Server listening on port %d in %s mode', App.get('port'), App.get("env")));
    });
} else {
    module.exports = App;
}

