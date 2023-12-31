/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Project: S3 Final Sprint

// Filename: index.js
// Description: Main entry point for the app
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                      DEPENDENCIES                         */
/* --------------------------------------------------------- */
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
/* _________________________________________________________ */
/* _________________________________________________________ */

const app = express(); // Create the express app
const PORT = 3000; // Set the port for the server

global.DEBUG = true; // Set to true to see console logs for debugging

app.set('view engine', 'ejs'); // Set view engine to ejs
app.use(express.static('public')); // Set public folder as static
app.use(express.urlencoded({ extended: true })); // Set up body parser so we can use req.body
app.use(methodOverride('_method')); // Set up method override so we can use other HTTP methods

// Set up session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// Set up flash messages
const flash = require('connect-flash');
app.use(flash());

// Set up res.locals variables
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// Give access to flash messages in all views by default
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

/* --------------------------------------------------------- */
/*                          ROUTES                           */
/* --------------------------------------------------------- */
// Home route: localhost:3000/  - renders index.ejs
app.get('/', async (req, res) => {
  if (DEBUG) console.log('GET index route called');
  res.render('index', { message: req.flash('success'), error: null });
});

// About route: localhost:3000/about  - renders about.ejs
app.get('/about', async (req, res) => {
  if (DEBUG) console.log('GET about route called');
  res.render('about');
});

// Logout route - clears the session and redirects to the login page
app.get('/logout', (req, res) => {
  if (DEBUG) console.log('GET logout route called');
  req.session.destroy(); // Clear the session
  res.redirect('/login');
});
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                          ROUTERS                          */
/* --------------------------------------------------------- */
const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);
/* _________________________________________________________ */
/* _________________________________________________________ */

// Set up the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
