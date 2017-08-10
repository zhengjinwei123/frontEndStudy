"use strict";

var _ =  require('underscore');
var http = require('http');
var url = require('url');
var qs = require('querystring');

exports.randomInt = function(lower, higher) {
    return ((higher - lower + 1) * Math.random() + lower)>>0;
};

var fix2num = function(n) {
    return [0, n].join('').slice(-2);
};
exports.fix2num = fix2num;

exports.timeFormat = function(format, time) {
    var curdate = (time > 0) ? new Date(time) : new Date();
    if( format == undefined ) return curdate;
    format = format.replace(/Y/i, curdate.getFullYear());
    format = format.replace(/m/i, fix2num(curdate.getMonth() + 1));
    format = format.replace(/d/i, fix2num(curdate.getDate()));
    format = format.replace(/H/i, fix2num(curdate.getHours()));
    format = format.replace(/i/i, fix2num(curdate.getMinutes()));
    format = format.replace(/s/i, fix2num(curdate.getSeconds()));
    format = format.replace(/ms/i, curdate.getMilliseconds());
    return format;
};

// 生成guid
exports.guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

// IP转数字
exports.ip2num = function(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var result = reg.exec(ip);
    if(!result) {
        return null;
    }
    return ( parseInt(result[1])<<24 | parseInt(result[2])<<16 | parseInt(result[3])<<8 | parseInt(result[4]) )>>>0;
};
// 数字转IP
exports.num2ip = function(num) {
    if(num<0 || num>0xFFFFFFFF) {
        return null;
    }
    return (num>>>24) + '.' + (num>>16 & 0xFF) + '.' + (num>>8 & 0xFF) + '.' + (num & 0xFF);
};

// 获取客户端IP
exports.getClientIP = function(req) {
    if(req == undefined)
        return undefined;

    if(req.headers['x-real-ip'] != undefined)
        return req.headers['x-real-ip'];

    if(req.headers['x-forwarded-for'] != undefined)
        return req.headers['x-forwarded-for'];

    if(req.client != undefined && req.client.remoteAddress != undefined)
        return req.client.remoteAddress;

    if (req.ip != undefined)
        return req.ip;

    if (req._remoteAddress != undefined)
        return req._remoteAddress;

    if (req.connection != undefined && req.connection.remoteAddress != undefined)
        return req.connection.remoteAddress;
    if (req.connection != undefined && req.connection.socket != undefined && req.connection.socket.remoteAddress != undefined)
        return req.connection.remoteAddress;

    if (req.socket != undefined && req.socket.remoteAddress != undefined)
        return req.socket.remoteAddress;

    return undefined;
};

// 自定义进制转换(48进制) -- 产生
exports.convert = function (num) {
    // 字符池(英文字母) -- 避免 0/o i/I l
    var charPool = ['d','e','f','g','I','J','K','L','h','j','a','b','M','N','c','r','y','z','A','B','s','t','V','W','X','u','P','Q','v','D','E','F','k','m','G','H','R','w','Y','Z','x','C','S','n','p','q','T','U'];
};

// 生成数字对应序列串 -- 支持最大数 = 48*digit
exports.num2code = function(num, digit) {
    // 字符池(英文字母) -- 避免 0/o i/I l
    var charPool = ['d','e','f','g','I','J','K','L','h','j','a','b','M','N','c','r','y','z','A','B','s','t','V','W','X','u','P','Q','v','D','E','F','k','m','G','H','R','w','Y','Z','x','C','S','n','p','q','T','U'];
    num = parseInt(num) ? parseInt(num) : 1;
    // 数字部分位数
    digit = parseInt(digit) ? parseInt(digit) : 2;
    var step = Math.pow(10, digit);
    var max = charPool.length * step;
    if(num <= 0 || num >= max) {
        return null;
    }
    // 字母部分 -- 前缀
    var prefixIndex = Math.floor(num/step);
    var prefix = charPool[prefixIndex];
    if(prefix == undefined) {
        return null;
    }
    // 数字部分 -- 后缀
    var suffix = parseInt(num % step);
    if (suffix < step) {
        suffix = (new Array(digit+1).join("0") + suffix).slice(-1 * digit);
    }

    return prefix + suffix;
};

