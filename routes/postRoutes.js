// post routes

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Routes
router.post('/', postController.createPost);
router.put('/:id/like', postController.likePost);
router.get('/:id', postController.getPostById);
router.delete('/:id', postController.deletePost);
router.post('/:id/comment', postController.createComment);
router.delete('/:postId/comment/:commentId', postController.deleteComment);
router.post('/:postId/comment/:commentId/reply', postController.createReply);
router.delete('/:postId/comment/:commentId/reply/:replyId', postController.deleteReply);

module.exports = router;
