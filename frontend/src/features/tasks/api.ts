import { api } from "@/lib/api"

type CreateTaskPayload = {
  title: string
  description: string | null
  priority: "low" | "medium" | "high"
  assigned_to: number | null
  due_date: string | null
}

export async function createTask(
  data: CreateTaskPayload,
  orgId: string,
  projectId: string
) {
try {
  const res = await api.post(
    `/orgs/${orgId}/projects/${projectId}/tasks`,
    data
  )
  console.log({ orgId, projectId, data })
  return res.data
  
} catch (err:  any) {
  console.log(err.response?.data)   
  console.log(err.response?.status)
  console.log(err.message)
  
}
}