const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/Todo-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.post('/add', async (req, res) => {
  const newPost = new Post({ title: req.body.title, content: req.body.content });

  try {
    await newPost.save();
    res.json('Post added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.put('/update/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.title = req.body.title;
    post.content = req.body.content;

    await post.save();
    res.json('Post updated!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json('Post deleted.');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
