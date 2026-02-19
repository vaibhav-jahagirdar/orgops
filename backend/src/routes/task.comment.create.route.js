const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");

const { createCommentController } = require("../controllers/task.comment.create.controller");

// POST /orgs/:orgId/projects/:projectId/tasks/:taskId/comments
router.post(
  "/orgs/:orgId/projects/:projectId/tasks/:taskId/comments",
  requireAuth,
  requireMembership(), 
  createCommentController
);

module.exports = router;