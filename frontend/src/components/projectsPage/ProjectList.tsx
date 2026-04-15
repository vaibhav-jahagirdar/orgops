"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  MoreHorizontal,
  FolderKanban,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type ProjectRow = {
  id: number
  name: string
  created_at: string
  created_by: number | string
  created_by_name: string
  created_by_email: string

  task_count?: number | undefined
  todo_count?: number | undefined
  in_progress_count?: number | undefined
  done_count?: number | undefined
  overdue_count?: number | undefined
}

type Props = {
  projects: ProjectRow[]
  isLoading?: boolean
  onOpen?: (projectId: number) => void
  onEdit?: (projectId: number) => void
  onArchive?: (projectId: number) => void
}

function getInitials(value: number | string) {
  const s = String(value)
  return s.slice(0, 2).toUpperCase()
}

function calcProgress(done = 0, total = 0) {
  if (!total) return 0
  return Math.round((done / total) * 100)
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="rounded-2xl border-border/70">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-5 w-52" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function ProjectsList({
  projects,
  isLoading = false,
  onOpen,
  onEdit,
  onArchive,
}: Props) {
  if (isLoading) return <ProjectListSkeleton />

  if (!projects.length) {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-14 text-center">
          <FolderKanban className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No projects found</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Try changing search/sort filters or create a new project.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((p) => {
        const total = p.task_count ?? 0
        const todo = p.todo_count ?? 0
        const inProgress = p.in_progress_count ?? 0
        const done = p.done_count ?? 0
        const overdue = p.overdue_count ?? 0
        const progress = calcProgress(done, total)

        return (
          <Card
            key={p.id}
            className={cn(
              "group rounded-2xl border-border/70 bg-card/80 transition-all",
              "hover:border-primary/30 hover:shadow-md"
            )}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                
                <button
                  type="button"
                  onClick={() => onOpen?.(p.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold sm:text-lg">
                      {p.name}
                    </h3>

                    {overdue > 0 ? (
                      <Badge
                        variant="destructive"
                        className="rounded-full px-2.5 py-0.5 text-[11px]"
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {overdue} overdue
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5 py-0.5 text-[11px]"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        On track
                      </Badge>
                    )}
                  </div>

                  
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Created {format(new Date(p.created_at), "MMM d, yyyy")}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(p.created_by)}
                        </AvatarFallback>
                      </Avatar>
                      By {String(p.created_by_name)}
                    </span>
                  </div>

                
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 sm:text-sm">
                    <Stat label="Total" value={total} />
                    <Stat label="Todo" value={todo} />
                    <Stat label="In Progress" value={inProgress} />
                    <Stat label="Done" value={done} />
                  </div>

                  
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </button>

                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg opacity-80 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onOpen?.(p.id)}>
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(p.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onArchive?.(p.id)}
                    >
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 px-2.5 py-2">
      <p className="text-[11px] text-muted-foreground sm:text-xs">{label}</p>
      <p className="text-sm font-semibold sm:text-[15px]">{value}</p>
    </div>
  )
}