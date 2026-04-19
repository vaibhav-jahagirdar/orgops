import { z } from "zod"


export const AssignTaskSchema = z.object({
    
    taskId:     z.number().int().positive(),
    assignedTo: z.number().int().positive().nullable(),
})


export const AssignTaskResponseSchema = z.object({
    id:         z.number().int().positive(),
    org_id:     z.number().int().positive(),
    project_id: z.number().int().positive(),
    title:      z.string(),
})

export type AssignTaskInput    = z.infer<typeof AssignTaskSchema>
export type AssignTaskResponse = z.infer<typeof AssignTaskResponseSchema>