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
            console.log(err);
            return res.render("register");
        }
        else{
            passport.authenticate("local")( req, res, ()=>{
                res.redirect("/campgrounds");
            });
        }
    });
});


// login route
router.get("/login", (req, res)=>{
    res.render("login");
});


// user logged in with middleware
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res)=>{
});


// logout route
router.get("/logout", (req, res)=>{
    req.logOut();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;