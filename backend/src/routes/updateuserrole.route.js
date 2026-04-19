const express = require("express")
const router = express.Router();

const { updateUserRole } = require("../controllers/updateuserrole.controller")
const requireAuth = require("../middleware/requireAuth")
const {requireMembership}= require("../middleware/requireMembership")

router.patch("/:orgId/members/:targetId/role",
    requireAuth,
    requireMembership("admin"),
    updateUserRole
)

module.exports = router