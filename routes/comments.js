// =================
// Comment Routes 
// =================
let router = require("express").Router({mergeParams:true}); // mergeParams:true will make the :id discoverable in this file.
let Campground = require("../models/campgrounds");
let Comment = require("../models/comments");
let middlewareObj = require("../middlewares") // Program will read index.js by default

// comments new
router.get("/new", middlewareObj.isLoggedIn, (req, res)=>{
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
router.post("/", middlewareObj.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, (err, cmnt)=>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else{
                    cmnt.author.id = req.user._id;
                    cmnt.author.name = req.user.username;
                    cmnt.save();
                    camp.comments.push(cmnt);
                    camp.save();
                    console.log(camp);
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/"+camp._id);
                }
            });
        }
    });   
});


// ========= Comment EDIT Route ========
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundCmnt)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundCmnt});
        }
    });
});

// ========= Comment UPDATE Route ========
router.put("/:comment_id", middlewareObj.checkCommentOwnership, (req, res)=>{
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
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "comment deleted successfully");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;