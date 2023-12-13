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

  app.get('/posts', (req, res) => {
    Post.find()
      .then(posts => res.json(posts))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  app.post('/add', (req, res) => {
    const newPost = new Post({ title: req.body.title, content: req.body.content });
  
    newPost.save()
      .then(() => res.json('Post added!'))
      .catch(err => res.status(400).json('Error: ' + err));
  });

  app.put('/update/:id', (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        post.title = req.body.title;
        post.content = req.body.content;
  
        post.save()
          .then(() => res.json('Post updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });
  
  app.delete('/delete/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
      .then(() => res.json('Post deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
