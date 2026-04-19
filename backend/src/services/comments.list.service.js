const pool = require("../db");

async function listComments(orgId, taskId, page, limit) {
    page  = Math.max(parseInt(page, 10) || 1, 1)
    limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
    const offset = (page - 1) * limit

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM task_comments WHERE task_id = $1 AND org_id = $2`,
        [taskId, orgId]
    )
    const total = parseInt(countResult.rows[0].count, 10)

    const result = await pool.query(
        `SELECT tc.id, tc.comment, tc.created_by, tc.created_at,
                u.name as author_name, u.email as author_email
         FROM task_comments tc
         JOIN users u ON u.id = tc.created_by
         WHERE tc.task_id = $1 AND tc.org_id = $2
         ORDER BY tc.created_at ASC
         LIMIT $3 OFFSET $4`,
        [taskId, orgId, limit, offset]
    )

    return {
        comments: result.rows,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    }
}

module.exports = { listComments }