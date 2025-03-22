const friendsService = require('../services/friend');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'pheobe-and-lenny';


async function validateAndGetUserNameFromToken(authorizationHeader) {
    if (!authorizationHeader) {
        throw new Error('Unauthorized'); 
    }

    const tokenString = authorizationHeader.replace('Bearer ', '');
    let tokenObj;
    try {
        tokenObj = JSON.parse(tokenString);
    } catch (error) {
        throw new Error('Invalid token format'); 
    }
    
    const token = tokenObj.token;
    if (!token) {
        throw new Error('No token found'); 
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(new Error('Invalid token')); 
            } else {
                resolve(decoded.userName); 
            }
        });
    });
}

const addFriendReq = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    res.json(await friendsService.addFriendReq(req.params.id, req.body.username));
};

const getFriends = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    res.json(await friendsService.getFriends(req.params.id));
};

const getPendingFriends = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    res.json(await friendsService.getPendingFriends(req.params.id));
};

const approveFriend = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const result = await friendsService.approveFriend(req.params.id, req.params.fid);
    if (!result) {
        return res.status(404).json({ errors: ['friend not found'] });
    }
    res.json({data: result});
};

const deleteFriend = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const friend = await friendsService.deleteFriend(req.params.id, req.params.fid);
    if (!friend) {
        return res.status(404).json({ errors: ['Friend not found'] });
    }
    res.json(friend);
};


module.exports = { addFriendReq, getPendingFriends, getFriends, approveFriend , deleteFriend };