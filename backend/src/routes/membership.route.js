const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const membersController = require("../controllers/memberships.controller");

router.get(
  "/:orgId/members",
  requireAuth,
  membersController.listMembers
);

module.exports = router;