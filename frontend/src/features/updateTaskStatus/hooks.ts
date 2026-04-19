import { UpdateTaskStatusInput, UpdateTaskStatusResponse, TaskStatus } from "./schema";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatusRequest } from "./api";

type UpdateTaskStatusVariables = Omit<UpdateTaskStatusInput, "orgId">

export function useUpdateTaskStatus() {
    const { orgId } = useParams() 
    const queryClient = useQueryClient()

    return useMutation<UpdateTaskStatusResponse, Error, UpdateTaskStatusVariables>({
        mutationFn: ({ taskId, status }) =>
            updateTaskStatusRequest({ taskId, orgId: Number(orgId), status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", orgId] })
        },
    })
}