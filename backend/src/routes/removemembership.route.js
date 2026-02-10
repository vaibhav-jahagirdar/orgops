const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const membershipsController = require("../controllers/memberships.controller");


router.delete(
  "/orgs/:orgId/members/:userId",
  requireAuth,
  membershipsController.removeMembership
);

module.exports = router;
