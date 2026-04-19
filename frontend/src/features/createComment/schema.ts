import { z } from "zod"


export const CreateCommentSchema = z.object({
    comment: z.string().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
})


export const CommentSchema = z.object({
    id:         z.number().int().positive(),
    comment:    z.string(),
    task_id:    z.number().int().positive(),
    created_by: z.number().int().positive(),
    created_at: z.string(),
    author: z.object({
        name:  z.string().nullable(),
        email: z.string().email(),
    }),
})


export const GetCommentsResponseSchema = z.array(CommentSchema)

export const CreateCommentResponseSchema = CommentSchema

export type CreateCommentInput    = z.infer<typeof CreateCommentSchema>
export type Comment               = z.infer<typeof CommentSchema>
export type GetCommentsResponse   = z.infer<typeof GetCommentsResponseSchema>
export type CreateCommentResponse = z.infer<typeof CreateCommentResponseSchema>