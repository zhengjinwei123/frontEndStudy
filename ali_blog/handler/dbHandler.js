"use strict";

/**
 * mysql.
 */

var settings = require('../settings');
var mysql = require('../lib/mysql');

var mysqlMap = {};

exports.db = function(connection) {
    if(connection == null) {
        connection = 'gsmpMysql';
    }

    if(mysqlMap[connection] == undefined) {
        var config = settings[connection];
        mysqlMap[connection] = mysql(config);
    }

    return mysqlMap[connection];
};
