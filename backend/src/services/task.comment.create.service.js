const pool = require("../db")

async function createComment(orgId, taskId, userId, comment) {
  const taskResult = await pool.query(
    `SELECT id FROM tasks WHERE id = $1 AND org_id = $2`,
    [taskId, orgId]
  )

  if (taskResult.rowCount === 0) {
    throw { code: "TASK_DOES_NOT_EXIST" }
  }

  const insertResult = await pool.query(
    `INSERT INTO task_comments(task_id, org_id, comment, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING id, comment, task_id, created_by, created_at`,
    [taskId, orgId, comment, userId]
  )

  if (insertResult.rowCount === 0) {
    throw { code: "COMMENTING_FAILED" }
  }

  const commentRow = insertResult.rows[0]

  const userResult = await pool.query(
    `SELECT name, email FROM users WHERE id = $1`,
    [commentRow.created_by]
  )

  if (userResult.rowCount === 0) {
    throw { code: "USER_NOT_FOUND" }
  }

  return {
    ...commentRow,
    author: userResult.rows[0]
  }
}

module.exports = { createComment }