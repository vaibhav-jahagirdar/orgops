const pool = require("../db");

async function assignTask(userId, targetId, orgId, taskId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const taskResult = await client.query(
      `SELECT id, title,assigned_to, status
             FROM tasks WHERE id = $1 AND 
             org_id = $2
             FOR UPDATE`,
      [taskId, orgId],
    );
    if (taskResult.rowCount === 0) {
      throw { code: "INVALID_TASK_ID" };
    }

    const taskRow = taskResult.rows[0];
    if (taskRow.status === "DONE") {
      throw { code: "CANNOT_ASSIGN_COMPLETED_TASK" };
    }
    const previousAssignee = taskRow.assigned_to;


    if (previousAssignee === targetId) {
      throw { code: "NO_STATE_CHANGE" };
    }


    if (targetId !== null) {
      const membershipCheck = await client.query(
        `SELECT 1 FROM membership
     WHERE user_id = $1 AND org_id = $2`,
        [targetId, orgId],
      );

      if (membershipCheck.rowCount === 0) {
        throw { code: "INVALID_TARGET_ID" };
      }
    }


    const assignResult = await client.query(
      `UPDATE tasks
   SET assigned_to = $1
   WHERE id = $2
   RETURNING id, org_id, project_id, title`,
      [targetId, taskId],
    );

    if (assignResult.rowCount === 0) {
      throw { code: "TASK_ASSIGNING_FAILED" };
    }

    let action;

    if (previousAssignee === null && targetId !== null)
      action = "TASK_ASSIGNED";
    else if (previousAssignee !== null && targetId === null)
      action = "TASK_UNASSIGNED";
    else action = "TASK_REASSIGNED";

    await client.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
   VALUES ($1, $2, $3, $4)`,
      [userId, action, "task", taskId],
    );

    await client.query("COMMIT");
    return assignResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
    assignTask
}