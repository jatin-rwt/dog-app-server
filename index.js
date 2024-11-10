const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
dotenv.config();
app.use(cors());
cors({
  origin: "*",
});
const PORT = process.env.PORT;
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//connect with mongodb
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("db connected"))
  .catch((err) => {
    err;
  });

//data seeder
const dataSeeder = require("./dataSeeder");
const users = require("./data/Users");
const User = require("./models/User");
const Blog = require("./models/Blog");
app.use("/server/seed", dataSeeder);

//jwt
const JWT_SECRET = process.env.JWT_SECRET;

//login route
app.post("/login", cors(), jsonParser, async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password)
  if (!email || !password) {
    return res.status(400).json({
      error: "Please provide all the required fields",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ error: "User does not exist" });
  }

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  const userName = await User.find({ email: user.email });
  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "24h",
  });

  res
    .status(200)
    .json({ token, name: userName[0].name, message: "Login successful" });
});

//authenticate
const authenticateJWT = (req, res, next) => {
  const token = req.header("token")?.split(" ")[0];
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

//get
app.get("/blogs", authenticateJWT, jsonParser, async (req, res) => {
  const { category } = req.query;
  console.log(category);
  const blog = await Blog.find({ category: req.query.category });

  res.status(200).json({
    success: true,
    data: blog,
  });
});
//post
app.post("/blogs", authenticateJWT, jsonParser, async (req, res) => {
  const {
    category,
    title = "",
    description = "",
    content = "cnasdjkvnkjasd vkjv",
    email,
    image,
    name = "s dj vsdkj v",
  } = req.body;
  const newBlog = new Blog({
    title,
    description,
    category,
    email,
    content,
    name,
    image,
  });
  const savedBlog = await newBlog.save();

  // Respond with the saved blog entry
  res
    .status(201)
    .json({ message: "Blog created successfully", blog: savedBlog });
});

app.get("/blogs/:id", authenticateJWT, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404).json({
      success: false,
      error: "not found",
    });
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});
//test user route
app.get("/server/users", (req, res) => {
  res.send(users);
});

//test blog route
app.get("/server/blogs", (req, res) => {
  res.send(blogs);
});

app.listen(PORT || 3000, () => {
  console.log(`server is running on port: ${PORT}`);
});
