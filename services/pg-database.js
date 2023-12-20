/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: pg-database.js
// Description: Contains the code to connect to the PostgreSQL database
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

// Require the dotenv package to load environment variables
require('dotenv').config();

// Import the Pool class from the pg package
const Pool = require('pg').Pool;

// Create a new Pool instance
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

module.exports = pool;
