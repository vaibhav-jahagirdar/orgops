import { z } from "zod"

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Task name must be atleast 3 characters")
    .max(50, "Task name cannot be more than 50 characters")
    .transform((v) => v.trim()),

  description: z
    .string()
    .max(200, "Task description cannot be more than 200 characters")
    .transform((v) => v.trim())
    .optional()
    .nullable(),

  status: z.enum(["todo", "in_progress", "done"]),

  priority: z.enum(["low", "medium", "high"]),

  assigned_to: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable(),

  due_date: z
    .string()
    .datetime()
    .optional()
    .nullable()
})

export type TaskInput = z.infer<typeof taskSchema>