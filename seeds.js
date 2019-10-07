let mongoose = require("mongoose");
let Campground = require("./models/campgrounds");
let Comment = require("./models/comments");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Desert Mesa", 
        image: "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg?maxwidth=1200&maxheight=1200&autorotate=false",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]

function seedDB(){
    Campground.remove({}, (err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Deleted All Campgrounds");
            data.forEach((seed)=>{
                Campground.create(seed, (err, camp)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("added camp with ID"+ camp._id);
                        Comment.remove({}, (err)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                Comment.create(
                                    {
                                        author: "Homer",
                                        text: "Bla Bla Bla"
                                    }
                                ,(err, cmnt)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log("Adding Comment");
                                        camp.comments.push(cmnt);
                                        camp.save();
                                    }
                                }
                                );
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;