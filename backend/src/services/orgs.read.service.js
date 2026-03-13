const pool = require("../db")
const AppError = require("../utils/AppError")

async function listOrgsForUser(userId) {
    const result = await pool.query(
        `
        SELECT
            o.id,
            o.name,
            o.created_at,
            m.role
        FROM orgs o
        JOIN membership m ON m.org_id = o.id
        WHERE m.user_id = $1
        ORDER BY o.created_at DESC
        `,
        [userId]
    )

    return result.rows
}

async function getOrg(orgId, userId) {
    const result = await pool.query(
        `
        SELECT
            o.id,
            o.name,
            o.created_at,
            m.role,
            (
                SELECT COUNT(*)
                FROM membership
                WHERE org_id = o.id
            ) AS member_count
        FROM orgs o
        JOIN membership m ON o.id = m.org_id
        WHERE o.id = $1
          AND m.user_id = $2
        `,
        [orgId, userId]
    )

    if (result.rowCount === 0) {
        throw new AppError("Org not found", 404, "ORG_NOT_FOUND")
    }

    return result.rows[0]
}

module.exports = { listOrgsForUser, getOrg }