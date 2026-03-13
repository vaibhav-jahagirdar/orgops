import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProject } from "./api"
import { useParams } from "next/navigation"

type createProjectInput = {
    name: string
}

type createProjectResponse = {
    id: number,
    org_id: number,
    name: string,
}

export function useCreateProject() {
    const queryClient = useQueryClient()
    const { orgId } = useParams()

    return useMutation<createProjectResponse, Error, createProjectInput>({
        mutationFn: (data) => createProject(data, orgId as string),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
        }
    })
}