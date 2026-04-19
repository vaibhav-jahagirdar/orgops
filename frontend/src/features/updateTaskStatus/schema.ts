import { z } from "zod"

export const TaskStatus = z.enum(["todo", "in_progress",  "done"])

export const UpdateTaskStatusSchema = z.object({
    taskId: z.number().int().positive(),
    orgId:  z.number().int().positive(),
    status: TaskStatus,
})

export const UpdateTaskStatusResponseSchema = z.object({
    id:     z.number().int().positive(),
    status: TaskStatus,
    title:  z.string(),
})

export type UpdateTaskStatusInput    = z.infer<typeof UpdateTaskStatusSchema>
export type UpdateTaskStatusResponse = z.infer<typeof UpdateTaskStatusResponseSchema>