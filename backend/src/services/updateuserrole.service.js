const pool = require("../db");

const roleHierarchy = {
  member: 1,
  admin: 2,
  owner: 3,
};

function shapeResponse(row, update) {
  return {
    membershipId: row.membership_id,
    role: row.role,
    action: update,
  };
}

async function changeUserRole(actorId, targetId, newRole, orgId, actorRole) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const targetMembershipResult = await client.query(
      `SELECT role, membership_id FROM membership
       WHERE user_id = $1 AND org_id = $2
       FOR UPDATE`,
      [targetId, orgId],
    );

    if (targetMembershipResult.rowCount === 0) {
      throw { code: "TARGET_DOES_NOT_EXIST" };
    }

    if (!roleHierarchy[newRole]) {
      throw { code: "INVALID_ROLE" };
    }

    if (actorId === targetId) {
      throw { code: "SELF_UPDATING_IS_FORBIDDEN" };
    }

    const targetRole = targetMembershipResult.rows[0].role;
    const targetMembershipId = targetMembershipResult.rows[0].membership_id;

    if (roleHierarchy[actorRole] <= roleHierarchy[targetRole]) {
      throw { code: "FORBIDDEN" };
    }

    if (newRole === "owner") {
      throw { code: "FORBIDDEN" };
    }

    if (roleHierarchy[newRole] > roleHierarchy[actorRole]) {
      throw { code: "FORBIDDEN" };
    }

    if (newRole === targetRole) {
      throw { code: "INVALID_UPDATE" };
    }

    const updateResult = await client.query(
      `UPDATE membership SET role = $1
       WHERE membership_id = $2
       RETURNING membership_id, role`,
      [newRole, targetMembershipId],
    );

    if (updateResult.rowCount === 0) {
      throw { code: "UPDATE_FAILED" };
    }

    const updatedRow = updateResult.rows[0];
    const action =
      roleHierarchy[updatedRow.role] > roleHierarchy[targetRole]
        ? "PROMOTED"
        : "DEMOTED";

    await client.query(
      `INSERT INTO audit_logs(actor_user_id, action, entity_type, entity_id)
       VALUES ($1, $2, $3, $4)`,
      [actorId, action, "membership", updatedRow.membership_id],
    );

    await client.query("COMMIT");
    return shapeResponse(updatedRow, action);

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { changeUserRole };