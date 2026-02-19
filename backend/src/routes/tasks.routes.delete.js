const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");
const { deleteTaskController } = require("../controllers/tasks.delete.controller");

// DELETE /orgs/:orgId/projects/:projectId/tasks/:taskId
router.delete(
  "/orgs/:orgId/projects/:projectId/tasks/:taskId",
  requireAuth,
  requireMembership("admin"),
  deleteTaskController
);

module.exports = router;