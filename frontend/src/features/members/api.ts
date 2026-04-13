import { api } from "@/lib/api"
import {
  listMembersQuerySchema,
  listMembersResponseSchema,
  type ListMembersQuery,
  type ListMembersResponse,
} from "./schema"

export async function getMembersRequest(
  orgId: number | string,
  query: Partial<ListMembersQuery> = {}
): Promise<ListMembersResponse> {
  const parsed = listMembersQuerySchema.parse(query)
const paramsObj: Record<string, string> = {
  page: String(parsed.page),
  limit: String(parsed.limit),
  sort: parsed.sort,
  search: parsed.search,
}

if (parsed.role) {
  paramsObj.role = parsed.role
}

const params = new URLSearchParams(paramsObj)

  if (parsed.search) params.set("search", parsed.search)

  const res = await api.get(`/orgs/${orgId}/members?${params.toString()}`)
  console.log("CALLING API...")
  console.log("RAW RESPONSE:", res.data)
  return listMembersResponseSchema.parse(res.data)
}