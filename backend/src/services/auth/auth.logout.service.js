const { success } = require("zod");
const pool = require("../db")
const cyrpto = require("crypto")

async function logoutUser(refreshToken) {
    const client = await pool.connect()
    try {
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex")

      await client.query(
        `UPDATE refresh_tokens
         SET revoked_at = NOW()
         WHERE token_hash = $1
         AND revoked_at IS NULL`,
         [hashedToken]
      );

      await client.query("COMMIT");

      return {success: true}
       
    } catch (error) {
        await client.query("ROLLBACK");
        throw error
        
    } finally {
        client.release();
    }
}

module.exports = {
    logoutUser
}