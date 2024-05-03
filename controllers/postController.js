// post controllers functions

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Reply = require('../models/Reply');
const Like = require('../models/Like');

// create a new post
exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Could not create post' });
  }
};

// like a post
exports.likePost = async (req, res) => {
  try {
        const postId = req.params.postId;
        const userId = req.body.userId; // Assuming userId is sent in the request body
        
        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ likeBy: userId });
        if (existingLike) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Create a new like
        const like = new Like({
            likeBy: userId
        });

        // Save the like to the database
        await like.save();

        // Add the like to the post
        post.postLikes.push(like);
        await post.save();

        return res.status(201).json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// fetch all likes for a post
exports.getPostLikes = async (req, res) => {
  try {
        const postId = req.params.postId;
        
        // Check if the post exists
        const post = await Post.findById(postId).populate('postLikes'); // Populate the postLikes field
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Extract and return the likes
        const likes = post.postLikes;
        return res.status(200).json({ likes });
    } catch (error) {
        console.error('Error fetching post likes:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// get all posts in a community
exports.getPostById = async (req, res) => {
  // get all post that match the community id
  try {
    const posts = await Post.find({ community: req.params.id });
    res.json(posts);
  } catch (error) {
    res.status(404).json({ error: 'Post not found' });
  }
};

// delete a post
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete post' });
  }
};

// create a new comment
exports.createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const newComment = await Comment.create(req.body);
    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Could not create comment' });
  }
};

// delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const index = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId);
    if (index !== -1) {
      post.comments.splice(index, 1);
      await post.save();
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete comment' });
  }
};

// create a new reply
exports.createReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const newReply = await Reply.create(req.body);
    comment.replies.push(newReply);
    await comment.save();
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: 'Could not create reply' });
  }
};

// delete a reply
exports.deleteReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const index = comment.replies.findIndex(reply => reply._id.toString() === req.params.replyId);
    if (index !== -1) {
      comment.replies.splice(index, 1);
      await comment.save();
    }
    await Reply.findByIdAndDelete(req.params.replyId);
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete reply' });
  }
};
