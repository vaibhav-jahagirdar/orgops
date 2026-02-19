const { deleteCommentSchema } = require("../schemas/comments.delete.schema");
const { deleteComment } = require("../services/comments.delete.service");

async function deleteCommentController(req, res, next) {
  try {
    const parsed = deleteCommentSchema.parse(req.params);

    const userId = req.user.id;
    const role = req.membership.role;

    const result = await deleteComment(
      parsed.commentId,
      parsed.taskId,
      parsed.orgId,
      userId,
      role
    );

    return res.status(200).json({
      message: "Comment deleted",
      commentId: result.id
    });

  } catch (err) {
    next(err);
  }
}

module.exports = { deleteCommentController };