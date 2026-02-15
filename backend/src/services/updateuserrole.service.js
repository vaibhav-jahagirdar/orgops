const pool = require("../db");

const roleHirerarchy = {
  member: 1,
  admin: 2,
  owner: 3,
};

async function changeUserrRole(actorId, targetId, newRole, orgId, actorRole) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const targetMemberShipResult = await client.query(
      `SELECT role,membership_id FROM membership
             WHERE user_id =$1 AND org_id = $2`,
      [targetId, orgId],
    );
    if (targetMemberShipResult.rowCount === 0) {
      throw { code: "TARGET_DOES_NOT_EXIST" };
    }
    if (!roleHirerarchy[newRole]) {
      throw { code: "INVALID_ROLE" };
    }
    if (actorId === targetId) {
      throw { code: "SELF_UPDATING_IS_FORBIDDEN" };
    }
    const targetRole = targetMemberShipResult.rows[0].role;

    const targetMembershipId = targetMemberShipResult.rows[0].membership_id;

    if (roleHirerarchy[actorRole] <= roleHirerarchy[targetRole]) {
      throw { code: "FORBIDDEN" };
    }
    if (newRole === "owner") {
      throw { code: "FORBIDDEN" };
    }
    if (roleHirerarchy[newRole] > roleHirerarchy[actorRole]) {
      throw { code: "FORBIDDEN" };
    }
    if (newRole === targetRole) {
      throw { code: "INVALID_UPDATE" };
    }

    const updateMember = await client.query(
      `UPDATE membership SET role = $1 WHERE membership_id = $2
       RETURNING membership_id,role
       FOR UPDATE`,
      [newRole, targetMembershipId],
    );

    if (updateMember.rowCount === 0) {
      throw { code: "UPDATE_FAILED" };
    }
    let update;
    if (
      roleHirerarchy[updateMember.rows[0].role] > roleHirerarchy[targetRole]
    ) {
      update = "PROMOTED";
    } else {
      update = "DEMOTED";
    }

    await client.query(
      `INSERT into audit_logs(actor_user_id, action , entity_type, entity_id)
        VALUES ($1, $2, $3, $4)`,
      [actorId, update, "role", updateMember.rows[0].membership_id],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  changeUserrRole
}
