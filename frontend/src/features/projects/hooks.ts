import { useQuery } from "@tanstack/react-query";
import { ListProjectsQuery, ListProjectsResponse } from "./schema";
import { getProjectRequest } from "./api";



export function useProject(
    orgId: number | string,
    query: Partial<ListProjectsQuery> = {}
) {
    return  useQuery<ListProjectsResponse, Error>({
        queryKey: [
            "projects",
            orgId,
        query?.page ?? 1,
        query?.limit ?? 15,
        query?.search ?? "",
        query?.sort ?? "name",],
        queryFn: () => getProjectRequest(orgId, query),

    })

}
