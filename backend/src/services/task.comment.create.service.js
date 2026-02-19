const pool = require("../db");

async function createComment(orgId, taskId, userId, role, comment) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const taskResult = await client.query(
      `SELECT title, assigned_to
             FROM tasks WHERE id = $1
             AND org_id = $2
             `,
      [taskId, orgId],
    );
    if (taskResult.rowCount === 0) {
      throw { code: "TASK_DOES_NOT_EXIST" };
    }
    const taskRow = taskResult.rows[0];

    if (
      taskRow.assigned_to !== userId &&
      role !== "admin" &&
      role !== "owner"
    ) {
      throw { code: "FORBIDDEN" };
    }

    const createComment = await client.query(
      `INSERT INTO task_comments(task_id, org_id, comment, created_by )
             VALUES ($1, $2, $3, $4)
             RETURNING id, comment, task_id `,
      [taskId, orgId, comment, userId],
    );

    if (createComment.rowCount === 0) {
      throw { code: "COMMENTING_FAILED" };
    }

    await client.query("COMMIT");
    return createComment.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
