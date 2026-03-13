const express = require("express")
const router = express.Router()
const requireAuth = require("../middleware/requireAuth")
const { requireMembership } = require("../middleware/requireMembership")
const { listMyOrgs, getOrgById } = require("../controllers/orgs.read.controller")

router.get("/", requireAuth, listMyOrgs)
router.get("/:orgId", requireAuth, requireMembership(), getOrgById)

module.exports = router