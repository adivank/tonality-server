const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require("dotenv").config();

/**
 * Configuration and variables
 */
const PORT = process.env.PORT;
app.use(cors({credentials: true, origin: process.env.SITE_URL}));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true
  })
);

/**
 * Database connection
 */
const mongooseConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
mongoose.connect(process.env.MONGODB_URL, mongooseConnectOptions);

/**
 * Computations
 */

const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');

/**
 * Routes
 */
app.post('/login', loginRoute);
app.post('/register', registerRoute);

app.post('/create-post', async (req, res) => {
  const { user, post } = req.body;
  try {
    await Post.create({
      user,
      post
    })

    res.send('Success');
  } catch(err) {
    console.log(err);
  }
})

app.get('/get-posts', postRoutes.getPostArray);

app.post('/get-user', userRoutes.getUser);

app.listen(8080, () => {
  console.log(`Server started at: http://localhost:${PORT}`)
})
