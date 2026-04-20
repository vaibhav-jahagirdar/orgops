const pool = require("../../db");
const crypto = require("crypto");
const AppError = require("../../utils/AppError");

async function logoutUser(refreshToken) {
  if (!refreshToken || typeof refreshToken !== "string") {
    throw new AppError("Invalid refresh token", 400, "INVALID_TOKEN");
  }

  const client = await pool.connect();

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const result = await client.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW()
       WHERE token_hash = $1
       AND revoked_at IS NULL
       RETURNING id`,
      [hashedToken]
    );

    if (result.rowCount === 0) {
      throw new AppError("Token already revoked or invalid", 400, "INVALID_TOKEN");
    }

    return { success: true };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  logoutUser,
};