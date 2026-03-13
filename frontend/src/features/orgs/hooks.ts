import { api } from "@/lib/api";
import { createOrgRequest } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


type CreateOrgInput = {
    name: string
}

type CreateOrgResponse = {
    id :number,
    name: string,
    role : string
}


export function useCreateOrg() {
    const queryClient = useQueryClient()

    return useMutation<CreateOrgResponse, Error, CreateOrgInput>({
    mutationFn: createOrgRequest,
    onSuccess: (newOrg) => {
        queryClient.invalidateQueries({
            queryKey: ["orgs"]
            })
        }
    })
}