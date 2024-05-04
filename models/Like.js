// like model

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likeBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Assuming the user who likes the post is referenced from a User model
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', likeSchema);