// =================
// AUTH ROUTES
// =================
let router = require("express").Router();
let passport = require("passport");
let User = require("../models/user");


// landing page
router.get("/", (req, res)=>{
    res.render("landing");
});


// Signup route
router.get("/register", (req, res)=>{
    res.render("register");
});


// user create
router.post("/register", (req, res)=>{
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            // console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        else{
            passport.authenticate("local")( req, res, ()=>{
                req.flash("success", "Welcome to yelp camp "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});


// login route
router.get("/login", (req, res)=>{
    // console.log(req.flash("error"));
    res.render("login");
});


// user logged in with middleware
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    successFlash: true,
    failureRedirect: "/login",
    failureFlash: true
}),(req, res)=>{
    req.flash("success", "logged you out");
});


// logout route
router.get("/logout", (req, res)=>{
    req.logOut();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;