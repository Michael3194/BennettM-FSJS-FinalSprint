/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: mongo-search.js
// Description: Contains the code to perform a search on the MongoDB database
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

// Import the connect function from the mongo-database.js file
const { connect } = require('./mongo-database');

/* --------------------------------------------------------- */
/*                    Function: search()                     */
/* --------------------------------------------------------- */
/* Description: An async function that performs a search on  */
/*              the MongoDB database.                        */
/*                                                           */
/* Parameter(s): searchString - The string to search for     */
/*               in the database                             */
/* --------------------------------------------------------- */
const search = async (searchString) => {
  if (DEBUG)
    console.log('mongodb search() function called from mongo-search.js');

  const client = await connect();

  try {
    const db = client.db('fsjs_final_sprint');
    const collection = db.collection('moviedata');

    const searchStringRegExp = new RegExp(searchString, 'i');

    // Perform a search in the collection
    const results = await collection
      .find({
        $or: [
          { title: searchStringRegExp },
          { genre: searchStringRegExp },
          { description: searchStringRegExp },
        ],
      })
      .toArray();

    if (DEBUG)
      console.log(`Search successful. ${results.length} results found`);

    return results;
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}; // End of search() function
/* _________________________________________________________ */
/* _________________________________________________________ */

module.exports = { search };
