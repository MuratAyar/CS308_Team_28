const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
    content: { type: String, required: true }, // The actual comment text
    timestamp: { type: Date, default: Date.now }, // When the comment was made
});

module.exports = mongoose.model('Comment', commentSchema);
