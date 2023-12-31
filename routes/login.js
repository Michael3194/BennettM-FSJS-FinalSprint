/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: login.js
// Description: Contains the routes for the login page
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                      DEPENDENCIES                         */
/* --------------------------------------------------------- */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { getUserByUsername } = require('../services/pg-logins');
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                          ROUTES                           */
/* --------------------------------------------------------- */
// Login route - renders login.ejs
router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET login route called');
  res.render('login');
});

// Server-side route to handle login form submission
router.post('/', async (req, res) => {
  if (DEBUG) console.log('POST login route called');
  const { username, password } = req.body;
  console.log(password);

  const user = await getUserByUsername(username);
  console.log(user);

  if (!user) {
    if (DEBUG) console.log('User not found');
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }

  // Compare the password to the hashed one in the database
  const passwordMatch = await bcrypt.compare(password, user.hashed_password);

  if (!passwordMatch) {
    if (DEBUG) console.log('Password does not match');
    req.flash('error', 'Invalid username or password');
    return res.redirect('/login');
  }

  // Save the user's ID to the session
  req.session.userId = user.login_id;
  // Save the user's username to the session
  req.session.username = user.username;

  if (DEBUG) console.log(`User ${user.username} logged in`);

  req.flash('success', `Welcome back, ${user.username}!`);

  // Login successful, redirect to the homepage
  res.redirect('/');
});
/* _________________________________________________________ */
/* _________________________________________________________ */

module.exports = router;
