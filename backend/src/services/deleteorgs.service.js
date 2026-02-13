const pool = require("../db");

async function deleteOrgs(orgId, userId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleteOrgResult = await client.query(
      `DELETE FROM orgs
             WHERE id = $1
             RETURNING id`,
      [orgId],
    );

    if (deleteOrgResult.rowCount === 0) {
      throw { code: "ORG_DELETION_FAILED" };
    }
    await client.query(
      `
            INSERT INTO audit_logs(actor_user_id, action, entity_type, entity_id)
            VALUES($1, $2, $3, $4)
            `,
      [userId, "DELETE_ORG", "org", orgId],
    );
    await client.query("COMMIT");
    return { orgId, userId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  deleteOrgs,
};
