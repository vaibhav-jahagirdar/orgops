const { createCommentSchema } = require("../schemas/task.comment.create.schema");
const { createComment } = require("../services/task.comment.create.service");

async function createCommentController(req, res, next) {
  try {
    const { orgId, projectId, taskId } = req.params;
    const userId = req.user.id;
    const role = req.membership.role;

    const parsed = createCommentSchema.parse(req.body);

    const result = await createComment(
      Number(orgId),
      Number(taskId),
      userId,
      role,
      parsed.comment
    );

    return res.status(201).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { createCommentController };