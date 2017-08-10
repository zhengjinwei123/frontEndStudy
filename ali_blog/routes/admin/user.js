module.exports = function(App){
    App.route('/admin/login').get(function(req,res,next){
        res.end("login");
    });
};