let app = require("express")();
let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let Campground = require("./models/campgrounds");
let seedDB = require("./seeds");
let Comment = require("./models/comments");
let passport = require("passport");
let localStrategy = require("passport-local");
let passLocMon = require("passport-local-mongoose");
let methodOverride = require("method-override");
let User = require("./models/user");

// Stylesheet not connected. Refer to last video of adding comments

// ======= IMPORTING ROUTES =======
let commentRoutes = require("./routes/comments");
let indexRoutes = require("./routes/index");
let campgroundRoutes = require("./routes/campgrounds");


// ======= SETTING UP =======
app.use(bodyParser.urlencoded({extended: true})); // It will help in POST routes
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); // To use public directory. __dirname prints CWD.
app.use(methodOverride("_method")); // Help in using PUT route
mongoose.connect("mongodb://localhost/yelp_camp");
// seedDB(); // seed the database


// ==================
// Passport Config
// ==================
app.use(require("express-session")({
    secret: "mohit is the coolest guy",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ======= Will make user available to all pages =======
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// ======= USING ROUTES =======
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use(campgroundRoutes);

app.listen(3000, "localhost", function(){
    console.log("Server started..............");
});