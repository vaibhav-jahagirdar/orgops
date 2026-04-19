const express = require("express")
const router = express.Router()

const { transferOwnershipController } = require("../controllers/transferownership.controller")
const requireAuth = require("../middleware/requireAuth")
const { requireMembership } = require("../middleware/requireMembership")

router.patch(
    "/:orgId/members/:targetId/transfer-ownership",
    requireAuth,
    requireMembership("owner"),
    transferOwnershipController
)

module.exports = router