// =================
// Camp Routes 
// =================
let router = require("express").Router();
let Campground =require("../models/campgrounds");
let middlewareObj = require("../middlewares") // Program will read index.js by default

// camp route
router.get("/campgrounds", (req, res)=>{
    // Printing loggedIn user
    console.log(req.user);
    Campground.find({}, (err, allCamps)=>{
        if(err){
            console.log("Error while retreiving camps")
        }else{
            res.render("campgrounds/index", {campgrounds: allCamps});
        }
    });
});


// camp post route
router.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.desc;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        name: req.user.username
    }
    console.log(req.body.price);
    let newCampground = {name: name, image: image, description:desc, author:author, price:price};
    
    Campground.create(newCampground,(err, data)=>{
        if(err){
            console.log("data not added to database");
        }
        else{
            res.redirect("/campgrounds")
        }
    })

});


// add camp route
router.get("/campgrounds/new", middlewareObj.isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
 });


// camp show route
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec((err, data)=>{
        if(err){
            console.log("error while showing more info");
        }
        else{
            // console.log(data.price);
            res.render("campgrounds/show",{ campground:data});
        }
    });
});

// ============= EDIT AND UPDATE ==============
router.get("/campgrounds/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){ 
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // console.log(foundCamp);
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });
});

router.put("/campgrounds/:id", middlewareObj.checkCampgroundOwnership, (req, res)=>{
    // console.log("I'm here");
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, foundCamp)=>{
        if(err){
            // console.log("I'm here2");
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // console.log("I'm here 3");
            res.redirect("/campgrounds/"+req.params.id)
        }
    });
});

router.delete("/campgrounds/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
 });

module.exports = router;