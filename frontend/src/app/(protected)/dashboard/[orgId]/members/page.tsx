"use client"

import { useMembers } from "@/features/members/hooks"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useDebounce } from "use-debounce"
import type { ListMembersQuery } from "@/features/members/schema"
import SearchBar from "@/components/membersPage/toolBar/toolBar"
import MembersList from "@/components/membersPage/membersList/members"
import Pagination from "@/components/membersPage/pagination/pagination"
import MemberCounts from "@/components/membersPage/memberCounts/memberCount"
import { AlertCircle, ShieldCheck } from "lucide-react"

export default function Members() {
  const [query, setQuery] = useState<ListMembersQuery>({
    search: "",
    role: undefined,
    sort: "role",
    page: 1,
    limit: 15,
  })

  const params = useParams()
  const orgId = Number(params.orgId)

  const [debouncedSearch] = useDebounce(query.search, 300)

  const { data, isLoading, isError } = useMembers(orgId, {
    ...query,
    search: debouncedSearch,
  })

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">Failed to load members</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading && !data) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-5">
     
        <header className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Access Control
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Members</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage people and permissions in your organization.
              </p>
            </div>
          </div>
        </header>

      
        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <MemberCounts
            total={data?.counts.total ?? 0}
            owners={data?.counts.owners ?? 0}
            admins={data?.counts.admins ?? 0}
            members={data?.counts.members ?? 0}
          />
        </section>

   
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 p-4">
            <SearchBar query={query} setQuery={setQuery} />
          </div>

          <div className="p-4">
            <MembersList
              members={data?.data ?? []}
              isLoading={isLoading}
              currentUserRole={data?.currentUserRole ?? "member"}
            />
          </div>

          <div className="border-t bg-muted/20 p-4">
            <Pagination
              page={data?.meta.page ?? query.page ?? 1}
              totalPages={data?.meta.totalPages ?? 1}
              hasNextPage={data?.meta.hasNextPage ?? false}
              hasPrevPage={data?.meta.hasPrevPage ?? false}
              pageSize={data?.meta.limit ?? query.limit ?? 15}
              onPageChange={(page) =>
                setQuery((prev) => ({
                  ...prev,
                  page,
                }))
              }
              onPageSizeChange={(size) =>
                setQuery((prev) => ({
                  ...prev,
                  limit: size,
                  page: 1,
                }))
              }
            />
          </div>
        </section>
      </div>
    </div>
  )
}