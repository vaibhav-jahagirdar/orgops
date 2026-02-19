const pool = require("../db");

async function listComments(orgId, userId, taskId, role, page, limit) {
    page = Math.max(parseInt(page, 10) || 1, 1)
    limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100)
    const offset = (page - 1) * limit

    let where = `WHERE tc.task_id = $1 AND tc.org_id = $2`
    const values = [taskId, orgId]

    if (role === "member") {
        values.push(userId)
        where += ` AND t.assigned_to = $${values.length}`
    }

    const countQuery = `
        SELECT COUNT(*) 
        FROM task_comments tc
        JOIN tasks t ON tc.task_id = t.id
        ${where}`

    const countResult = await pool.query(countQuery, values)
    const total = parseInt(countResult.rows[0].count, 10)

    values.push(limit)
    values.push(offset)

    const dataQuery = `
        SELECT tc.id, tc.comment, tc.created_by, tc.created_at, tc.updated_at
        FROM task_comments tc
        JOIN tasks t ON tc.task_id = t.id
        ${where}
        ORDER BY tc.created_at DESC
        LIMIT $${values.length - 1}
        OFFSET $${values.length}`

    const result = await pool.query(dataQuery, values)
    return {
        comments: result.rows,
        pagination: {
            total,
            limit,
            page,
            totalPages: Math.ceil(total / limit)
        }
    }
}

module.exports = { listComments }