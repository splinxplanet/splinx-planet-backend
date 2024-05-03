// post routes

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Routes
// create new post
router.post('/', postController.createPost);
// like a post
router.put('/:id/like', postController.likePost);
// get all post by community id
router.get('/:id', postController.getPostById);
// delete a post
router.delete('/:id', postController.deletePost);
// create a new comment
router.post('/:id/comment', postController.createComment);
// delete a comment
router.delete('/:postId/comment/:commentId', postController.deleteComment);
// create a reply
router.post('/:postId/comment/:commentId/reply', postController.createReply);
// delete a reply
router.delete('/:postId/comment/:commentId/reply/:replyId', postController.deleteReply);

module.exports = router;
