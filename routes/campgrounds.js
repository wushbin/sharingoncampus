var express = require("express");
var router = express.Router();

var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
    
var middleware = require("../middleware");

router.get("/", function(req,res){
    Campground.find({}, function(error, allCampgrounds){
        if(error) {
            console.log(error);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});     
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username: req.user.username
    };
    var newCamp = {name:name, price: price, image:image, description: description, author: author};
    Campground.create(newCamp, function(error, newCamp){
        if (error){
            console.log(error);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if (error){
            console.log(error);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

//Edit Route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update route
router.put("/:id",middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, campground){
        if (error){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});
//delete route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        if(error){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;