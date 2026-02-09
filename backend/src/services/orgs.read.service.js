const pool = require("../db")

async function listOrgsForUser(userID) {
    try {
        const orgResult = await pool.query(
            'SELECT o.id , o.name , o.created_at FROM orgs o JOIN membership m ON m.org_id = o.id WHERE m.user_id = $1 '
            , [userID]
        )
        const {id: userID, orgs} = orgResult.rows[0] 

        return {
            userID, orgs
        }
    } catch (error) {
        throw error
        
    }
    
}

module.exports = {userID, orgs}