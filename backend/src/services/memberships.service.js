const pool = require("../db");
const AppError = require("../utils/AppError");

async function addMember({ actorUserId, userId, email, orgId, role }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    
    const normalizedEmail = email ? email.trim().toLowerCase() : undefined;

 
    if (!userId && normalizedEmail) {
      const userRes = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [normalizedEmail]
      );

      if (userRes.rowCount === 0) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }

      userId = userRes.rows[0].id;
    }

    if (!userId) {
      throw new AppError(
        "UserId or email is required",
        400,
        "USER_ID_OR_EMAIL_REQUIRED"
      );
    }

    const orgResult = await client.query("SELECT 1 FROM orgs WHERE id = $1", [orgId]);
    if (orgResult.rowCount === 0) {
      throw new AppError("Organization not found", 404, "ORG_NOT_FOUND");
    }

    if (!normalizedEmail) {
      const userResult = await client.query("SELECT 1 FROM users WHERE id = $1", [userId]);
      if (userResult.rowCount === 0) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }
    }

    const actorMembership = await client.query(
      `SELECT role FROM membership WHERE user_id = $1 AND org_id = $2`,
      [actorUserId, orgId]
    );

    if (actorMembership.rowCount === 0) {
      throw new AppError("Actor is not a member of this org", 403, "ACTOR_NOT_MEMBER");
    }

    const actorRole = actorMembership.rows[0].role;

    if (actorRole !== "admin" && actorRole !== "owner") {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    if (Number(actorUserId) === Number(userId)) {
      throw new AppError("You cannot add yourself", 400, "CANNOT_ADD_SELF");
    }

    if (actorRole === "admin" && role !== "member") {
      throw new AppError(
        "Admins can only assign member role",
        403,
        "INVALID_ROLE_ASSIGNMENT"
      );
    }

    if (role === "owner") {
      throw new AppError("Ownership cannot be granted", 403, "CANNOT_GRANT_OWNERSHIP");
    }

    
    const existing = await client.query(
      `SELECT 1 FROM membership WHERE user_id = $1 AND org_id = $2`,
      [userId, orgId]
    );

    if (existing.rowCount > 0) {
      throw new AppError("User is already a member", 409, "ALREADY_MEMBER");
    }

    const membershipResult = await client.query(
      `
      INSERT INTO membership (user_id, org_id, role)
      VALUES ($1, $2, $3)
      RETURNING membership_id
      `,
      [userId, orgId, role]
    );

    const membershipId = membershipResult.rows[0].membership_id;

    await client.query(
      `
      INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
      VALUES ($1, $2, $3, $4)
      `,
      [actorUserId, "MEMBER_ADDED", "membership", membershipId]
    );

    await client.query("COMMIT");

    return { membershipId,email,  userId, orgId, role };
  } catch (err) {
    await client.query("ROLLBACK");

   
    if (err && err.code === "23505") {
      throw new AppError("User is already a member", 409, "ALREADY_MEMBER");
    }

    if (err instanceof AppError) throw err;

    throw new AppError("Internal server error", 500, "INTERNAL_ERROR");
  } finally {
    client.release();
  }
}

module.exports = { addMember };