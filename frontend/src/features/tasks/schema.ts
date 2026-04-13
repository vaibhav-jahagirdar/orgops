import { z } from "zod"

export const taskSchema = z.object({
  title: z.string().trim().min(3).max(50),

  description: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),

  status: z.enum(["todo", "in_progress", "done"]).default("todo"),

  priority: z.enum(["low", "medium", "high"]),

  assignedTo: z.number().int().positive().optional(),

  dueDate: z.date().optional(),
})

export const createTaskSchema = taskSchema.omit({
  status: true,
})

export type TaskInput = z.infer<typeof createTaskSchema>