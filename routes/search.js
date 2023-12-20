const express = require('express');
const router = express.Router();
const { search: pgSearch } = require('../services/pg-search');
const { search: mongoSearch } = require('../services/mongo-search');

router.get('/', async (req, res) => {
  if (DEBUG) console.log('GET search route called');

  try {
    // Get the search string and database options from the query string
    const searchString = req.query.searchString;
    const username = req.session.username;
    const databases = req.query.database;
    console.log('username: ' + req.session.username);

    // If databases is undefined, the user did not select any database options
    if (!databases) {
      res.render('index', {
        error: 'Please choose at least one database option',
      });
      return;
    }

    let searchResults = [];

    // Check if the databases variable is an array, if it is then that means that the user selected both database options
    if (Array.isArray(databases)) {
      if (DEBUG)
        console.log(
          'User selected both database options, performing search on both databases'
        );

      // Perform search using both databases
      const pgResults = await pgSearch(searchString, username);
      if (DEBUG) console.log('Search on PostgreSQL database successful');

      const mongoResults = await mongoSearch(searchString, username);
      if (DEBUG) console.log('Search on MongoDB database successful');

      // Combine the results from both databases into one array
      searchResults = [...pgResults, ...mongoResults];
    } else {
      if (databases === 'postgres') {
        if (DEBUG)
          console.log(
            'User selected PostgreSQL database option, performing search on PostgreSQL database'
          );

        // Perform search using PostgreSQL database
        searchResults = await pgSearch(searchString, username);
      } else if (databases === 'mongodb') {
        if (DEBUG)
          console.log(
            'User selected MongoDB database option, performing search on MongoDB database'
          );

        // Perform search using MongoDB database
        searchResults = await mongoSearch(searchString, username);
      }
    }

    // Database search successful, render the index page with the search results
    res.render('index', { searchResults, searchString, error: null });
  } catch (error) {
    // If an error occurs, log the error and redirect to the '503' page
    console.error(error);
    res.render('index', {
      searchResults: [],
      searchString: '',
      error: error.message,
    });
  }
});

module.exports = router;
