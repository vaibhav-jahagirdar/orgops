const pool = require("../db");
const crypto = require("crypto");

const REFRESH_TOKEN_DAYS = process.env.REFRESH_TOKEN_DAYS;

const JWT_EXPIRES_IN = "15m";

async function refreshSession(refreshToken) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const tokenResult = await client.query(
      `SELECT id, user_id,expires_at, revoked_at, replaced_by_token_id
       FROM refresh_tokens WHERE token_hash = $1
       FOR UPDATE `,
    );
    if(tokenResult.rowCount === 0) {
      throw {code: "INVALID_TOKEN"}
    }
    const tokenRow = tokenResult.rows[0]
    
  } catch (error) {}
}
