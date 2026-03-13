const pool = require("../../db")
const AppError = require("../../utils/AppError")

async function getMe(userId) {
    const [userResult, orgsResult] = await Promise.all([
        pool.query(
            `SELECT id, name, email FROM users WHERE id = $1`,
            [userId]
        ),
        pool.query(
            `SELECT o.id, o.name, m.role
             FROM orgs o
             JOIN membership m ON m.org_id = o.id
             WHERE m.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        )
    ])

    if (userResult.rowCount === 0) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND")
    }

    return {
        ...userResult.rows[0],
        orgs: orgsResult.rows
    }
}

module.exports = getMe