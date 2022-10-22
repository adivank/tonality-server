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
  }
})

const User = mongoose.model('User', userSchema);

/**
 * Route imports
 */
// const login = require('./routes/login');
// const register = require('./routes/register');

/**
 * Routes
 */
app.post('/login', async (req, res) => {
  const {username, password} = req.body;
  const foundUser = User.findOne({username}, (err, found) => {
    if (!err) {
      if(found.password === password) {
        const token = jwt.sign({name: found.username}, 'hello', { expiresIn: "1h" });

        return res.cookie("auth._token.cookie", token, {
          httpOnly: true
        }).send({
          username: found.username
        });
      } else {
        res.send({
          error: 'Wrong Username or Password'
        })
      };
    } else {
      console.log(err);
      res.send("Some error occured!")
    }
}).catch(err => console.log("Error occured, " + err));
  console.log(foundUser);
});

app.post('/register', async (req, res) => {
  const {username, password} = req.body;
  try {
    await User.create({
      username,
      password
    })
    .then(newUser => {
      const token = jwt.sign({name: newUser.username}, 'hello', { expiresIn: "1h" });

      return res.cookie("auth._token.cookie", token, {
        httpOnly: true
      }).send({
        username: newUser.username
      });
    });
  } catch(error) {
    console.log(error);
  }
});

app.listen(8080, () => {
  console.log(`Server started at: http://localhost:${PORT}`)
})

