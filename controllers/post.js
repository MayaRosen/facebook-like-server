const postService = require('../services/post');
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

const createPost = async (req, res) => {
    try {
        const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
        if (myname !== req.body.username) {
            return res.status(403).json({ errors: ['Unauthorized'] });
        }

        const result = await postService.createPost(req.body.username, req.body.nickname, req.body.profilePic, req.body.postText, req.body.img, req.body.published, req.body.comment);
        
        if (result.error) {
            return res.status(403).json({ errors: [result.error] });
        }

        res.status(201).json(result.data);
    } catch (error) {
        res.status(500).json({ errors: [error.message] });
    }
};
const getAllPosts = async (req, res) => {
    res.json(await postService.getAllPosts());
}
const getPosts = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    
    const posts = await postService.getPosts(myname);
    if (!posts) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    res.json(posts);
};
const getPost = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const post = await postService.getPostByUsername(req.params.id);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    res.json(post);
};

const getFriendPost = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const post = await postService.getPostByFriendUsername(req.params.fid);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    res.json(post);
};

const updatePost = async (req, res) => {

    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const post = await postService.updatePost(req.params.pid ,req.body.postText, req.body.img);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    else if (post.error) {
        return res.status(400).json({ errors: [post.error] });
    }
    else if (post.username !== req.params.id) {
        return res.status(403).json({ errors: ['Cannot edit other user\'s post'] });
    }
    res.json(post);
};
const deletePost = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const post = await postService.deletePost(req.params.pid);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    else if (post.username !== req.params.id) {
        return res.status(404).json({ errors: ['Other user post'] });
    }
    res.json(post);
};

const likePost = async (req, res) => {
    const myname = await validateAndGetUserNameFromToken(req.headers.authorization);
    if(myname !== req.params.id) {
        return res.status(403).json({ errors: ['Unauthorized'] });
    }
    const newPost = await postService.likePost(req.params.pid, req.body.addLike);
    if (!newPost) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    res.json(newPost);
};



module.exports = {getAllPosts, createPost, getPosts, getPost , getFriendPost, updatePost, deletePost, likePost};