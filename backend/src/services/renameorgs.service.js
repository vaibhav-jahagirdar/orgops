const pool = require("../db")


async function renameOrg(name, userId, orgId) {

    const client = await pool.connect()
    try {
        await client.query("BEGIN")
        const renameOrgResult = await client.query(
            `UPDATE orgs SET name = $1 WHERE id = $2 RETURNING id, name , created_at `,
             [name, orgId]
        )
        if(renameOrgResult.rowCount === 0) {
            throw {code: "ORG_NOT_FOUND"}
        } 
        await client.query(`INSERT into audit_logs(actor_user_id, action, entity_type, entity_id)
            VALUES ($1, $2, $3, $4)`,
        [userId,"orgs_rename", "orgs", orgId ])

        await client.query("COMMIT")
         
        return renameOrgResult.rows[0]
        
    } catch (error) {
        await client.query("ROLLBACK")
        throw error
        
    } finally {
        client.release()
    }
}


module. exports = {
    renameOrg
}
