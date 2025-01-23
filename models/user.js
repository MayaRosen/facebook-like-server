const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    },
    friends: [{
        type: String,
    }],
    pendingFriends: [{
        type: String,
    }]
});
module.exports = mongoose.model('User', User);