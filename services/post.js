const Post = require('../models/post');
const User = require('../models/user');


const createPost = async (username, nickname, profilePic, postText, img, published, comment) => {
    const post = new Post({ username: username, nickname: nickname, profilePic:profilePic, postText:postText, img:img, comment:comment });
    if (published) post.published = published;
    return await post.save();
};

const getAllPosts = async () => { return await Post.find({}); };

const getPostByUsername = async (id) => { return await Post.find({username : id}); };
const getPostByFriendUsername = async (fid) => { return await Post.find({username : fid}); };

const getPostById = async (id) => { return await Post.findById(id); };

const getPosts = async (username) => {
    const user = await User.findOne({username: username});
    if (!user) return null;

    let friendsPosts = [];
    if (user.friends && user.friends.length > 0) {
        friendsPosts = await Post.find({ username: { $in: user.friends } })
                                 .sort({ published: -1 })
                                 .limit(20);
    }

    const nonFriendsPosts = await Post.find({ 
        username: { $nin: user.friends ? user.friends : [] }
    })
    .sort({ published: -1 })
    .limit(5);

    return [...friendsPosts, ...nonFriendsPosts];
};

const updatePost = async (postId, postText, img) => {
    const post = await getPostById(postId);
    if (!post) return null;
    post.postText = postText;
    post.img = img;
    await post.save();
    return post;
};

const deletePost = async (postId) => {
    const post = await getPostById(postId);
    if (!post) return null;
    await post.deleteOne();
    return post;
};

const likePost = async (postId, addLike) => {
    const post = await getPostById(postId);
    if (!post) return null;
    if(Number(addLike) === 1) {
        post.numOfLike++;
    } else{
        post.numOfLike--;
    }

    await post.save();
    return post;
};

module.exports = {getAllPosts, createPost, getPostByUsername, getPostByFriendUsername, getPosts, updatePost, deletePost, likePost }