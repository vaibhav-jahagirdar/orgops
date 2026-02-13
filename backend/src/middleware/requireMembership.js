const pool = require("../db");

const roleHirerarchy = {
  member: 1,
  admin: 2,
  owner: 3,
};

function requireMembership(minRole) {
  return async (req, res, next) => {
    const userId = req.user.id;
    const { orgId } = req.params;

    const result = await pool.query(
      `SELECT role FROM membership
             WHERE user_id = $1 AND org_id = $2`,
      [userId, orgId],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "FORBIDDEN" });
    }
    const userRole = result.rows[0].role;

    if (minRole) {
      if (roleHirerarchy[userRole] < roleHirerarchy[minRole]) {
        return res.status(403).json({ error: "FORBIDDEN" });
      }
    }

    req.membership = { role: userRole };
    next();
  };
}
