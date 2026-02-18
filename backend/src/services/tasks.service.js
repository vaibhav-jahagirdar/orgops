async function createTask(userId, projectId, orgId, targetId, title, status, description, priority, dueDays) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `SELECT id 
       FROM projects 
       WHERE id = $1 AND org_id = $2`,
      [projectId, orgId]
    );

    if (projectResult.rowCount === 0) {
      throw { code: "INVALID_PROJECT_ID" };
    }

    
    if (dueDays < 0) {
      throw { code: "INVALID_DUE_DATE" };
    }

    const dueDate = new Date(Date.now() + dueDays * 86400000);

    const taskResult = await client.query(
      `INSERT INTO tasks 
       (org_id, project_id, title, description, status, priority, created_by, due_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, title, status, priority, assigned_to, due_date`,
      [orgId, projectId, title, description, status, priority,  userId, dueDate]
    );

    await client.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, "TASK_CREATED", "task", taskResult.rows[0].id]
    );

    await client.query("COMMIT");

    return taskResult.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
    createTask
}