import { UpdateUserRoleInput, UpdateUserRoleResponse, UpdateUserRoleResponseSchema, UpdateUserRoleSchema } from "./schema";

import { updateUserRoleRequest } from "./api";
import { useParams } from "next/navigation";
import { queryClient } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export function useUpdateUserRole() {
    const params  =  useParams()
    const orgId   =  Number(params.orgId)
    const queryClient = useQueryClient()
    return useMutation<UpdateUserRoleResponse, Error, UpdateUserRoleInput>({
        mutationFn: (data) => updateUserRoleRequest({ ...data, orgId }),
        onSuccess: (_) => {
            queryClient.invalidateQueries({
                queryKey: ["members", orgId],
            })
        }
    })
}