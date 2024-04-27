// like model

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likeBy: { type: String, required: true },
});
    
module.exports = mongoose.model('Like', likeSchema);