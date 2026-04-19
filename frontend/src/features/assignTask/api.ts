import { api } from "@/lib/api";
import { AssignTaskSchema, AssignTaskResponseSchema, AssignTaskInput, AssignTaskResponse } from "./schema";

export async function assignTaskRequest(data: AssignTaskInput & { orgId: number }): Promise<AssignTaskResponse> {
    const res  = await api.patch(`/orgs/${data.orgId}/tasks/${data.taskId}/assign`, { assignedTo: data.assignedTo })
    return AssignTaskResponseSchema.parse(res.data.task)

}