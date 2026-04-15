"use client"

import { CreateTaskDialog } from "../tasks/create-task-dialog"

export type ProjectProps = {
  project: {
    id: number
    name: string
    createdAt: string
    archivedAt: string | null
    isArchived: boolean
  }
  creator: {
    id: number
    name: string
    email: string
  }
  health: {
    status: "not_started" | "on_track" | "nearly_done" | "at_risk" | "completed" | string
  }
}

function statusStyles(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20"
    case "at_risk":
      return "bg-rose-500/10 text-rose-700 ring-rose-500/20"
    case "nearly_done":
      return "bg-amber-500/10 text-amber-700 ring-amber-500/20"
    case "on_track":
      return "bg-blue-500/10 text-blue-700 ring-blue-500/20"
    default:
      return "bg-zinc-500/10 text-zinc-700 ring-zinc-500/20"
  }
}

function prettyStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase())
}

function getInitials(name: string) {
  if (!name?.trim()) return "PR"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function ProjectHeader({ project, creator, health }: ProjectProps) {
  const createdOn = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const initials = getInitials(project.name)

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 shadow-[0_1px_8px_0_rgba(0,0,0,0.05)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">

          <div className="flex min-w-0 items-center gap-2.5">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 text-xs font-semibold text-white shadow-sm ring-1 ring-black/10">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-[15px] font-semibold tracking-tight text-zinc-900">
                  {project.name}
                </h1>

                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${statusStyles(health.status)}`}>
                  {prettyStatus(health.status)}
                </span>

                {project.isArchived && (
                  <span className="inline-flex items-center rounded-full bg-zinc-900/5 px-2 py-0.5 text-[11px] font-medium text-zinc-600 ring-1 ring-zinc-300/70">
                    Archived
                  </span>
                )}
              </div>

              <p className="truncate text-[12px] leading-tight text-zinc-400">
                <span className="font-medium text-zinc-500">{creator.name}</span>
                <span className="mx-1 text-zinc-300">·</span>
                {createdOn}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <CreateTaskDialog />
          </div>

        </div>
      </div>
    </header>
  )
}