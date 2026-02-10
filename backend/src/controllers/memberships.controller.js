const membershipService = require("../services/memberships.service");

async function addMember(req, res) {
  try {
    const orgId = Number(req.params.orgId);
    const { userId, role } = req.body;

    const actorUserId = req.cookies?.access_token;

    if (!actorUserId) {
      return res.status(400).json({ error: "actor user id missing" });
    }

    if (!userId || !role) {
      return res.status(400).json({ error: "userId and role are required" });
    }

    const membership = await membershipService.addMember({
      actorUserId,
      userId,
      orgId,
      role,
    });

    return res.status(201).json(membership);
  } catch (err) {
    if (err.message === "ORG_NOT_FOUND") {
      return res.status(404).json({ error: "org not found" });
    }

    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "user not found" });
    }

    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ error: "not allowed" });
    }

    console.error(err);
    return res.status(500).json({ error: "internal server error" });
  }
}

module.exports = {
  addMember,
};
