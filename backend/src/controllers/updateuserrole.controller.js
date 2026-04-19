const { changeUserRole } = require("../services/updateuserrole.service")

const statusMap = {
  FORBIDDEN:                  403,
  TARGET_DOES_NOT_EXIST:      404,
  SELF_UPDATING_IS_FORBIDDEN: 403,
  INVALID_ROLE:               400,
  INVALID_UPDATE:             400,
  UPDATE_FAILED:              500,
}

async function updateUserRole(req, res) {
  try {
    const actorId   = req.user.id
    const actorRole = req.membership.role

    const { orgId, targetId } = req.params
    const { role: newRole }   = req.body

    if (!newRole) {
      return res.status(400).json({ error: "ROLE_REQUIRED" })
    }

    const result = await changeUserRole(
      actorId,
      parseInt(targetId, 10),
      newRole,
      parseInt(orgId, 10),
      actorRole
    )

    return res.status(200).json({ message: "ROLE_UPDATED", data: result })

  } catch (err) {
    if (err.code) {
      const status = statusMap[err.code] ?? 400
      return res.status(status).json({ error: err.code })
    }
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" })
  }
}

module.exports = { updateUserRole }