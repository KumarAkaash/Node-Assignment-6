const express = require('express');
const app = express();


// Import routes
const blogRoute = require('./routes/blog');


//Router MIddlewares
app.use(express.json());
app.use('/', blogRoute);
app.use(bodyParser.json());

// define the endpoints

// fetch blogs by page and search keyword
app.get('/blog', async (req, res) => {
  const { page = 1, search = '' } = req.query;
  const regex = new RegExp(search, 'i');
  const blogs = await Blog.find({ topic: regex })
    .sort('-posted_at')
    .skip((page - 1) * 5)
    .limit(5);
  res.json({ status: 'success', result: blogs });
});

// create a new blog
app.post('/blog', async (req, res) => {
  const { topic, description, posted_by } = req.body;
  const blog = new Blog({ topic, description, posted_by, posted_at: new Date() });
  await blog.save();
  res.json({ status: 'success', result: blog });
});

// update an existing blog
app.put('/blog/:id', async (req, res) => {
  const { id } = req.params;
  const { topic, description, posted_by } = req.body;
  const blog = await Blog.findByIdAndUpdate(id, { topic, description, posted_by }, { new: true });
  res.json({ status: 'success', result: blog });
});

// delete a blog
app.delete('/blog/:id', async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  res.json({ status: 'success', result: blog });
});
module.exports = app;
