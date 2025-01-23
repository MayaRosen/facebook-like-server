const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = new Schema({
    username: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        required: true
    },
    postText: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    published: {
        type: Date,
        default: Date.now
    },
    numOfLike : {
        type: Number,
        default: 0
    },
    comment: {
        type: String,
    },
});
module.exports = mongoose.model('Post', Post);