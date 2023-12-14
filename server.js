require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Post = require('./models/Post'); // Assuming this file exists with schema and model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN })); // Specify allowed origins

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Error creating post", error: err });
  }
});

app.put('/posts/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: "Error updating post", error: err });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err });
  }
});

// Server Start
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;
