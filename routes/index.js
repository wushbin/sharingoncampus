var express     = require("express");
var router      = express.Router();

var passport    = require("passport"),
    User        = require("../models/user");
    

router.get("/", function(req, res){
    res.render("landing");
});

//=========================
// Authentication Route
//=========================
router.get("/register", function(req, res){
    res.render("register");
});
// sing up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", error.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "welcome to Yelp Cat " + user.username);
            res.redirect("/campgrounds"); 
        });
    });
});
// show login form
router.get("/login", function(req, res) {
    res.render("login");
});
// handle login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    })
    ,function(req,res){
});
//logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;