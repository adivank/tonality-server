const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

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
 * Route imports
 */
const loginRoute = require('./routes/login');

/**
 * Routes
 */
app.post('/login', loginRoute);

app.listen(8080, () => {
  console.log(`Server started at: http://localhost:${PORT}`)
})

