const User = require('../models/user');
const Post = require('../models/post');
const { deleteFriend } = require('./friend');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'pheobe-and-lenny';

const createUser = async (username, password, nickname, profilePic) => {
    const user = new User({ username:username, password:password, nickname:nickname, profilePic:profilePic });
    user.friends = [];
    user.pendingFriends = [];
    return await user.save();
};
const getUserByUsername = async (id) => { return await User.findOne({username : id}); };

const getUsers = async () => { return await User.find({}); };

const updateUser = async (id, password, nickname, profilePic) => {
    const user = await getUserByUsername(id);
    if (!user) return null;
    user.password = password;
    user.nickname = nickname;
    user.profilePic = profilePic;
    await user.save();

    const result = await Post.updateMany(
        { username: id }, 
        { 
            $set: { 
                nickname: nickname, 
                profilePic: profilePic, 
            } 
        }
    );

    return user;
};
const deleteUser = async (id) => {
    const user = await getUserByUsername(id);
    if (!user) return null;
    await Post.deleteMany({ username: id });
    for (const fid of user.friends) {
        await deleteFriend(id, fid);
    }
    await user.deleteOne();
    return user;
};

const getToken = async (username, password) => {
    const user = await User.findOne({username, password});
    console.log('user', user);
    if (!user) return null;
    const token = jwt.sign({ userId: user._id, userName: user.username }, SECRET_KEY, { expiresIn: '1h' });
    return token;
};
module.exports = { createUser, getUserByUsername, getUsers, updateUser, deleteUser, getToken }