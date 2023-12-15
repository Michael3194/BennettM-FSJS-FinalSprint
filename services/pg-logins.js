const bcrypt = require('bcrypt');
const dal = require('./pg-database');

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
};

module.exports = { registerUser };
