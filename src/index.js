const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require("dotenv").config();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * Configuration and variables
 */
const PORT = 8080;
app.use(cors({credentials: true, origin: 'http://localhost:3001'}));
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
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  }
});

const postSchema = new Schema({
  user: {
    type: Object,
    required: true
  },
  post: {
    type: Object,
    required: true
  }
})

const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

/**
 * Computations
 */
const generateUserLink = function(email) {
  const atIndex = email.indexOf('@');
  if (!atIndex) {
    return;
  }

  return email.slice(0, atIndex);
}
// const login = require('./routes/login');
// const register = require('./routes/register');

/**
 * Routes
 */
app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  User.findOne({username}, (err, found) => {
    if (!err) {
      if(found && found.password === password) {
        const token = jwt.sign({name: found.username}, 'hello', { expiresIn: "1h" });

        return res.cookie("auth._token.cookie", token, {
          httpOnly: true
        }).send({
          username: found.username,
          name: found.name,
          surname: found.surname,
          pageLink: generateUserLink(found.username)
        });
      } else {
        const error = {
          errorDescription: 'Wrong Username or Password',
          errorClass: 'toast-error',
        };
        res.send({ error });
      };
    } else {
      console.log(err);
      res.send("Some error occured!")
    }
  }).catch(err => console.log("Error occured, " + err));
});

app.post('/register', async (req, res) => {
  const {username, password, name, surname} = req.body;
  try {
    await User.create({
      username,
      password,
      name,
      surname
    })
    .then(newUser => {
      const token = jwt.sign({name: newUser.username}, 'hello', { expiresIn: "1h" });

      return res.cookie("auth._token.cookie", token, {
        httpOnly: true
      }).send({
        username: newUser.username,
        name: newUser.name,
        surname: newUser.surname
      });
    });
  } catch(error) {
    console.log(error);
  }
});

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

app.get('/get-posts', async (req, res) => {
  await Post.find({}).then(postList => {
    res.send(postList);
  })
})

app.post('/get-user', async (req, res) => {
  const { username } = req.body;
  await User.findOne({username}, (err, found) => {
    if(found) {
      return res.send({
        username: found.username,
        name: found.name,
        surname: found.surname,
        pageLink: generateUserLink(found.username)
      });
    } else {
      const error = {
        errorDescription: 'Wrong Username or Password',
        errorClass: 'toast-error',
      };
      res.send({ error });
    };
  })
})

app.listen(8080, () => {
  console.log(`Server started at: http://localhost:${PORT}`)
})

