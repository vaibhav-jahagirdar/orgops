const pool = require("../db")
const AppError = require("../utils/AppError")

async function createTask({
  userId,
  orgId,
  projectId,
  title,
  description,
  priority,
  assignedTo,
  dueDate
}) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const projectResult = await client.query(
      `SELECT id FROM projects WHERE id = $1 AND org_id = $2`,
      [projectId, orgId]
    )

    if (projectResult.rowCount === 0) {
      throw new AppError(
        "Project does not exist in this organization",
        404,
        "INVALID_PROJECT_ID"
      )
    }

    if (assignedTo) {
      const userResult = await client.query(
        `SELECT id FROM org_members WHERE user_id = $1 AND org_id = $2`,
        [assignedTo, orgId]
      )

      if (userResult.rowCount === 0) {
        throw new AppError(
          "Assigned user is not part of this organization",
          400,
          "INVALID_ASSIGNEE"
        )
      }
    }

    const normalizedDueDate = dueDate ? new Date(dueDate) : null

    const taskResult = await client.query(
      `INSERT INTO tasks
       (org_id, project_id, title, description, status, priority, created_by, assigned_to, due_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, title, description, status, priority, assigned_to, due_date, created_at, updated_at`,
      [
        orgId,
        projectId,
        title,
        description,
        "todo",
        priority,
        userId,
        assignedTo ?? null,
        normalizedDueDate
      ]
    )

   await client.query(
  `INSERT INTO audit_logs
   (actor_user_id, action, entity_type, entity_id)
   VALUES ($1,$2,$3,$4)`,
  [userId, "TASK_CREATED", "task", taskResult.rows[0].id]
)

    await client.query("COMMIT")

    return taskResult.rows[0]

  } catch (err) {
  await client.query("ROLLBACK")

  console.error("FULL ERROR:", err)

  if (err instanceof AppError) throw err

  throw new AppError(
    err.message, 
    500,
    "TASK_CREATION_FAILED"
  )
} finally {
    client.release()
  }
}
module.exports = {
  createTask
}