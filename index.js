// Imports and set up the express app
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const PORT = 3000;

global.debug = true; // Set to true to see console logs for debugging

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

// Set up the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
