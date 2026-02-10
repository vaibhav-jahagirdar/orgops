const pool = require("../db")

async function transferOwnerShip(actorId, userId, orgId) {
    const client = await pool.connect();
     try {
        await client.query("BEGIN");
         const userResult = await client.query(
            `SELECT 1 FROM users WHERE id = $1`,[userId]
         )

         if (userResult.rowCount === 0) {
            throw {code: "USER_DOES_NOT_EXIST"}
         }
        const orgResult = await client.query(
            `SELECT 1 FROM orgs WHERE id = $1`,
        [orgId]
        )
        if(orgResult.rowCount === 0) {
            throw {code: "ORG_NOT_FOUND"}
        }
           const actorMembership = await client.query(
              `SELECT role,membership_id FROM  membership WHERE user_id = $1 AND org_id = $2  `,
              [actorId, orgId]
           )
           

        if(actorMembership.rowCount === 0) {
            throw {error: "MEMBERSHIP_NOT_FOUND"}
        }
         const actorRole = actorMembership.rows[0].role;
         const actorMembershipID = actorMembership.rows[0].membership_id

        const userMembership = await client.query(
            `SELECT role,membership_id FROM membership WHERE user_id =$1 AND org_id = $2 `,
            [userId, orgId]
        ) 
        if(userMembership.rowCount === 0 ){
            throw {code: "MEMBERSHIP_NOT_FOUND"}
        }
        const targetRole = userMembership.rows[0].role;
        const targetMembershipId = userMembership.rows[0].membership_id

        if(actorRole !== "owner") {
            throw {code: "ONLY_OWNER_CAN_TRANSFER" }
        }
        if (targetRole === "owner") {
            throw {code:"TARGET_ALREADY_OWNER"}
        }

        if(targetRole === "member") {
            throw {code: "DIRECT_PROMOTION_IS_FORBIDDEN"}
        }
        if(actorId === userId) {
            throw {code: "SELF_TRANSFER_IS_FORBIDDEN"}
        }
       const demoteOwner  = await client.query(
          `UPDATE membership SET role = 'admin' WHERE membership_id = $1 returning membership_id`, [actorMembershipID]
       )
       if(demoteOwner.rowCount === 0) {
        throw {error : "DEMOTION_FAILED"}
       }

       const promoteTarget  = await client.query(
            `UPDATE membership SET role = 'owner' WHERE membership_id = $1`,[targetMembershipId]
       )
     if (promoteTarget.rowCount === 0) {
        throw {error: "PROMOTION_FAILED"}
     }
       await client.query(
        `INSERT into audit_logs (actor_user_id, action, entity_type, entity_id)
             VALUES ($1,$2,$3,$4)`,[actorId, "ownership_transfer","org",orgId]
       )
           await client.query("COMMIT");

           return {userId, actorId , orgId}
     } catch (error) {
        await client.query("ROLLBACK")
        throw error
        
     } finally {
        client.release();
     }
}