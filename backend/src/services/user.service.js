const pool = require("../db")

async function createUser(email) {
    const query = `INSERT INTO users(email) VALUES($1) RETURNING id, email, created_at `;
    const result = await pool.query(query,[email]);
    return result.rows[0]
}

module.exports = {
    createUser
}