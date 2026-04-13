const express = require("express")
const { listOrgMembersController } = require("../controllers/members.read.controller")
const requireAuth = require("../middleware/requireAuth")
const {requireMembership}= require("../middleware/requireMembership")

const router = express.Router()


router.get(
  "/:orgId/members",
  requireAuth,
  requireMembership("member"), 
  listOrgMembersController
)

module.exports = router