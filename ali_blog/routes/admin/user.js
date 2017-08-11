module.exports = function(App){
    App.route('/admin/login').post(function(req,res,next){
        res.json("login result");
    });

    App.route('/admin/logout').get(function(req,res,next){
        this.session = null;
        res.redirect('/index');
    });
};