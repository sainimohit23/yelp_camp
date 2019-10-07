// =================
// Comment Routes 
// =================
let router = require("express").Router({mergeParams:true}); // mergeParams:true will make the :id discoverable in this file.
let Campground = require("../models/campgrounds");
let Comment = require("../models/comments");


// comments new
router.get("/new", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, camp)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("./comments/new", {campground:camp});
        }
    });
});


// comments create
router.post("/", isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, (err, cmnt)=>{
                if(err){
                    console.log(err);
                }
                else{
                    cmnt.author.id = req.user._id;
                    cmnt.author.name = req.user.username;
                    cmnt.save();
                    camp.comments.push(cmnt);
                    camp.save();
                    console.log(camp);
                    res.redirect("/campgrounds/"+camp._id);
                }
            });
        }
    });   
});


// ========= Comment EDIT Route ========
router.get("/:comment_id/edit", checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundCmnt)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundCmnt});
        }
    });
});

// ========= Comment UPDATE Route ========
router.put("/:comment_id", checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedCmnt)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// ========== DELETE ROUTE ============
router.delete("/:comment_id", checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// This middleware is for authorization, which is different from authentication.
function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){ // we can't use === here because one is object and other is string
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;