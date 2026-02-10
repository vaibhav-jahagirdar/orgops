const { listMembersForOrg } = require("../services/members.read.service");
const pool = require("../db");

async function listMembers(req, res) {
  try {
    const orgId = req.params.orgId;
    const actorUserId = req.user.id;

    const actorMembership = await pool.query(
      `
      SELECT 1
      FROM membership
      WHERE user_id = $1 AND org_id = $2
      `,
      [actorUserId, orgId]
    );

    if (actorMembership.rowCount === 0) {
      return res.status(403).json({ error: "FORBIDDEN" });
    }


    const members = await listMembersForOrg(orgId);


    res.json({ members });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

module.exports = { listMembers };