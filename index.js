// Imports
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');

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

// Home route: localhost:3000/  - renders index.ejs
app.get('/', async (req, res) => {
  if (DEBUG) console.log('GET index route called');
  res.render('index', { message: req.flash('success') });
});

// Logout route - clears the session and redirects to the login page
app.get('/logout', (req, res) => {
  if (DEBUG) console.log('GET logout route called');
  req.session.destroy();
  res.redirect('/login');
});

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);

// Set up the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
