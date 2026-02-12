const pool = require("../db");

async function addMember({ actorUserId, userId, orgId, role }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orgResult = await client.query("SELECT 1 FROM orgs WHERE id = $1", [
      orgId,
    ]);
    if (orgResult.rowCount === 0) {
      throw { code: "ORG_NOT_FOUND" };
    }

 
    const userResult = await client.query("SELECT 1 FROM users WHERE id = $1", [
      userId,
    ]);
    if (userResult.rowCount === 0) {
      throw { code: "USER_NOT_FOUND" };
    }
    const actorMembership = await client.query(
      `
      SELECT role
      FROM membership
      WHERE user_id = $1 AND org_id = $2
      `,
      [actorUserId, orgId],
    );

    if (actorMembership.rowCount === 0) {
      throw { code: "ACTOR_NOT_MEMBER" };
    }

    if (
      actorMembership.rows[0].role !== "admin" &&
      actorMembership.rows[0].role !== "owner"
    ) {
      throw { code: "FORBIDDEN" };
    }

    if (actorUserId === userId) {
      throw { code: "CANNOT_ADD_SELF" };
    }

    const actorRole = actorMembership.rows[0].role;

    

    if (actorRole === "admin") {
      if (role !== "member") {
        throw { code: "INVALID_ROLE_ASSIGNMENT" };
      }
    }
    if (role === "owner") {
      throw { code: "CANNOT_GRANT_OWNERSHIP" };
    }

    const membershipResult = await client.query(
      `
      INSERT INTO membership (user_id, org_id, role)
      VALUES ($1, $2, $3)
      RETURNING membership_id
      `,
      [userId, orgId, role],
    );

    const membershipId = membershipResult.rows[0].membership_id;

    await client.query(
      `
      INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
      VALUES ($1, $2, $3, $4)
      `,
      [actorUserId, "MEMBER_ADDED", "membership", membershipId],
    );

    await client.query("COMMIT");

    return { membershipId, userId, orgId, role };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { addMember };
