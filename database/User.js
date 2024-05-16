const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    todo: String,
    isCompleted: {type: Boolean, default: false},
    imgURL: String
})

const User = mongoose.model("User", userSchema);

module.exports = User;