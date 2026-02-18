const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");
const { createTaskController } = require("../controllers/tasks.create.controller");

router.post(
  "/orgs/:orgId/projects/:projectId/tasks",
  requireAuth,
  requireMembership("member"), 
  createTaskController
);

module.exports = router;