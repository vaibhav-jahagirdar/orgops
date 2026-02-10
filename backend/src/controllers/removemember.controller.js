const { removeMember } = require("../services/memberships.service");

async function removeMembership(req, res) {
  try {
    const actorUserId = req.user.id;
    const { orgId, userId } = req.params;

    const result = await removeMember(
      actorUserId,
      Number(userId),
      Number(orgId)
    );

    return res.status(200).json({
      success: true,
      removedMembershipId: result.removedId,
      userId: result.userID,
      orgId: result.orgId
    });
  } catch (error) {
    switch (error.code) {
      case "USER_NOT_FOUND":
      case "ORG_NOT_FOUND":
      case "USER_NOT_A_MEMBER":
        return res.status(404).json({ error: error.code });

      case "FORBIDDEN":
      case "OWNER_CANNOT_BE_REMOVED":
        return res.status(403).json({ error: error.code });

      case "MEMBERSHIP_DOES_NOT_EXIST":
        return res.status(400).json({ error: error.code });

      default:
        console.error(error);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
  }
}

module.exports = {
  removeMembership
};
