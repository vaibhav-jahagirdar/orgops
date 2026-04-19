import { AssignTaskInput, AssignTaskResponse, AssignTaskResponseSchema, AssignTaskSchema } from "./schema";
import { assignTaskRequest } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";


export function useAssignTask() {
    const queryClient = useQueryClient()
    const { orgId } = useParams()

    return useMutation<AssignTaskResponse, Error, Omit<AssignTaskInput, "orgId">>({
        mutationFn: (data) => assignTaskRequest({ ...data, orgId: Number(orgId) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", orgId] })
        }
    })
}