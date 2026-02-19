const {
  listCommentsParamsSchema,
  listCommentsQuerySchema
} = require("../schemas/comments.list.schema");

const { listComments } = require("../services/comments.list.service");

async function listCommentsController(req, res, next) {
  try {
    const parsedParams = listCommentsParamsSchema.parse(req.params);
    const parsedQuery = listCommentsQuerySchema.parse(req.query);

    const userId = req.user.id;
    const role = req.membership.role;

    const result = await listComments(
      parsedParams.orgId,
      userId,
      parsedParams.taskId,
      role,
      parsedQuery.page,
      parsedQuery.limit
    );

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { listCommentsController };