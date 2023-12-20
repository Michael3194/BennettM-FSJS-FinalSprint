const dal = require('./pg-database');

const search = async (searchString, username) => {
  if (DEBUG) console.log('search() function called');
  console.log('user = ' + username);

  // Ensure that the search_data table exists
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS search_data (
        search_id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        search_string VARCHAR(100),
        search_time TIMESTAMP DEFAULT NOW()
    );
  `;
  await dal.query(createTableQuery);

  const sql = `SELECT * FROM movies \
               WHERE title LIKE $1 OR genre LIKE $1 OR description LIKE $1`;
  try {
    const searchResults = await dal.query(sql, [`%${searchString}%`]);

    // Insert the search string into the search_data table
    const insertSearchQuery = `
        INSERT INTO search_data (username, search_string)
        VALUES ($1, $2);
    `;
    await dal.query(insertSearchQuery, [username, searchString]);

    // If the searchResults array is empty, log a message saying so
    if (searchResults.rows.length === 0) {
      if (DEBUG) console.log('No search results found');
    } else {
      // Else, log the search results
      if (DEBUG)
        console.log(
          `Search successful. ${searchResults.rows.length} results found`
        );
    }

    return searchResults.rows; // Return the search results
  } catch (err) {
    // Catch any errors
    console.log(`Error in search() function in pg-search.js`);
    throw err;
  }
};

module.exports = { search };
