const pool = require("../db");

async function createProject(name, orgId, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO projects (org_id, name, created_by)
       VALUES ($1, $2, $3)
       RETURNING id, org_id, name, created_at`,
      [orgId, name, userId]
    );

    await client.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, "PROJECT_CREATED", "project", result.rows[0].id]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      throw { code: "PROJECT_NAME_ALREADY_TAKEN" };
    }

    throw err;
  } finally {
    client.release();
  }
}

async function deleteProject(userId, orgId, projectId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const deleteResult = await client.query(
      `DELETE FROM projects
       WHERE id = $1 AND org_id = $2
       RETURNING id`,
      [projectId, orgId]
    );

    if (deleteResult.rowCount === 0) {
      throw { code: "PROJECT_DOES_NOT_EXIST" };
    }

    await client.query(
      `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [userId, "PROJECT_DELETED", "project", projectId]
    );

    await client.query("COMMIT");

    return { projectId };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createProject, deleteProject };