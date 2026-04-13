const express = require("express")
const router = express.Router()
const requireAtuh = require("../middleware/requireAuth")
const {requireMembership} = require("../middleware/requireMembership")
const { getDashboardDataController } = require("../controllers/dashboard.read.controller")
router.get("/:orgId/dashboard", requireAtuh, requireMembership(),getDashboardDataController)


module.exports = router
