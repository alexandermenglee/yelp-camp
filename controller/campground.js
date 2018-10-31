const express    = require("express"),
      router     = express.Router(),
      isLoggedIn = require("../middleware/auth"),
      Campground = require("../models/campground"),
      checkOwnship = require("../middleware/ownership");


//INDEX PAGE DISPLAYING ALL CAMPGROUNDS
router.get("/", (req, res) => {
    //Get all campgrounds from database
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log("Couldn't get all campgrounds: " + err)
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds,});
        }
    });
});

//GETS FORM TO CREATE A NEW CAMPGROUND
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//CREATE ROUTE
router.post("/", (req, res) => {
  // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    //Sets default image if no image is entered
    if (image === ""){
        image = "https://d2cmub9v8qb8gq.cloudfront.net/0.19.0/static/img/no-image-available.jpg";
    }
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, (err, campground) => {
       if(err){
           console.log("Error adding new campground: " + err);
       } else{
            res.redirect("/campgrounds");
            
       }
    });
});

//READ (SHOW ROUTE)
router.get("/:id", (req, res) => {
     //find campground with the id
     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Couldn't find campground: " + err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
     });
});

//EDIT CAMPGROUND
router.get("/:id/edit", checkOwnship, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/update", {campground: campground});
        }
    }); 
});

//UPDATE 
router.put("/:id", isLoggedIn, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id); 
        }
    });
});

//DELETE
router.delete("/:id", isLoggedIn, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;