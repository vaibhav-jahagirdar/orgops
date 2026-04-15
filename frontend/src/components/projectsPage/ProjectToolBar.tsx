"use client"

import * as React from "react"
import type { ListProjectsQuery } from "@/features/projects/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import {
  SelectValue,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { AddProjectDialog } from "./AddProjectDialog"

type Props = {
  query: Partial<ListProjectsQuery>
  setQuery: React.Dispatch<React.SetStateAction<Partial<ListProjectsQuery>>>
  canCreate?: boolean
}

export default function ProjectToolBar({
  query,
  setQuery,
  canCreate = true,
}: Props) {
  const sortValue = query.sort ?? "created_at"
  const orderValue = query.order ?? "desc"
  const searchValue = query.search ?? ""

  const hasFilters =
    Boolean(searchValue.trim()) || sortValue !== "created_at" || orderValue !== "desc"

  const onReset = () => {
    setQuery((prev) => ({
      ...prev,
      search: "",
      sort: "created_at",
      order: "desc",
      page: 1,
    }))
  }

  return (
    <div className="rounded-2xl border bg-card/70 p-3 sm:p-4 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
  
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_170px_150px_auto]">

          <div className="sm:col-span-2 xl:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 rounded-xl border-border/70 bg-background pl-9"
                placeholder="Search projects..."
                value={searchValue}
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
              Sort
            </label>
            <Select
              value={sortValue}
              onValueChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  sort: value as ListProjectsQuery["sort"],
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created At</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Order
            </label>
            <Select
              value={orderValue}
              onValueChange={(value) =>
                setQuery((prev) => ({
                  ...prev,
                  order: value as ListProjectsQuery["order"],
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>

       
          <div className="flex items-end">
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-xl"
              onClick={onReset}
              disabled={!hasFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        
        <div className="flex w-full items-end justify-start lg:w-auto lg:justify-end">
          {canCreate ? <AddProjectDialog /> : null}
        </div>
      </div>
    </div>
  )
}