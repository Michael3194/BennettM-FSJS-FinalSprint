const dal = require('./pg-database');

const search = async (searchString) => {
  if (DEBUG) console.log('search() function called');

  const sql = `SELECT * FROM movies \
               WHERE title LIKE $1 OR genre LIKE $1 OR description LIKE $1`;
  try {
    const searchResults = await dal.query(sql, [`%${searchString}%`]);

    // If the searchResults array is empty, log a message saying so
    if (searchResults.rows.length === 0) {
      if (DEBUG) console.log('No search results found');
    } else {
      // Else, log the search results
      if (DEBUG)
        console.log(`Search successful, results: ${searchResults.rows}`);
    }

    return searchResults.rows; // Return the search results
  } catch (err) {
    // Catch any errors
    console.log(`Error in search() function in pg-search.js`);
    throw err;
  }
};

module.exports = { search };
