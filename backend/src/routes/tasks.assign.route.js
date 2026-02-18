const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");

const { assignTaskController } = require("../controllers/tasks.assign.controller");

// PATCH /orgs/:orgId/tasks/:taskId/assign
router.patch(
  "/orgs/:orgId/tasks/:taskId/assign",
  requireAuth,
  requireMembership("admin"), 
  assignTaskController
);

module.exports = router;