const User = require('../models/user');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'pheobe-and-lenny';

const addFriendReq = async (id, friendUsername) => {
    const friend = await User.findOne({ username: friendUsername });
    if (!friend) return null;

    await friend.updateOne({ $addToSet: { pendingFriends: id } });
    await friend.save();
    return friend;
};

const getFriends = async (id) => { 
    const user = await User.findOne({ username: id });
    if (!user) return null;
    return await User.find({ username: { $in: user.friends } });
 };
 
 const getPendingFriends = async (id) => { 
    const user = await User.findOne({ username: id });
    if (!user) return null;
    return await User.find({ username: { $in: user.pendingFriends } });
 };

const approveFriend = async (id, fid) => {
    const user = await User.findOne({ username: id });
    if (!user) return null;
    await user.updateOne({ $addToSet: { friends: fid }});
    await user.updateOne( { $pull: { pendingFriends: fid }});

    const friend = await User.findOne({ username: fid });
    await friend.updateOne({ $addToSet: { friends: id }});
    if (!friend) return null;
    await friend.save();
    await user.save();
    
    console.log(user);
    console.log(friend);
    return {user : user, friend: friend};
};

const deleteFriend = async (id, fid) => {
    const user = await User.findOne({ username: id });
    if (!user) return null;
    await User.updateOne({ username: id }, { 
        $pull: { 
          pendingFriends: fid,
          friends: fid 
        }
    });
    await User.updateOne({ username: fid }, { 
        $pull: { 
          pendingFriends: id,
          friends: id 
        }
    });
    await user.save();
    return user;
};

module.exports = { addFriendReq, getFriends, getPendingFriends, approveFriend, deleteFriend }
