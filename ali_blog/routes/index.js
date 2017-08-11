var PageHandler = require("../handler/pageHandler");

module.exports = function (App) {
    App.route('/index').get(function (req, res, next) {
        res.render('index.html', PageHandler.page({}))
    });

    App.route('/search').post(function (req, res, next) {
        var key = req.body.key;
        res.json(key);
    });
};