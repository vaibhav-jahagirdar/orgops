const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const { requireMembership } = require("../middleware/requireMembership");
const membersController = require("../controllers/memberships.controller");

router.post(
  "/:orgId/members",
  requireAuth,
  requireMembership("admin"),
  membersController.addMember
);

module.exports = router;