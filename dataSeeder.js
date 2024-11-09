const router = require('express').Router();
const User = require('./models/User');
const users = require('./data/Users');
const Blog = require('./models/Blog');
const blogs = require('./data/Blogs');

router.post('/users', async(req, res) => {
    console.log("command running")
    await User.deleteMany({});
    const UserSeeder = await User.insertMany(users);
    res.send({UserSeeder});

})

router.post('/blogs', async(req, res) => {
    console.log("command running")
    await Blog.deleteMany({});
    const BlogSeeder = await Blog.insertMany(blogs);
    res.send({BlogSeeder});

})

module.exports = router;