
"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { z } from "zod"
import { api } from "@/lib/api"


const CommentSchema = z.object({
    id:           z.number().int().positive(),
    comment:      z.string(),
    created_by:   z.number().int().positive(),
    created_at:   z.string(),
    author_name:  z.string().nullable(),
    author_email: z.string().email(),
})

const GetCommentsResponseSchema = z.object({
    comments: z.array(CommentSchema),
    pagination: z.object({
        total:      z.number(),
        page:       z.number(),
        limit:      z.number(),
        totalPages: z.number(),
    }),
})

export type Comment              = z.infer<typeof CommentSchema>
export type GetCommentsResponse  = z.infer<typeof GetCommentsResponseSchema>


async function getCommentsRequest(
    orgId:  number,
    taskId: number,
): Promise<GetCommentsResponse> {
    const res = await api.get(`/orgs/${orgId}/tasks/${taskId}/comments`)
    console.log("API response for comments:", res.data)
    return GetCommentsResponseSchema.parse(res.data)
}


export function useGetComments(taskId: number) {
    const { orgId } = useParams()

    return useQuery<GetCommentsResponse, Error>({
        queryKey:           ["comments", orgId, taskId],
        queryFn:            () => getCommentsRequest(Number(orgId), taskId),
        enabled:            !!orgId && !!taskId,
        refetchOnWindowFocus: false,
    })
}