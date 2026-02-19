const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");
const { updateTaskController } = require("../controllers/tasks.update.controller");

// PATCH /orgs/:orgId/projects/:projectId/tasks/:taskId
router.patch(
  "/orgs/:orgId/projects/:projectId/tasks/:taskId",
  requireAuth,
  requireMembership(), // any org member
  updateTaskController
);

module.exports = router;