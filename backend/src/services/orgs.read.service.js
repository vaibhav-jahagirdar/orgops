const pool = require("../db");

async function listOrgsForUser(userId) {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.name,
      o.created_at,
      m.role
    FROM orgs o
    JOIN membership m ON m.org_id = o.id
    WHERE m.user_id = $1
    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

module.exports = {
  listOrgsForUser
};