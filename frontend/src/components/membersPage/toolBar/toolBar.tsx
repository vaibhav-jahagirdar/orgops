"use client"

import type { ListMembersQuery } from "@/features/members/schema"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AddMembers } from "../addMembers/addMembers"

type Props = {
  query: ListMembersQuery
  setQuery: React.Dispatch<React.SetStateAction<ListMembersQuery>>
}

export default function ToolBar({ query, setQuery }: Props) {
  const hasActiveFilters =
    Boolean(query.search?.trim()) ||
    Boolean(query.role) ||
    (query.sort ?? "role") !== "role"

  const clearFilters = () => {
    setQuery((prev) => ({
      ...prev,
      search: "",
      role: undefined,
      sort: "role",
      page: 1,
    }))
  }

  return (
    <div className="rounded-2xl border bg-background/80 p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(320px,1fr)_180px_220px_auto]">
        
          <div className="sm:col-span-2 xl:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 rounded-xl border-border/70 bg-background pl-9"
                placeholder="Search name or email..."
                value={query.search}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
              />
            </div>
          </div>

       
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Role
            </label>
            <Select
              value={query.role ?? "all"}
              onValueChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  role:
                    value === "all"
                      ? undefined
                      : (value as NonNullable<ListMembersQuery["role"]>),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Sort
            </label>
            <Select
              value={query.sort ?? "role"}
              onValueChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  sort: value as ListMembersQuery["sort"],
                  page: 1, 
                }))
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Role priority</SelectItem>
                <SelectItem value="name_asc">Name (A → Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z → A)</SelectItem>
                <SelectItem value="joined_desc">Joined (Newest)</SelectItem>
                <SelectItem value="joined_asc">Joined (Oldest)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

 
        <div className="flex w-full items-end justify-start xl:w-auto xl:justify-end">
          <AddMembers />
        </div>
      </div>

  
      {hasActiveFilters && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters applied
        </div>
      )}
    </div>
  )
}