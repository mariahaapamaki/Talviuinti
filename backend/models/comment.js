const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PublicPlace', required: true },
  comment: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
