const pool = require("../db");

async function deleteTask(orgId, projectId, taskId, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      DELETE FROM tasks
      WHERE id = $1
        AND org_id = $2
        AND project_id = $3
      RETURNING id
      `,
      [taskId, orgId, projectId]
    );

    if (result.rowCount === 0) {
      throw { code: "TASK_NOT_FOUND" };
    }

    await client.query(
      `
      INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, "TASK_DELETED", "task", taskId]
    );

    await client.query("COMMIT");

    return { id: taskId };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { deleteTask };