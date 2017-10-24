var express = require("express");
var router = express.Router({mergeParams: true});

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
//===================
// Comment Route
//====================
router.get("/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log(error);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});
// create new 
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log(error);
        } else {
            Comment.create(req.body.comment, function(error, comment){
                if (error){
                    console.log(error);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//edit route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment) {
        if(error){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// update route
router.put("/:comment_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        if (error){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//destroy route
router.delete("/:comment_id", checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if (error){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//login middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if (error) {
                console.log(error);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;