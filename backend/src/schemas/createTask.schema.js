const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress","blocked", "done",]).default("todo"),
  assignedTo: z.number().int().positive().optional(),
  dueDays: z.number().int().positive().max(365).optional()
});

module.exports = { createTaskSchema };