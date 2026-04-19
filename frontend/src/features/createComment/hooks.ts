import { useParams } from "next/navigation"
import { createCommentRequest } from "./api"
import { CreateCommentInput, CreateCommentResponse } from "./schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type CreateCommentVariables = {
    taskId:  number
    comment: string
}

export function useCreateComment() {
    const { orgId } = useParams()
    const queryClient = useQueryClient()

    return useMutation<CreateCommentResponse, Error, CreateCommentVariables>({
        mutationFn: ({ taskId, comment }) =>
            createCommentRequest({ comment }, taskId, Number(orgId)),
        onSuccess: (_, { taskId }) => {
            queryClient.invalidateQueries({ queryKey: ["comments", orgId, taskId] })
        },
    })
}