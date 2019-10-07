let mongoose = require("mongoose");
let campSchema = mongoose.Schema({
    name:String,
    image: String,
    description: String,
    author: {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports = mongoose.model("Campground", campSchema);