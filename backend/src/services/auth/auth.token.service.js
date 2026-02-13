async function revokeAllUserTokens (client, userId) {
    await client.query(
        `UPDATE refresh_tokens
         SET revoked_at = NOW()
         WHERE user_id =$1
         AND revoked_at IS NULL`,
         [userId]
    );
}

module.exports = {revokeAllUserTokens}