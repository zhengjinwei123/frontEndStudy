"use strict";

var mysql = require('mysql'),
    exception = require('./exceptions'),
    settings = require('../settings');

var queryTimeLimit = 5000; // milliseconds
var mysqlLog = require('../handler/logHandler')({file:'mysql'});

function MysqlObj(config) {

    mysqlLog.info(null, "Create mysql connection " + config.host + ':' + config.port + '|DB:' + config.database);

    var pool  = mysql.createPool({
        host: config.host || '127.0.0.1',
        port: config.port || 3306,
        user: config.user,
        password: config.password,
        database: config.database,
        charset: config.charset || 'UTF8_GENERAL_CI',
        dateStrings: true,
        supportBigNumbers: true,
        bigNumberStrings: true,
        debug: false,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        waitForConnections: true,
        connectionLimit: config.connectionLimit || 3,
        queueLimit: 0
    });

    function slowLog(info, caller, time) {
        var logmsg = [info, ' query by: ', caller.func, ':', caller.line].join('');
        logmsg = ['Slow query, takes', time, 'ms', config.host+':'+config.port, logmsg].join(' ');
        mysqlLog.warn(null, logmsg);
    }

    var self = {
        query: function(sql, params, next,closeTimes) {
            closeTimes = closeTimes || 0;
            if (!pool){
                next.failed( config.host+':'+config.port + ' Mysql pool err');
                return;
            }

            var caller = exception.caller();
            var poolTimeBegin = new Date().getTime();

            var me = this;
            pool.getConnection(function(err, connection) {
                if(err) {
                    if(closeTimes >= 3){
                        next.failed( config.host+':'+config.port + ' Mysql getConnection err:' + err.message);
                    }else{
                        mysqlLog.error(null, err.message + " try query again:" + closeTimes);
                        me.query(sql,params,next,++closeTimes);
                    }
                    return;
                }

                var poolTimeEnd = new Date().getTime();
                if (poolTimeEnd - poolTimeBegin > queryTimeLimit) {
                    slowLog('pool time', caller, poolTimeEnd - poolTimeBegin);
                }

                if (config.syslog && sql.search(/^\s*select|^\s*set\*names/i) === -1){
                    var logmsg = ['query by: ', caller.func, ':', caller.line, '[', sql, ']', JSON.stringify(params)].join('');
                    mysqlLog.log(null, logmsg);
                }

                var beginTime = new Date().getTime();
                connection.query(sql, params, function(err, results, fields) {
                    var endTime = new Date().getTime();
                    if (endTime - beginTime > queryTimeLimit){
                        slowLog(['query time [', sql, ']', JSON.stringify(params)].join(''), caller, endTime - beginTime);
                    }
                    if (err) {
                        mysqlLog.error(null, err + '['+ sql +']' + JSON.stringify(params));
                        var m = err.message.match("Connection lost");
                        if(m){
                            connection.release();
                            if(closeTimes >= 3){
                                next.failed(config.host+':'+config.port + ' ' + err.message);
                            }else{
                                mysqlLog.error(null, err.message + " try query again:" + closeTimes);
                                me.query(sql,params,next,++closeTimes);
                            }
                        }else{
                            connection.release();
                            next.failed(config.host+':'+config.port + ' ' + err.message);
                        }
                    } else {
                        next.success(results, fields);
                        connection.release();
                    }
                });
            });
        },
        close: function(next) {
            if (pool) {
                pool.end(function (err) {
                    if(err) {
                        mysqlLog.error(err);
                    }
                    mysqlLog.info(null, "Close mysql connection " + config.host + ':' + config.port + '|DB:' + config.database);
                });
            }
            next();
        }
    };

    return self;
}

module.exports = MysqlObj;
