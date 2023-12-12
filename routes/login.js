const express = require('express');
const router = express.Router();

// Login route - renders login.ejs
router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET login route called');
  res.render('login');
});

module.exports = router;
