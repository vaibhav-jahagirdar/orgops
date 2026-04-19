const { z } = require("zod")

const createTaskSchema = z.object({
  title: z.string().trim().min(3).max(200),

  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable(),

  priority: z.enum(["low", "medium", "high"]),

  assignedTo: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),   

  dueDate: z.coerce.date().optional().nullable()   
})

module.exports = { createTaskSchema }