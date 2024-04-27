// community models

const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  communityCreator: { type: String, required: true },
  communityName: { type: String, required: true },
  coverImage: String,
  communityMembers: [String],
  communityDescription: String,
  communityGuidelines: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

module.exports = mongoose.model('Community', communitySchema);
