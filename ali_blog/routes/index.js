
var Settings = require("../settings");

module.exports = function(App){
    App.route('/index').get(function(req,res,next){
        res.render('index.html',{
            title: Settings.webName
        })
    });
};