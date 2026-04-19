"use client"

import { useMemo, useState } from "react"
import { useAuth } from "../../../contexts/auth-context"
import { useUpdateTaskStatus } from "@/features/updateTaskStatus/hooks"
import { useMembers } from "@/features/members/hooks"
import { useParams } from "next/navigation"
import { useAssignTask } from "@/features/assignTask/hooks"
import { TaskComments } from "./taskComments"

type TaskStatus   = "todo" | "in_progress" | "done"
type TaskPriority = "low" | "medium" | "high" | string

type Task = {
  id: number
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  createdAt: string
  assignee: { id: number; name: string; email: string } | null
}

type Member = {
  
  id: number
  name?: string | null
  email: string
}

type Props = {
  tasks: Task[]
  currentUserRole?: "owner" | "admin" | "member"
  members: Member[]
}

const statusMeta: Record<TaskStatus, { label: string; dot: string }> = {
  todo:        { label: "TODO",        dot: "bg-slate-400"  },
  in_progress: { label: "IN PROGRESS", dot: "bg-blue-500"   },
 
  done:        { label: "DONE",        dot: "bg-emerald-500"},
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo",        label: "Todo"        },
  { value: "in_progress", label: "In Progress" },
  { value: "done",        label: "Done"        },
]

function canManageTask(role?: Props["currentUserRole"]) {
  return role === "owner" || role === "admin"
}

function canEditTask(task: Task, userId?: number | null, role?: Props["currentUserRole"]) {
  if (!userId) return false
  if (canManageTask(role)) return true
  return task.assignee?.id === userId
}

export default function ProjectInfo({ tasks, currentUserRole = "member" }: Props) {
  const [selectedTask,    setSelectedTask]    = useState<Task | null>(null)
  const [assigningTaskId, setAssigningTaskId] = useState<number | null>(null)

  const { userId }                                   = useAuth()
  const { mutateAsync: updateTaskStatus, isPending } = useUpdateTaskStatus()
  const { mutateAsync: assignTask }                  = useAssignTask()

  const { orgId } = useParams()
  const { data }  = useMembers(Number(orgId))
  const members   = data?.data ?? []

  const grouped = useMemo(() => {
    const base: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], done: [] }
    for (const t of tasks) base[t.status]?.push(t)
    return base
  }, [tasks])

  const columns: TaskStatus[] = ["todo", "in_progress", "done"]

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px] p-4">


      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {columns.map((col) => (
          <div key={col} className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <span className={`h-2 w-2 rounded-full ${statusMeta[col].dot}`} />
              <p className="text-xs font-semibold tracking-wide text-slate-600">
                {statusMeta[col].label}
              </p>
              <span className="text-xs text-slate-400">{grouped[col].length}</span>
            </div>

            <div className="space-y-3 p-3">
              {grouped[col].map((task) => (
                <article
                  key={task.id}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 hover:shadow-sm"
                  onClick={() => setSelectedTask(task)}
                >
                  <p className="font-medium text-slate-900">{task.title}</p>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{task.description}</p>
                  )}
                  <div className="mt-3 text-xs text-slate-500">
                    {task.assignee ? (
                      <span>Assigned: {task.assignee.email}</span>
                    ) : canManageTask(currentUserRole) ? (
                      <div className="relative">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setAssigningTaskId(assigningTaskId === task.id ? null : task.id)
                          }}
                        >
                          Assign to…
                        </button>

                        {assigningTaskId === task.id && (
                          <div
                            className="absolute left-0 top-6 z-10 w-52 rounded-lg border border-slate-200 bg-white shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Assign to
                            </p>
                            <ul className="max-h-48 overflow-y-auto py-1">
                              {members.length === 0 && (
                                <li className="px-3 py-2 text-xs text-slate-400">No members found</li>
                              )}
                              {members.map((m) => (
                                <li key={m.user_id}>
                                  <button
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-50"
                                    onClick={() => {
                                      assignTask({ taskId: task.id, assignedTo: m.user_id })
                                      setAssigningTaskId(null)
                                    }}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                      {(m.name ?? m.email ?? "?").charAt(0).toUpperCase()}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate font-medium text-slate-800">{m.name ?? "Unnamed"}</p>
                                      <p className="truncate text-xs text-slate-400">{m.email}</p>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span>Unassigned</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

    
      <aside className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Members</h3>
        </div>
        <ul className="divide-y">
          {members.map((m) => (
            <li key={m.user_id} className="px-4 py-3">
              <p className="text-sm font-medium text-slate-900">{m.name ?? "Unnamed member"}</p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </li>
          ))}
          {members.length === 0 && (
            <li className="px-4 py-6 text-sm text-slate-500">No members yet.</li>
          )}
        </ul>
      </aside>

      
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="overflow-y-auto p-5">

              <div className="mb-3 flex items-start justify-between">
                <h2 className="text-lg font-semibold">{selectedTask.title}</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-sm text-slate-500 hover:text-slate-800"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <p><span className="font-medium">Description:</span> {selectedTask.description || "—"}</p>
                <p><span className="font-medium">Created on:</span> {new Date(selectedTask.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Due date:</span> {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : "—"}</p>
                <p><span className="font-medium">Priority:</span> {selectedTask.priority}</p>
                <p><span className="font-medium">Status:</span> {selectedTask.status}</p>
                <p><span className="font-medium">Assigned to:</span> {selectedTask.assignee?.email ?? "Unassigned"}</p>
              </div>

              {canEditTask(selectedTask, userId, currentUserRole) && (
                <div className="mt-4 flex gap-3 border-t pt-4">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-medium text-slate-500">Status</p>
                    <select
                      disabled={isPending}
                      value={selectedTask.status}
                      onChange={(e) =>
                        updateTaskStatus({
                          taskId: selectedTask.id,
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="w-full rounded-md border px-3 py-1.5 text-sm"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {canManageTask(currentUserRole) && (
                    <div className="flex-1">
                      <p className="mb-1 text-xs font-medium text-slate-500">Assignee</p>
                      <select
                        value={selectedTask.assignee?.id ?? ""}
                        onChange={(e) =>
                          assignTask({
                            taskId: selectedTask.id,
                            assignedTo: e.target.value === "" ? null : Number(e.target.value),
                          })
                        }
                        className="w-full rounded-md border px-3 py-1.5 text-sm"
                      >
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                          <option key={m.user_id} value={m.user_id}>
                            {m.name ?? m.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <TaskComments taskId={selectedTask.id} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}