// 将序列串转换为数字 -- 支持最大数 = 48*digit
exports.code2num = function(code, digit) {
    // 字符池(英文字母) -- 避免 0/o i/I l
    var charPool = ['d','e','f','g','I','J','K','L','h','j','a','b','M','N','c','r','y','z','A','B','s','t','V','W','X','u','P','Q','v','D','E','F','k','m','G','H','R','w','Y','Z','x','C','S','n','p','q','T','U'];
    // 数字部分位数
    digit = parseInt(digit) ? parseInt(digit) : 2;
    var step = Math.pow(10, parseInt(digit));

    // 字母部分 -- 前缀
    var prefix = code.slice(0, 1);
    var prefixIndex = charPool.indexOf(prefix);
    if (prefixIndex < 0) {
        return null;
    }
    // 数字部分 -- 后缀
    var suffix = parseInt( code.slice(1) );

    return prefixIndex*step + suffix;
};

// 生成连续随机唯一码
exports.createAcCode = function(codeType, codeStart, codeNum, codePre) {
    // 字符池(英文字母) -- 避免 0/o i/I l
    var charPool = ['d','e','f','g','I','J','K','L','h','j','a','b','M','N','c','r','y','z','A','B','s','t','V','W','X','u','P','Q','v','D','E','F','k','m','G','H','R','w','Y','Z','x','C','S','n','p','q','T','U'];
    var codeMax = parseInt(codeStart) + parseInt(codeNum);
    var startNum = (codeType << 15);
    var codeArray = [];
    for(var i=codeStart; i<codeMax; i++)
    {
        var randIndex = exports.randomInt(0, charPool.length-1);
        codeArray.push( [codePre, (startNum+i).toString(36), charPool[randIndex]].join('') );
    }
    return codeArray;
};

exports.reqGet = function (strUrl, timeOut, cb) {
    var urlObj = url.parse(strUrl);
    timeOut = parseInt(timeOut) ? parseInt(timeOut) : 10*1000;
    var options = {
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: 'GET',
        headers: {
            "Connection": "keep-alive",
            "Host": urlObj.host,
            "User-Agent": 'nodejs',
            "accept": "text/html,application/xhtml+xml,application/xml",
            "accept-encoding": "gzip, deflate"
        }
    };
    var request = http.request(options, function (res) {
        if( res.statusCode != 200 ) {
            cb('HTTP Code:' + res.statusCode);
            return;
        }
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            cb(null, data);
        });
        res.on('abort', function () {
            cb('Request Timeout');
        });
    }).on('error', function (e) {
        cb('Request error:' + e.message);
        return;
    });
    // 设置请求超时时间
    request.setTimeout(timeOut, function (err, result) {
        request.abort();
    });

    request.end();
};

exports.reqSend = function(strurl, timeOut, cb) {
    timeOut = parseInt(timeOut) ? parseInt(timeOut) : 10*1000;
    var req = http.get(strurl, function(res){
        if( res.statusCode != 200 ) {
            cb('HTTP Code:' + res.statusCode);
            return;
        }
        var buffers = [];
        res.on('data', function(chunk) {
            buffers.push(chunk);
        });
        res.on('end', function() {
            cb(null, buffers.join(''), res);
            buffers = null;
        });
        res.on('abort', function () {
            cb('Request Timeout');
        });
    });
    // 设置请求超时时间
    req.setTimeout(timeOut, function (err, result) {
        req.abort();
    });
    req.header();
    req.on('error', function(e) {
        cb('Request error:' + e.message);
        return;
    });
};

exports.reqPost = function(strurl, postData, timeOut, cb) {
    timeOut = parseInt(timeOut) ? parseInt(timeOut) : 10*1000;
    var urlObj = url.parse(strurl);
    postData = qs.stringify(postData);
    var options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var req = http.request(options, function(res) {
        if( res.statusCode != 200 ) {
            cb('HTTP Code:' + res.statusCode);
            return;
        }
        res.setEncoding('utf8');
        var buffers = [];
        res.on('data', function (chunk) {
            buffers.push(chunk);
        });
        res.on('end', function() {
            cb(null, buffers.join(''), res);
            buffers = null;
        });
        res.on('abort', function () {
            cb('Request Timeout');
        });
    });
    // 设置请求超时时间
    req.setTimeout(timeOut, function (err, result) {
        req.abort();
    });
    req.on('error', function(e) {
        cb('Request error:' + e.message);
        return;
    });

    req.write(postData);
    req.end();
};
