const { deleteTask } = require("../services/tasks.delete.service");
const { deleteTaskParamsSchema } = require("../schemas/tasks.delete.schema");

async function deleteTaskController(req, res, next) {
  try {
    const parsed = deleteTaskParamsSchema.parse(req.params);

    const userId = req.user.id;

    const result = await deleteTask(
      Number(parsed.orgId),
      Number(parsed.projectId),
      Number(parsed.taskId),
      userId
    );

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { deleteTaskController };