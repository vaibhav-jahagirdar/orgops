const { getTaskById } = require("../services/task.read.service");

async function getTaskByIdController(req, res, next) {
  try {
    const { orgId, taskId } = req.params;

    const parsedOrgId = parseInt(orgId, 10);
    const parsedTaskId = parseInt(taskId, 10);


    if (!parsedOrgId || !parsedTaskId) {
      return res.status(400).json({
        message: "Invalid orgId or taskId",
      });
    }

    const task = await getTaskById({
      taskId: parsedTaskId,
      orgId: parsedOrgId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json(task);

  } catch (err) {
    next(err);
  }
}

module.exports = { getTaskByIdController };