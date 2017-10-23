var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


seedDB();


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    Campground.find({}, function(error, allCampgrounds){
        if(error) {
            console.log(error);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});     
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.post("/campgrounds", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCamp = {name:name, image:image, description: description};
    Campground.create(newCamp, function(error, newCamp){
        if (error){
            console.log(error);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if (error){
            console.log(error);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

//===================
// Comment Route
//====================

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log(error);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log(error);
        } else {
            Comment.create(req.body.comment, function(error, comment){
                if (error){
                    console.log(error);
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The web server started!");
});