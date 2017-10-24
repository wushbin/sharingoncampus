var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {
}

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(error, foundCampground){
            if (error) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("You do have permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if (error) {
                console.log(error);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("You do have permission");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to login to do that");
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = middlewareObj;