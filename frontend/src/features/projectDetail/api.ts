import { api } from "@/lib/api"
import {
  ProjectDetailParams,
  ProjectDetailResponse,
  projectDetailResponseSchema,
} from "./schema"

export async function fetchProjectDetail(
  params: ProjectDetailParams
): Promise<ProjectDetailResponse> {
  const { orgId, projectId } = params

  if (!orgId || !projectId) {
    throw new Error("Invalid params")
  }

  try {
    const res = await api.get<{ data: unknown }>(
      `/orgs/${orgId}/projects/${projectId}`
    )
const { data: payload, currentUserRole } = res.data as any
const parsed = projectDetailResponseSchema.parse({ ...payload, currentUserRole })

    return parsed

  } catch (err: any) {
    if (err.response) {
      throw new Error(err.response.data?.message || "API Error")
    }

    throw new Error("Network error")
  }
}