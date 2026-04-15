"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  page: number
  limit: number
  total: number
  onPageChange: (nextPage: number) => void
  className?: string
}

function getTotalPages(total: number, limit: number) {
  if (limit <= 0) return 1
  return Math.max(1, Math.ceil(total / limit))
}

function getVisiblePages(current: number, totalPages: number): Array<number | "..."> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: Array<number | "..."> = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)

  if (start > 2) pages.push("...")

  for (let p = start; p <= end; p++) pages.push(p)

  if (end < totalPages - 1) pages.push("...")

  pages.push(totalPages)
  return pages
}

export default function ProjectPagination({
  page,
  limit,
  total,
  onPageChange,
  className,
}: Props) {
  const currentPage = Math.max(1, page || 1)
  const pageSize = Math.max(1, limit || 10)
  const totalPages = getTotalPages(total, pageSize)

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, total)

  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages
  const visiblePages = getVisiblePages(currentPage, totalPages)

  if (totalPages <= 1) {
    return (
      <div
        className={cn(
          "rounded-xl border bg-card/70 px-4 py-3 text-sm text-muted-foreground",
          className
        )}
      >
        Showing {start}–{end} of <span className="font-medium text-foreground">{total}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{start}</span>–
        <span className="font-medium text-foreground">{end}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {visiblePages.map((item, i) =>
          item === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              variant={item === currentPage ? "default" : "outline"}
              className="h-8 min-w-8 px-2"
              onClick={() => onPageChange(item)}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Button>
          )
        )}

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}