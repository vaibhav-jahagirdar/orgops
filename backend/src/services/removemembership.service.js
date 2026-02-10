const pool = require("../db")


async function removeMember(actorID, userID, orgId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const userResult = await client.query(
            `SELECT 1 FROM users WHERE id = $1`
        , [userID])
        if(userResult.rowCount === 0) {
            throw { code : "USER_NOT_FOUND"}
        }

        const orgResult = await client.query(
            `SELECT 1 FROM orgs WHERE id = $1`,
            [orgId]
        )
        if (orgResult.rowCount === 0) {
            throw {code: "ORG_NOT_FOUND"}
        }
        const userMemberShipResult = await client.query(
            `SELECT role FROM membership WHERE 
            user_id = $1 AND org_id = $2 `,
            [userID, orgId]
        )
        if(userMemberShipResult.rowCount === 0 ){
             throw {code: "USER_NOT_A_MEMBER"}
        }
        const actorMemberShipResult = await client.query(
            `SELECT role FROM membership 
            WHERE user_id = $1 AND org_id = $2`,
            [actorID, orgId]
        )

        if(actorMemberShipResult.rowCount === 0) {
            throw {code: "FORBIDDEN"}
        } 
        if(actorMemberShipResult.rows[0].role !== "admin" && actorMemberShipResult.rows[0].role !== "owner") {
            throw  {code: "FORBIDDEN"}
        }
        if (actorID === userID) {
            throw {code: "FORBIDDEN"}
        }
        const actorRole = actorMemberShipResult.rows[0].role;
        const targetRole = userMemberShipResult.rows[0].role;
         if(targetRole === "owner") {
            throw {code: "OWNER_CANNOT_BE_REMOVED"}
         } 
         if (actorRole === "admin" && targetRole !== "member") {
            throw {code: "FORBIDDEN"}
         }
         const deleteUser = await client.query(`
           DELETE FROM membership
           WHERE user_id = $1 AND org_id = $2 RETURNING membership_id `,
        [userID, orgId]);

        const removedId = deleteUser.rows[0].membership_id;

        if(!removedId) {
            throw {code: "MEMBERSHIP_DOES_NOT_EXIST"}
        }
        await client.query(
            `INSERT INTO audit_logs(actor_user_id, action, entity_type, entity_id)
             VALUES ($1,$2,$3,$4)`,
             [actorID,"MEMBERSHIP_REMOVED","membership", removedId ]
        )
        await client.query("COMMIT");

        return {removedId,userID, orgId}

    } catch (error) {
        await client.query("ROLLBACK");
        throw error
        
    } finally {
        client.release()
    }
}