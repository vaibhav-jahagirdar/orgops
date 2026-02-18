const { updateStatus } = require("../services/tasks/tasks.status.service");
const { updateTaskStatusSchema } = require("../schemas/task.updateStatus.schema");

async function updateTaskStatusController(req, res, next) {
  try {
    const parsed = updateTaskStatusSchema.parse(req.body);

    const { orgId, taskId } = req.params;

    const userId = req.user.id;    
    const role = req.membership.role;  

    const result = await updateStatus(
      userId,
      role,
      taskId,
      parsed.status,
      orgId
    );

    return res.status(200).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  updateTaskStatusController
};