// comment schema for the comments on the posts
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commenter: { type: String, required: true },
  commenterName: {type: String, required: true},
  commentText: { type: String, required: true },
  commentTimestamp: { type: Date, default: Date.now },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
