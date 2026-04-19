const express = require("express")
const router  = express.Router()

const requireAuth                = require("../middleware/requireAuth")
const { requireMembership }      = require("../middleware/requireMembership")
const { createCommentController } = require("../controllers/task.comment.create.controller")

router.post(
    "/:orgId/tasks/:taskId/comments",
    requireAuth,
    requireMembership("member"),
    createCommentController
)

module.exports = router