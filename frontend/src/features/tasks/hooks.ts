import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { createTask } from "./api"
import { TaskInput } from "./schema"

type CreateTaskResponse = {
  id: number
  title: string
  description: string | null
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  assigned_to: number | null
  due_date: string | null
  created_at: string
  updated_at: string
}


function mapTaskInputToApi(data: TaskInput) {
  return {
    title: data.title,
    description: data.description ?? null,
    priority: data.priority,
    assigned_to: data.assignedTo ?? null,
    due_date: data.dueDate
      ? data.dueDate.toISOString()
      : null,
  }
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const params = useParams()

 if (
  typeof params.orgId !== "string" ||
  typeof params.projectId !== "string"
) {
  throw new Error("Invalid route params")
}

const orgId = params.orgId
const projectId = params.projectId

  return useMutation<CreateTaskResponse, Error, TaskInput>({
    mutationFn: (data) =>
      createTask(mapTaskInputToApi(data), orgId, projectId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", orgId, projectId],
      })
    },
  })
}