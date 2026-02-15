const changeUserRole = require("../services/updateuserrole.service") 



async function updateUserRole(req, res) {
  try {
    const actorId = req.user.id;
    const actorRole = req.membership.role;

    const { orgId, targetId } = req.params;
    const { role: newRole } = req.body;

    if (!newRole) {
      return res.status(400).json({ error: "ROLE_REQUIRED" });
    }

    await changeUserRole(
      actorId,
      parseInt(targetId, 10),
      newRole,
      parseInt(orgId, 10),
      actorRole
    );

    return res.status(200).json({ message: "ROLE_UPDATED" });

  } catch (err) {
    if (err.code) {
      return res.status(400).json({ error: err.code });
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

module.exports = {
  updateUserRole,
};