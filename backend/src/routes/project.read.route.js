const express = require("express")

const { getProjectDetailController } = require("../controllers/project.read.controller")
const requireAuth =  require("../middleware/requireAuth")
const {requireMembership} = require("../middleware/requireMembership")


const router = express.Router()

router.get("/:orgId/projects/:projectId", requireAuth, requireMembership("member"), getProjectDetailController)

module.exports = router