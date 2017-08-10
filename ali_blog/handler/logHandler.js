"use strict";

/**
 ***平台访问log和操作log
 **/

var fs = require('fs');
var _ = require('underscore');
var Log = require('../lib/log');
var Common = require('../lib/common');
var setting = require('../settings');

// log记录
var logsMap = {};
var logger = function (_options) {
    var options = {
        path: global.rootPath + '/logs/',
        file: 'access',
        fileFormat: 'Ymd'
    };
    options = _.extend(options, setting.log);
    options = _.extend(options, _options);

    var uk = options.file;
    if(logsMap[uk] == undefined) {
        if(fs.existsSync(options.path) === false) {
            fs.mkdirSync(options.path);
        }
        logsMap[uk] = new Log(options);
    }
    return logsMap[uk];
};

//----------------------------------------------------------------------------------------------------------------------
// access日志查询
var getAccessLog = function (type, dataTime, cb) {
    dataTime = dataTime || Common.timeFormat('Ymd');
    if (type && dataTime) {
        var fileName = type + dataTime + '.log';
        var filePath = global.rootPath + '/logs/' + fileName;
        fs.stat(filePath, function (err, stats) {
            if (err) {
                cb(err.message);
            } else {
                if (stats.isFile()) {
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, data);
                        }
                    });
                } else {
                    cb('file_not_exists');
                }
            }
        });
    } else {
        cb('params_error');
    }
};

exports.logger = logger;                // log日志生成
exports.getAccessLog = getAccessLog;    // access日志查询