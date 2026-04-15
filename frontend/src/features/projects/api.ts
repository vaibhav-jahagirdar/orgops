import {  listProjectsQuerySchema ,
    listProjectsResponseSchema,
    type ListProjectsQuery,
    type ListProjectsResponse
} from "./schema";
import { api } from "@/lib/api";


export async function getProjectRequest(
    orgId: number  | string,
    query: Partial<ListProjectsQuery> = {}
) : Promise<ListProjectsResponse> {
    const parsed  = listProjectsQuerySchema.parse(query)
    const params = new URLSearchParams({
  page: String(parsed.page),
  limit: String(parsed.limit),
  sort: parsed.sort,
})

if (parsed.search) params.set("search", parsed.search)
    const res = await api.get(`/orgs/${orgId}/projects?${params.toString()}`)
    return listProjectsResponseSchema.parse(res.data)

}