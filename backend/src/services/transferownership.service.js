const pool = require("../db")

async function transferOwnership(actorId, userId, orgId) {
    const client = await pool.connect()
    try {
        await client.query("BEGIN")

        if (actorId === userId) {
            throw { code: "SELF_TRANSFER_IS_FORBIDDEN" }
        }

        const actorMembership = await client.query(
            `SELECT role, membership_id FROM membership
             WHERE user_id = $1 AND org_id = $2
             FOR UPDATE`,
            [actorId, orgId]
        )
        if (actorMembership.rowCount === 0) {
            throw { code: "MEMBERSHIP_NOT_FOUND" }
        }

        const actorRole = actorMembership.rows[0].role
        const actorMembershipId = actorMembership.rows[0].membership_id

        if (actorRole !== "owner") {
            throw { code: "ONLY_OWNER_CAN_TRANSFER" }
        }

        const targetMembership = await client.query(
            `SELECT role, membership_id FROM membership
             WHERE user_id = $1 AND org_id = $2
             FOR UPDATE`,
            [userId, orgId]
        )
        if (targetMembership.rowCount === 0) {
            throw { code: "MEMBERSHIP_NOT_FOUND" }
        }

        const targetRole = targetMembership.rows[0].role
        const targetMembershipId = targetMembership.rows[0].membership_id

        if (targetRole === "owner") {
            throw { code: "TARGET_ALREADY_OWNER" }
        }

        if (targetRole === "member") {
            throw { code: "DIRECT_PROMOTION_IS_FORBIDDEN" }
        }

        const demoteOwner = await client.query(
            `UPDATE membership SET role = 'admin'
             WHERE membership_id = $1
             RETURNING membership_id`,
            [actorMembershipId]
        )
        if (demoteOwner.rowCount === 0) {
            throw { code: "DEMOTION_FAILED" }
        }

        const promoteTarget = await client.query(
            `UPDATE membership SET role = 'owner'
             WHERE membership_id = $1
             RETURNING membership_id`,
            [targetMembershipId]
        )
        if (promoteTarget.rowCount === 0) {
            throw { code: "PROMOTION_FAILED" }
        }

        await client.query(
            `INSERT INTO audit_logs (actor_user_id, action, entity_type, entity_id)
             VALUES ($1, $2, $3, $4)`,
            [actorId, "OWNERSHIP_TRANSFERRED", "org", orgId]
        )

        await client.query("COMMIT")
        return { userId, actorId, orgId }

    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }
}

module.exports = { transferOwnership }