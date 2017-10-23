var mongoose = require("mongoose"),
    Campground = require("./models/campground.js"),
    Comment = require("./models/comment.js");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "When you breathe in the code, and exhale functions and syntax, while genuinely enjoying the process, you have a good shot to become decent. But if it’s a torture in the rectum and 1 minute feels 5 hours long, just quit. Get your priorities straight.Good programmers code because they don’t have a choice. They love doing it. It’s an addiction. Money is great, but loving your work is so gratifying."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg",
        description: "When you breathe in the code, and exhale functions and syntax, while genuinely enjoying the process, you have a good shot to become decent. But if it’s a torture in the rectum and 1 minute feels 5 hours long, just quit. Get your priorities straight.Good programmers code because they don’t have a choice. They love doing it. It’s an addiction. Money is great, but loving your work is so gratifying."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "When you breathe in the code, and exhale functions and syntax, while genuinely enjoying the process, you have a good shot to become decent. But if it’s a torture in the rectum and 1 minute feels 5 hours long, just quit. Get your priorities straight.Good programmers code because they don’t have a choice. They love doing it. It’s an addiction. Money is great, but loving your work is so gratifying."
    }
]

function seedDB(){
    Campground.remove({}, function(error){
        if(error){
            console.log(error);
        } else {
            console.log("removed campgrounds");
            data.forEach(function(seed){
                Campground.create(seed, function(error, campground){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("campground added");
                        Comment.create(
                            {
                                text: "This is a greate place",
                                author: "KingCat"
                            }, function(error, comment){
                                if(error){
                                    console.log(error);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("comment added");
                                }
                            });
                    }
                });
            });
        }
    });
    
    
}

module.exports = seedDB;

