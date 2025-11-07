const Post = require('../models/Post');

// Utility: clean slug generation
const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

// =====================
// GET ALL POSTS (Paginated + Search)
// =====================
exports.getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const q = req.query.q;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { content: new RegExp(q, 'i') },
      ];
    }

    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('categories')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (err) {
    next(err);
  }
};

// =====================
// GET SINGLE POST
// =====================
exports.getOne = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('categories');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

// =====================
// CREATE POST
// =====================
exports.create = async (req, res, next) => {
  try {
    const { title, content, categories } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = slugify(title);

    const post = new Post({
      title,
      slug,
      content,
      author: req.user ? req.user.id : null,
      categories: categories
        ? Array.isArray(categories)
          ? categories
          : [categories]
        : [],
    });

    if (req.file) {
      post.featuredImage = `/uploads/${req.file.filename}`;
    }

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// =====================
// UPDATE POST (with ownership check)
// =====================
exports.update = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only the author can update
    if (req.user && post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    const data = { ...req.body };

    if (req.file) {
      data.featuredImage = `/uploads/${req.file.filename}`;
    }

    // If title changes, update slug
    if (data.title) {
      data.slug = slugify(data.title);
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};

// =====================
// DELETE POST (with ownership check)
// =====================
exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Only the author can delete
    if (req.user && post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// =====================
// ADD COMMENT
// =====================
exports.addComment = async (req, res, next) => {
  try {
    const { authorName, body } = req.body;

    if (!body || !authorName) {
      return res.status(400).json({ error: 'Author name and comment body are required' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({ authorName, body });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};
