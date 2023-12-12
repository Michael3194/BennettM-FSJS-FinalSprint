// Imports and set up the express app
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const PORT = 3000;

global.DEBUG = true; // Set to true to see console logs for debugging

// Set view engine to ejs
app.set('view engine', 'ejs');
// Set public folder as static
app.use(express.static('public'));
// Set up body parser so we can use req.body
app.use(express.urlencoded({ extended: true }));
// Set up method override so we can use other HTTP methods
app.use(methodOverride('_method'));

// Home route - renders index.ejs
app.get('/', async (req, res) => {
  if (DEBUG) console.log('GET index route called');
  res.render('index');
});

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

// Set up the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
