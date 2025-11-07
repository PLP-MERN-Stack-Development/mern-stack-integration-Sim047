
const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  authorName: String, body: String, createdAt: { type: Date, default: Date.now }
});
const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  comments: [CommentSchema]
}, { timestamps: true });
module.exports = mongoose.model('Post', PostSchema);
