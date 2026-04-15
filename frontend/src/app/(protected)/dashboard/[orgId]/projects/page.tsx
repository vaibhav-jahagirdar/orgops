"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDebounce } from "use-debounce"
import { AlertCircle, FolderKanban } from "lucide-react"

import { useProject } from "@/features/projects/hooks"
import type { ListProjectsQuery } from "@/features/projects/schema"
import ProjectToolBar from "@/components/projectsPage/ProjectToolBar"
import ProjectsList from "@/components/projectsPage/ProjectList"
import ProjectPagination from "@/components/projectsPage/ProjectPagination"
import { Card, CardContent } from "@/components/ui/card"

export default function Projects() {
  const router = useRouter()
  const params = useParams()
  const orgId = Number(params.orgId)

  const [query, setQuery] = useState<Partial<ListProjectsQuery>>({
    search: "",
    page: 1,
    limit: 15,
    sort: "created_at",
    order: "desc",
  })

  const [debouncedSearch] = useDebounce(query.search ?? "", 300)

  const { data, isLoading, isError } = useProject(orgId, {
    ...query,
    search: debouncedSearch,
  })

  const projects = data?.data ?? []
  const total = data?.meta?.total ?? 0
  const page = query.page ?? 1
  const limit = query.limit ?? 15
  const showPagination = total > limit

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-semibold sm:text-base">Failed to load projects</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-5 sm:space-y-5 sm:px-6 sm:py-7 lg:space-y-6 lg:px-8">
      
      <header className="rounded-2xl border bg-card/60 p-4 backdrop-blur sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border bg-background p-2.5">
            <FolderKanban className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl lg:text-3xl">
              Projects
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-[15px]">
              Track all organization projects, monitor progress, and quickly open or manage workstreams.
            </p>
          </div>
        </div>
      </header>

    
      <ProjectToolBar query={query} setQuery={setQuery} />

      
      <ProjectsList
        projects={projects}
        isLoading={isLoading}
        onOpen={(id) => router.push(`/dashboard/${orgId}/projects/${id}`)}
        onEdit={(id) => router.push(`/dashboard/${orgId}/projects/${id}/edit`)}
        onArchive={(id) => {
        
          console.log("archive project", id)
        }}
      />

      {!isLoading && projects.length === 0 && (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-10 text-center sm:py-14">
            <p className="text-sm font-medium sm:text-base">No projects found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing filters or create a new project from the toolbar.
            </p>
          </CardContent>
        </Card>
      )}

      
      {showPagination && (
        <ProjectPagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={(nextPage) =>
            setQuery((prev) => ({
              ...prev,
              page: nextPage,
            }))
          }
        />
      )}
    </div>
  )
}