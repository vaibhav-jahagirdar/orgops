const { z } = require("zod");

const deleteTaskParamsSchema = z.object({
  orgId: z.string().regex(/^\d+$/),
  projectId: z.string().regex(/^\d+$/),
  taskId: z.string().regex(/^\d+$/)
});

module.exports = { deleteTaskParamsSchema };