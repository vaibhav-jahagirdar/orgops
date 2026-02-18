const pool = require("../db");

async function renameProject(projectId, orgId, newName, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `
      SELECT name
      FROM projects
      WHERE id = $1 AND org_id = $2
      FOR UPDATE
      `,
      [projectId, orgId]
    );

    if (projectResult.rowCount === 0) {
      throw { code: "PROJECT_NOT_FOUND" };
    }

    if (projectResult.rows[0].name === newName) {
      throw { code: "NEW_NAME_MUST_BE_DIFFERENT" };
    }

    const renameResult = await client.query(
      `
      UPDATE projects
      SET name = $1
      WHERE id = $2
      RETURNING id, name, org_id
      `,
      [newName, projectId]
    );

    await client.query(
      `
      INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
      VALUES ($1, $2, $3, $4)
      `,
      [userId, "PROJECT_RENAMED", "project", projectId]
    );

    await client.query("COMMIT");

    return renameResult.rows[0];

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