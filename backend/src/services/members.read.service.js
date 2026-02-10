const pool = require("../db")


async function listMembersForOrgs (orgId) {
    const result = await pool.query(
        `SELECT m.user_id, m.role
        FROM membership m 
        WHERE m.org_id = $1 `,
        [orgId]
    )
     return result.rows;
}

module.exports = {
    listMembersForOrgs
}