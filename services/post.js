const Post = require('../models/post');
const User = require('../models/user');
const net = require('net');

const TCP_SERVER_HOST = '127.0.0.1';
const TCP_SERVER_PORT = 5555;


function extractUrl(text) {
    const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g;
    return text.match(urlRegex) || []; 
}

const createPost = async (username, nickname, profilePic, postText, img, published, comment) => {
    const urls = extractUrl(postText); 
    if (urls.length > 0) {
        const isPostDenied = await sendUrlsViaTCP(urls);
        if (isPostDenied) {
            console.log('Post denied by TCP server due to one or more URLs.');
            return { error: 'Post denied by server due to URL content.' };
        }
    }

    const post = new Post({ username, nickname, profilePic, postText, img, comment });
    if (published) post.published = published;
    const savedPost = await post.save();
    return { data: savedPost };
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

   
    const urls = extractUrl(postText);
    if (urls.length > 0) {
        const isPostDenied = await sendUrlsViaTCP(urls);
        if (isPostDenied) {
            console.log('Update denied by TCP server due to one or more URLs.');
            return { error: 'Update denied by server due to URL content.' };
        }
    }

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


function sendUrlsViaTCP(urls) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        const formattedUrls = urls.map(url => `2\n${url}`).join('\n');

        client.connect(TCP_SERVER_PORT, TCP_SERVER_HOST, () => {
            console.log('TCP Connection established. Sending URLs batch.');
            client.write(formattedUrls);
        });

        client.on('data', (data) => {
            console.log('Received data from TCP server:', data.toString());
            client.end(); 
            resolve(data.toString().trim() === 'true'); 
        });

        client.on('error', (err) => {
            console.error('TCP Connection Error:', err);
            reject(err);
        });

        client.on('end', () => {
            console.log('TCP connection closed');
        });
    });
}


module.exports = {getAllPosts, createPost, getPostByUsername, getPostByFriendUsername, getPosts, updatePost, deletePost, likePost }