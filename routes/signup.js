const express = require('express');
const router = express.Router();

// Signup route - renders signup.ejs
router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET signup route called');
  res.render('signup');
});

module.exports = router;
