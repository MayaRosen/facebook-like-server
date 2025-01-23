const userService = require('../services/user');
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

const createUser = async (req, res) => {
    res.json(await userService.createUser(req.body.username, req.body.password, req.body.nickname, req.body.profilePic));
};
const getUsers = async (req, res) => {
    res.json(await userService.getUsers());
};
const getUser = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const user = await userService.getUserByUsername(req.params.id);
    if (!user) {
        return res.status(404).json({ errors: ['User not found'] });
    }
    res.json(user);
};
const updateUser = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const user = await userService.updateUser(req.params.id, req.body.password, req.body.nickname, req.body.profilePic);
    if (!user) {
        return res.status(404).json({ errors: ['User not found'] });
    }
    res.json(user);
};
const deleteUser = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
        return res.status(404).json({ errors: ['User not found'] });
    }
    res.json(user);
};

const getToken = async (req, res) => {
    const token = await userService.getToken(req.body.username, req.body.password);
    if (!token) {
        return res.status(404).json({ errors: ['User not found'] });
    }
    res.json({ token : token });
};



module.exports = { createUser, getUsers, getUser , updateUser, deleteUser, getToken};