const { createTask } = require("../services/tasks.create.service");
const { createTaskSchema } = require("../schemas/createTask.schema");

async function createTaskController(req, res, next) {
  try {
    const parsed = createTaskSchema.parse(req.body);

    const { orgId, projectId } = req.params;
    const userId = req.user.id;

    const result = await createTask(
      userId,
      parseInt(projectId),
      parseInt(orgId),
      parsed.assignedTo || null,
      parsed.title,
      parsed.status,
      parsed.description || null,
      parsed.priority,
      parsed.dueDays || null
    );

    return res.status(201).json(result);

  } catch (err) {
    next(err);
  }
}

module.exports = { createTaskController };