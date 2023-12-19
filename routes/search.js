const express = require('express');
const router = express.Router();
const { search } = require('../services/pg-search');

router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET search route called');

  const searchString = req.query.searchString;
  const searchResults = await search(searchString);

  res.render('index', { searchResults, searchString });
});

module.exports = router;
