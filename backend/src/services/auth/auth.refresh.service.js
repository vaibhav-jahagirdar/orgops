const pool = require("../db");
const crypto = require("crypto");
const { revokeAllUserTokens } = require("./auth.token.service");
const jwt = require("jsonwebtoken");

const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || "7", 10);

const JWT_EXPIRES_IN = "15m";

const JWT_SECRET = process.env.JWT_SECRET;

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
       AND expires_at > NOW()
       FOR UPDATE `,
      [hashedToken],
    );
    if (tokenResult.rowCount === 0) {
      throw { code: "INVALID_TOKEN" };
    }
    const tokenRow = tokenResult.rows[0];

    if (
      tokenRow.replaced_by_token_id !== null &&
      tokenRow.revoked_at !== null
    ) {
      await revokeAllUserTokens(client, tokenRow.user_id);
      await client.query("COMMIT");
      throw { code: "TOKEN_REUSE_DETECTED" };
    }

    if (tokenRow.revoked_at !== null) {
      throw { code: "INVALID_TOKEN" };
    }

    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newHashedToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 86400000);

    const newTokenResult = await client.query(
      `INSERT INTO refresh_tokens(user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [tokenRow.user_id, newHashedToken, expiresAt],
    );

    const newTokenId = newTokenResult.rows[0].id;

    await client.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW(),replaced_by_token_id = $1
       WHERE id = $2 
      `,
      [newTokenId, tokenRow.id],
    );

    await client.query("COMMIT");
    const access_token = jwt.sign({ userId: tokenRow.user_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { refreshToken: newRefreshToken, access_token };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
