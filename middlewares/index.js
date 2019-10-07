let Comment = require("../models/comments");
let Campground = require("../models/campgrounds");
let middlewareObj = {}

// This middleware is for authorization, which is different from authentication.
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                console.log(err);
                req.flash("error", "campground not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){ // we can't use === here because one is object and other is string
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "please log in first");
        res.redirect("back");
    }
}

// This function is for authorization, which is different from authentication.
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCamp)=>{
            if(err){
                console.log(err);
                req.flash("error", "camp not found");
                res.redirect("back");
            }else{
                if(foundCamp.author.id.equals(req.user._id)){ // we can't use === here because one is object and other is string
                    next();
                }
                else{
                    req.flash("error", "Something went wrong");
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please login first");
    res.redirect("/login");
}

module.exports = middlewareObj;