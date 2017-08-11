"use strict";

module.exports = {
    env: 'development',    // development or production
    port: 3011,    // 平台监听端口
    lang: 'zh-cn',
    header: {
        reqTimeOut: 60*1000,    // 请求超时 毫秒
        cookie: {secret: 'ali_blog'},
        session: {secret: 'ali_blog', key: 'ali_blog.sid', maxAge:24 * 60 * 60 * 1000},
    },
    log: {
        logLevel: {DEBUG: false, INFO: false, WARN: false, ERROR: true},
        consoleLevel: {DEBUG: true, INFO: true, WARN: true, ERROR: true}
    },
    Mysql: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '123456',
        database: 'ali_blog',
        connectionLimit: 3,
        syslog: true
    },
    webName: "帮你记"
};
