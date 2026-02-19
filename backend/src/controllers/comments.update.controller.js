const { updateCommentSchema } = require("../schemas/comments.update.schema");
const { editComment } = require("../services/comments.update.service");

async function updateCommentController(req, res, next) {
  try {
    const { orgId, taskId, commentId } = req.params;

    const userId = req.user.id;

    const parsed = updateCommentSchema.parse(req.body);

    const result = await editComment(
      Number(orgId),
      userId,
      parsed.comment,
      Number(commentId)
    );

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { updateCommentController };