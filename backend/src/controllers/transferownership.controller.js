const { transferOwnership } = require("../services/transferownership.service")

const statusMap = {
    SELF_TRANSFER_IS_FORBIDDEN:  400,
    MEMBERSHIP_NOT_FOUND:        404,
    ONLY_OWNER_CAN_TRANSFER:     403,
    TARGET_ALREADY_OWNER:        400,
    DIRECT_PROMOTION_IS_FORBIDDEN: 400,
    DEMOTION_FAILED:             500,
    PROMOTION_FAILED:            500,
}

async function transferOwnershipController(req, res) {
    try {
        const actorId        = req.user.id
        const { orgId, targetId } = req.params

        const result = await transferOwnership(
            actorId,
            parseInt(targetId, 10),
            parseInt(orgId, 10)
        )

        return res.status(200).json({
            message: "Ownership transferred successfully",
            data: result,
        })

    } catch (err) {
        if (err.code) {
            const status = statusMap[err.code] ?? 400
            return res.status(status).json({ error: err.code })
        }
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" })
    }
}

module.exports = { transferOwnershipController }