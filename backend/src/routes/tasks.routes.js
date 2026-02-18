const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");

const {
  updateTaskStatusController
} = require("../controllers/tasks.status.controller");


router.patch(
  "/orgs/:orgId/tasks/:taskId/status",
  requireAuth,
  requireMembership(), 
  updateTaskStatusController
);

module.exports = router;