const pool = require("../db");

const allowedTransitions = {
    todo: ["in_progress", "blocked", "done"],
    in_progress: ["blocked", "done"],
    blocked: ["in_progress", "done"],
    done:[]

};

async function updateStatus(userId, role, taskId, newStatus, orgId) {

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
    const currentStatus =  taskRow.status;

    if (taskRow.assigned_to !== userId && (role !== "admin") && (role !== "owner")) {
        throw {code: "FORBIDDEN"}
    }

    if(!allowedTransitions[currentStatus].includes(newStatus)) {
        throw {code: "INVALID_STATUS_TRANSITION"}
    }
    const updateStatusResult = await client.query(
        `UPDATE tasks SET status = $1 
         WHERE id = $2 AND org_id = $3
         RETURNING id, status, title`,
         [newStatus, taskId, orgId]

    )
    if(updateStatusResult.rowCount === 0) {
        throw {code: "STATUS_UPDATION_FAILED"}
    }

    await client.query(
        `INSERT into audit_logs(actor_user_id, action, entity_type, entity_id)
         VALUES($1, $2, $3, $4)`,
         [userId, "STATUS_UPDATE", "tasks", taskId]
    )
    await client.query("COMMIT");

    return updateStatusResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    throw error

  } finally {
    client.release()
  }
}


module.exports = {
    updateStatus
}