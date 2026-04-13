const express = require("express")
const router = express.Router()

const requireAuth = require("../middleware/requireAuth")
const { requireMembership } = require("../middleware/requireMembership")
const { getProjects } = require("../controllers/project.list.controller")

router.get(
  "/:orgId/projects",
  requireAuth,
  requireMembership(),
  getProjects
)

module.exports = router