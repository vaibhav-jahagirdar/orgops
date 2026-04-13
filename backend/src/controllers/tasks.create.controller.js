const { createTask } = require("../services/tasks.service")
const { createTaskSchema } = require("../schemas/createTask.schema")
const asyncHandler = require("../utils/asyncHandler")

const createTaskController = asyncHandler(async (req, res) => {

  const parsed = createTaskSchema.parse(req.body)

  const { orgId, projectId } = req.params
  const userId = req.user.id

  const result = await createTask({
    userId,
    orgId: parseInt(orgId, 10),
    projectId: parseInt(projectId, 10),
    title: parsed.title,
    description: parsed.description ?? null,
    priority: parsed.priority,
    assignedTo: parsed.assignedTo ?? null,
    dueDate: parsed.dueDate ?? null
  })

  return res.status(201).json(result)

})

module.exports = { createTaskController }