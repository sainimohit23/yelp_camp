let mongoose = require("mongoose");
let commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        name: String
    }
})

module.exports = mongoose.model("Comment", commentSchema);