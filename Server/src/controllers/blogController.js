const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const newBlog = new Blog({ ...req.body, author: req.user.id });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate("author", "username");
  res.json(blogs);
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "username");
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.author.toString() !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  Object.assign(blog, req.body);
  await blog.save();
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog.author.toString() !== req.user.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
};
