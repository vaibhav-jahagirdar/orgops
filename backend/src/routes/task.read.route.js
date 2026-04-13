const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");

const { getTaskByIdController } = require("../controllers/task.read.controller");

router.get(
  "/orgs/:orgId/tasks/:taskId",
  requireAuth,
  requireMembership(),
  getTaskByIdController
);

module.exports = router;