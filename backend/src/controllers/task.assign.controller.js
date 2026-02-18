const { assignTask } = require("../services/tasks.assign.service");
const { assignTaskSchema } = require("../schemas/task.assign.schema");

async function assignTaskController(req, res) {
  try {
    const { orgId, taskId } = req.params;
    const actorId = req.user.id;

    const parsed = assignTaskSchema.parse(req.body);

    const result = await assignTask(
      actorId,
      parsed.assignedTo,
      Number(orgId),
      Number(taskId)
    );

    return res.status(200).json({
      message: "Task updated successfully",
      task: result
    });

  } catch (err) {
    if (err.code) {
      return res.status(400).json({ error: err.code });
    }

    if (err.name === "ZodError") {
      return res.status(400).json({ error: err.errors });
    }

    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}

module.exports = { assignTaskController };