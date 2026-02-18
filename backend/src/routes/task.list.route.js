const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");

const { listTasksController } = require("../controllers/tasks.list.controller");

// GET /orgs/:orgId/projects/:projectId/tasks
router.get(
  "/orgs/:orgId/projects/:projectId/tasks",
  requireAuth,
  requireMembership(),
  listTasksController
);

module.exports = router;