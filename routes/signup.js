/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: signup.js
// Description: Contains the routes for the signup page
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                      DEPENDENCIES                         */
/* --------------------------------------------------------- */
const express = require('express');
const router = express.Router();

const { registerUser } = require('../services/pg-logins');
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                          ROUTES                           */
/* --------------------------------------------------------- */
// Signup route - renders signup.ejs
router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET signup route called');
  res.render('signup', { messages: req.flash('error') });
});

// Signup route - creates a new user in the logins table
router.post('/', async (req, res) => {
  if (DEBUG) console.log('POST signup route called');

  // Get the username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // Call the registerUser function to add the user to the logins table
    const newUser = await registerUser(username, email, password);
    // If successful, redirect to the login page
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
/* _________________________________________________________ */
/* _________________________________________________________ */

module.exports = router;
