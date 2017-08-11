"use strict";
var __ = require("underscore");
var Settings = require("../settings");

function PageHandler() {
    this.session = {};
}

PageHandler.getInstance = (function () {
    var inst = null;
    return function () {
        if (inst instanceof PageHandler) {
            return inst;
        }
        inst = new PageHandler();
        return inst;
    }
})();

PageHandler.prototype.init = function (session) {
    this.session = session;
};

PageHandler.prototype.page = function (param) {
   var temp = {
        user: this.session.user || null,
        title: Settings.webName
    };
    if (__.isObject(param)) {
        __.extend(temp, param);
        return temp;
    } else {
         __.extend(temp, {});
        return temp;
    }
};

module.exports = PageHandler.getInstance();
