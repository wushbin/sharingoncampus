var express = require("express");
var router = express.Router({mergeParams: true});

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
    
var middleware = require("../middleware");
//===================
// Comment Route
//====================
router.get("/new",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log(error);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});
// create new 
router.post("/", middleware.isLoggedIn, function(req, res){
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
                    req.flash("success", "Successfully added commnet");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment) {
        if(error){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        if (error){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if (error){
            res.redirect("back");
        } else {
            req.flash("success", "commnet deleted")
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//login middleware




module.exports = router;