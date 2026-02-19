const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");

const { listCommentsController } = require("../controllers/comments.list.controller");

router.get(
  "/orgs/:orgId/projects/:projectId/tasks/:taskId/comments",
  requireAuth,
  requireMembership(),
  listCommentsController
);

module.exports = router;