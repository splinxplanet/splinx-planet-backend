// post models

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postCreator: { type: String, required: true },
  postText: { type: String, required: true },
  postImage: String,
  postTimestamp: { type: Date, default: Date.now },
  postLikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }
});

module.exports = mongoose.model('Post', postSchema);
