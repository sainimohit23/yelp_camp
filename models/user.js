let mongoose = require("mongoose");
let passLocMon = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passLocMon);

module.exports = mongoose.model("User", userSchema);