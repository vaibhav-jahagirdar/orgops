import { api } from "@/lib/api";
import { UpdateTaskStatusSchema, UpdateTaskStatusInput, UpdateTaskStatusResponse, UpdateTaskStatusResponseSchema } from "./schema";
import { useParams } from "next/navigation";


export async function updateTaskStatusRequest(data: UpdateTaskStatusInput): Promise<UpdateTaskStatusResponse> {

 
    const res  = await api.patch(`/orgs/${data.orgId}/tasks/${data.taskId}/status`, { status: data.status })
    return UpdateTaskStatusResponseSchema.parse(res.data)
}