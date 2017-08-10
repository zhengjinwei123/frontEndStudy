define(function (require, exports, module) {
    var common = require('common');
    var language = null;
    var locales = '';

    $(function() {
        // 语言包
        var getLang = function (cb) {
            $.get('/language', function(data) {
                if(data.status) {
                    language = data.info;
                    cb(null, data.info);
                } else {
                    cb(data.info);
                }
            }).error(function() {
                cb('unknown');
            });
        };
        // 语言配置
        var getLocales = function (cb) {
            $.get('/locales', function(data) {
                if(data.status) {
                    locales = data.info;
                    cb(null, data.info);
                } else {
                    cb(data.info);
                }
            }).error(function() {
                cb('unknown');
            });
        };

        // 请求语言配置
        getLocales(function (err, result) {
            if (err) {
                $.jGrowl(err, {header: 'Failed!'});
            } else {
                // 查看是否支持sessionStorage
                if (window.sessionStorage) {
                    var ls_locales = sessionStorage.getItem('zbjoy_locales');
                    var ls_language = sessionStorage.getItem('zbjoy_language');
                    // 查看本地是否已经储存
                    if (ls_locales !== locales || !ls_language) {
                        // 请求语言包
                        getLang(function (err, result) {
                            if (err) {
                                $.jGrowl(err, {header: 'Failed!'});
                            } else {
                                sessionStorage.setItem('zbjoy_language', JSON.stringify(result));
                                sessionStorage.setItem('zbjoy_locales', locales.toString());
                            }
                        });
                    }
                } else {
                    getLang(function () {});
                }
            }
        });
    });

    function L(langKey) {
        if(langKey == undefined) {
            return 'unknown';
        }
        // 从浏览器获取存储
        if (!language) {
            if (window.sessionStorage) {
                var ls_language = sessionStorage.getItem('zbjoy_language');
                if (ls_language) {
                    language = JSON.parse(ls_language);
                }
            } else {
                language = {};
            }
        }

        var _lang = null;
        try {
            eval("_lang = language." + langKey);
        } catch (err) {
            _lang = langKey;
        }

        if(typeof _lang != "string")
            _lang = langKey;

        return _lang;
    }

    exports = module.exports = L;
});