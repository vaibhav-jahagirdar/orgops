import { api } from "@/lib/api";
import { CreateCommentInput, CreateCommentResponse, CreateCommentResponseSchema } from "./schema";

export async function createCommentRequest(data: CreateCommentInput, taskId: number, orgId: number): Promise<CreateCommentResponse> {
    try {
        const res = await api.post(`/orgs/${orgId}/tasks/${taskId}/comments`, data)
        return CreateCommentResponseSchema.parse(res.data)
    } catch (error) {
        console.error("Error creating comment:", error)
        throw error
    }
}