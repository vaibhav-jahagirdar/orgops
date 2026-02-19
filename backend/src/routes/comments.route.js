
const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const requireMembership = require("../middleware/requireMembership");
const { updateCommentController } = require("../controllers/comments.update.controller");


router.patch(
  "/orgs/:orgId/tasks/:taskId/comments/:commentId",
  requireAuth,
  requireMembership(),
  updateCommentController
);

module.exports = router;