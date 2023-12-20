/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: pg-search.js
// Description: Contains the code to perform a search on the PostgreSQL database
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

// Import the module that contains the code to connect to the PostgreSQL database
const dal = require('./pg-database');

/* --------------------------------------------------------- */
/*                    Function: search()                     */
/* --------------------------------------------------------- */
/* Description: An async function that performs a search on  */
/*              the PostgreSQL database.                     */
/*                                                           */
/* Parameter(s): searchString - The string to search for     */
/*               in the database                             */
/*               username - The username of the user         */
/* --------------------------------------------------------- */
const search = async (searchString, username) => {
  if (DEBUG) console.log('search() function called');

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

  // The SQL query to perform the search
  const sql = `SELECT * FROM movies \
               WHERE title LIKE $1 OR genre LIKE $1 OR description LIKE $1`;

  try {
    // Try to perform the search
    const searchResults = await dal.query(sql, [`%${searchString}%`]);

    // Insert the search string into the search_data table
    // Allowing us to keep track of what users are searching for
    const insertSearchQuery = `
        INSERT INTO search_data (username, search_string)
        VALUES ($1, $2);
    `;
    await dal.query(insertSearchQuery, [username, searchString]);

    // If the searchResults array is empty, log a message saying so
    if (searchResults.rows.length === 0) {
      if (DEBUG) console.log('No search results found');
    } else {
      // Else, log the number of results found
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
}; // End of search() function
/* _________________________________________________________ */
/* _________________________________________________________ */

module.exports = { search };
