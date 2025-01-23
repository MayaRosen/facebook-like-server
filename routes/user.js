const express = require('express');
var router = express.Router();

const userController = require('../controllers/user');
router.route('/')
    .post(userController.createUser);
router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

const postController = require('../controllers/post');
const friendController = require('../controllers/friend');
router.route('/:id/friends')
    .get(friendController.getFriends)
    .post(friendController.addFriendReq);
router.route('/:id/friends/:fid')
    .patch(friendController.approveFriend)
    .delete(friendController.deleteFriend);
router.route('/:id/friends/:fid/posts')
    .get(postController.getFriendPost);
router.route('/:id/pendingFriends')
    .get(friendController.getPendingFriends);

router.route('/:id/posts')
    .get(postController.getPost)
    .post(postController.createPost);
router.route('/:id/posts/:pid')
    .patch(postController.updatePost)
    .delete(postController.deletePost);
router.route('/:id/posts/:pid/likes')
    .patch(postController.likePost);

module.exports = router;