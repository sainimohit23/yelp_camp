// =================
// Camp Routes 
// =================
let router = require("express").Router();
let Campground =require("../models/campgrounds");


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
    let author = {
        id: req.user._id,
        name: req.user.username
    }
    console.log(author);
    let newCampground = {name: name, image: image, description:desc, author:author};
    
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
router.get("/campgrounds/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
 });


// camp show route
router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec((err, data)=>{
        if(err){
            console.log("error while showing more info");
        }
        else{
            res.render("campgrounds/show",{ campground:data});
        }
    });
});

// ============= EDIT AND UPDATE ==============
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, (req, res)=>{
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

router.put("/campgrounds/:id", checkCampgroundOwnership, (req, res)=>{
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

router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
 });


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// This function is for authorization, which is different from authentication.
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCamp)=>{
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(foundCamp.author.id.equals(req.user._id)){ // we can't use === here because one is object and other is string
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

module.exports = router;