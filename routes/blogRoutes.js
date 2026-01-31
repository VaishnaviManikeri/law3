const express = require('express');
const Blog = require('../models/Blog');
const upload = require('../middleware/uploadBlog');
const router = express.Router();

/* ================= PUBLIC ================= */

// Get all published blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
  res.json(blogs);
});

// Get single blog
router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

/* ================= ADMIN ================= */

// Admin: all blogs
router.get('/admin/all', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// CREATE blog with image
router.post('/', upload.single('coverImage'), async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    coverImage: req.file ? `/uploads/blogs/${req.file.filename}` : '',
  });

  res.status(201).json(blog);
});

// UPDATE blog with image
router.put('/:id', upload.single('coverImage'), async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    data.coverImage = `/uploads/blogs/${req.file.filename}`;
  }

  const blog = await Blog.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  res.json(blog);
});

// DELETE blog
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
