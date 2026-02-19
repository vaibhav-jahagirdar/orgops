const { z } = require("zod");

const updateTaskSchema = z.object({
  title: z.string().trim().min(3).optional(),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  due_days: z.number().int().positive().optional()
}).refine(
  (data) =>
    data.title !== undefined ||
    data.description !== undefined ||
    data.priority !== undefined ||
    data.due_days !== undefined,
  {
    message: "At least one field must be provided for update"
  }
);

module.exports = { updateTaskSchema };