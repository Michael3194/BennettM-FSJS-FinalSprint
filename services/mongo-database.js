/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: mongo-database.js
// Description: Contains the code to connect to the MongoDB database
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

const { MongoClient } = require('mongodb'); // Import the MongoClient class

const uri = 'mongodb://127.0.0.1:27017'; // Connection string

const client = new MongoClient(uri); // Create a new MongoClient instance

// Function to connect to the MongoDB cluster
async function connect() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    return client;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connect };
