const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri);

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
