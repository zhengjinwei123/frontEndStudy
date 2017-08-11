define(function (require, exports, module) {
    var _ = require('underscore'),
        _dummy = require('jgrowl'),
        _dummy = require('showLoading'),
        _dummy = require('bootstrap');

    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    // 浏览器提示
    $(function () {
        var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) !== null;
        if (!isChrome) {
            var element = $('#browser_notice_dialog');
            element.modal({backdrop: 'static'});
        }
    });


    var location = function (url) {
        if (url !== undefined && url !== '') {
            window.location.href = url;
        }
    };

    var fix2num = function (n) {
        return [0, n].join('').slice(-2);
    };
    var TimeFormat = function (format, time) {
        var curdate = (time > 0) ? new Date(time) : new Date();
        if (format === undefined) return curdate;
        format = format.replace(/Y/i, curdate.getFullYear());
        format = format.replace(/m/i, fix2num(curdate.getMonth() + 1));
        format = format.replace(/d/i, fix2num(curdate.getDate()));
        format = format.replace(/H/i, fix2num(curdate.getHours()));
        format = format.replace(/i/i, fix2num(curdate.getMinutes()));
        format = format.replace(/s/i, fix2num(curdate.getSeconds()));
        format = format.replace(/ms/i, curdate.getMilliseconds());
        return format;
    };

    var log = (function () {
        var logbg = '#ccc';

        function logInfo(doc, log) {
            logbg = (logbg === '#ccc') ? '#fff' : '#ccc';
            $(doc).append([
                '<li style="background-color: ' + logbg + ';">[',
                timeFormat('Y-m-d H:i:s ms'),
                ']',
                log,
                '</li>'
            ].join(' '))
        }

        return {
            logInfo: logInfo
        }
    }());

    //计算字符的字节数
    var byteLength = function (str) {
        var realLength = 0, charCode;
        for (var i = 0; i < str.length; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128)
                realLength += 1;
            else
                realLength += 2;
        }
        return realLength;
    };

    //时间戳转换为可视日期格式
    var timeFormat = function (format, time) {
        var curdate = (time > 0) ? new Date(time) : new Date();
        if (format === undefined) return curdate;
        format = format.replace(/Y/i, curdate.getFullYear());
        format = format.replace(/m/i, fix2num(curdate.getMonth() + 1));
        format = format.replace(/d/i, fix2num(curdate.getDate()));
        format = format.replace(/H/i, fix2num(curdate.getHours()));
        format = format.replace(/i/i, fix2num(curdate.getMinutes()));
        format = format.replace(/s/i, fix2num(curdate.getSeconds()));
        format = format.replace(/ms/i, curdate.getMilliseconds());
        return format;
    };

    var dateFormat = function (date, format) {
        if (parseInt(date) && format === 'Y-m-d') {
            date = date.toString();
            return [date.substring(0, 4), date.substring(4, 6), date.substring(6, 8)].join("-");
        } else if (_.isString(date) && format === 'Ymd') {
            date = date.split("-").join("");
            return parseInt(date);
        } else {
            throw new Error("dateFormat param error");
        }
    };

    // 字符串格式化
    /**
     *  //两种调用方式
     var template1="我是{0}，今年{1}了";
     var template2="我是{name}，今年{age}了";
     var result1=template1.format("loogn",22);
     var result2=template2.format({name:"loogn",age:22});
     */
    String.prototype.format = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length === 1 && typeof (args) === "object") {
                for (var key in args) {
                    if (args[key] !== undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    };

    Date.prototype.normalize = function () {
        return this.toLocaleDateString() + " 00:00:00";
    };

    Date.prototype.isSameDay = function (date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if (this.getTime() === date.getTime()) {
            return true;
        }
        return false;
    };

    function myTrim(x) {
        return x.replace(/^\s+|\s+$/gm, '');
    }

    // 内容搜索
    $("#form-search > button").on("click", function () {
        var val = myTrim($("#input-search").val());
        alert(val)
    });

    _.extend(exports, {
        location: location,
        byteLength: byteLength,
        timeFormat: TimeFormat,
        fix2num: fix2num,
        dateFormat: dateFormat,
        myTrim: myTrim
    });
});