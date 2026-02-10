const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "15m";

async function register({ email, name, password }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    let userId;

    if (userResult.rowCount === 0) {
      const insertUser = await client.query(
        `INSERT INTO users (email, name)
         VALUES ($1, $2)
         RETURNING id`,
        [email, name || null]
      );
      userId = insertUser.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    const credsResult = await client.query(
      `SELECT 1 FROM user_credentials WHERE user_id = $1`,
      [userId]
    );

    if (credsResult.rowCount > 0) {
      throw { code: "EMAIL_ALREADY_REGISTERED" };
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await client.query(
      `INSERT INTO user_credentials (user_id, password_hash)
       VALUES ($1, $2)`,
      [userId, passwordHash]
    );

    await client.query("COMMIT");

    const token = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: { id: userId, email, name },
      token,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}



async function login({ email, password }) {

  const userResult = await pool.query(
    `
    SELECT u.id, u.email, uc.password_hash
    FROM users u
    JOIN user_credentials uc ON uc.user_id = u.id
    WHERE u.email = $1
    `,
    [email]
  );

  if (userResult.rowCount === 0) {
    throw { code: "INVALID_CREDENTIALS" };
  }

  const { id: userId, password_hash } = userResult.rows[0];

  const isMatch = await bcrypt.compare(password, password_hash);
  if (!isMatch) {
    throw { code: "INVALID_CREDENTIALS" };
  }

  const token = jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: {id: userId, email},
    token };
}

module.exports = { register, login };