const express = require('express');
const router = express.Router();
const { registerUser } = require('../services/pg-logins');

// Signup route - renders signup.ejs
router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET signup route called');
  res.render('signup', { messages: req.flash('error') });
});

// Signup route - creates a new user in the logins table
router.post('/', async (req, res) => {
  if (DEBUG) console.log('POST signup route called');
  const { username, email, password } = req.body;

  try {
    const newUser = await registerUser(username, email, password);
    res.redirect('/login');
  } catch (err) {
    console.log('Error in POST signup route');
    console.log(err);
    if (err.message.includes('username') || err.message.includes('email')) {
      req.flash('error', err.message);
    }
    res.redirect('/signup');
  }
});

module.exports = router;
