// reply schema for the replies to the comments

const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  replyBy: { type: String, required: true },
  replyText: { type: String, required: true },
  replyTimestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reply', replySchema);
