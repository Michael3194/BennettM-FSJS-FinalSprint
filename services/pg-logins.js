/* --------------------------------------------------------- */
/*                         INFORMATION                       */
/* --------------------------------------------------------- */
// Filename: pg-logins.js
// Description: Contains the code to perform operations on the logins table
// Author: Michael Bennett
// Last Modified: 2023-11-20
/* _________________________________________________________ */
/* _________________________________________________________ */

const bcrypt = require('bcrypt');
const dal = require('./pg-database');

/* --------------------------------------------------------- */
/*                    Function: registerUser()               */
/* --------------------------------------------------------- */
/* Description: An async function that adds a new user to    */
/*              the logins table.                            */
/*                                                           */
/* Parameter(s): username - The username of the new user     */
/*               email - The email of the new user           */
/*               password - The password of the new user     */
/* --------------------------------------------------------- */
const registerUser = async (username, email, password) => {
  if (DEBUG) console.log('registerUser function called');
  const sql =
    'INSERT INTO logins (username, email, hashed_password) \
                 VALUES ($1, $2, $3) \
                 RETURNING *;';
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await dal.query(sql, [username, email, hashedPassword]);

    if (DEBUG) console.log('user credentials added to logins table');
    return result.rows[0];
  } catch (err) {
    if (err.code === '23505') {
      // Unique constraint violation
      // const field determines whether username or email is the duplicate
      if (DEBUG)
        console.log(
          'Duplicate username or email error in registerUser function'
        );
      const field = err.detail.includes('uq_logins_username')
        ? 'username'
        : 'email';
      throw new Error(`User with the given ${field} already exists`);
    } else console.log('Error in registerUser function in pg-logins.js');
    throw err;
  }
}; // End of registerUser() function
/* _________________________________________________________ */
/* _________________________________________________________ */

/* --------------------------------------------------------- */
/*                    Function: getUserByUsername()          */
/* --------------------------------------------------------- */
/* Description: An async function that gets a user from the  */
/*              logins table by username.                    */
/*                                                           */
/* Parameter(s): username - The username of the user to get  */
/* --------------------------------------------------------- */
const getUserByUsername = async (username) => {
  if (DEBUG) console.log('getUserByUsername function called');

  // SQL query to get the user with the given username
  const sql = 'SELECT * FROM logins WHERE username = $1;';

  try {
    const result = await dal.query(sql, [username]);

    // Check if the user was found
    if (result.rows.length > 0) {
      if (DEBUG) console.log('User found');
      return result.rows[0];
    } else {
      if (DEBUG) console.log('User not found');
      return null;
    }

    // Catch any errors
  } catch (error) {
    if (DEBUG) console.log('Error in getUserByUsername function');
    return null;
  }
}; // End of getUserByUsername() function
/* _________________________________________________________ */
/* _________________________________________________________ */

module.exports = { registerUser, getUserByUsername };
