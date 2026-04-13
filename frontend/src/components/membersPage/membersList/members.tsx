"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Mail, CalendarDays, Shield } from "lucide-react"

type Member = {
  membership_id: number
  user_id: number
  name: string | null
  email: string
  role: "owner" | "admin" | "member"
  joined_at: string
}

type Props = {
  members: Member[]
  isLoading: boolean
  currentUserRole: "owner" | "admin" | "member"
}

function initials(name: string | null, email: string) {
  if (!name?.trim()) return email.slice(0, 2).toUpperCase()
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function roleBadge(role: Member["role"]) {
  switch (role) {
    case "owner":
      return <Badge variant="secondary" className="rounded-full">Owner</Badge>
    case "admin":
      return <Badge variant="outline" className="rounded-full">Admin</Badge>
    default:
      return <Badge variant="outline" className="rounded-full text-muted-foreground">Member</Badge>
  }
}

export default function MembersList({
  members,
  isLoading,
  currentUserRole,
}: Props) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Loading members...
      </div>
    )
  }

  if (!members.length) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No members found</p>
      </div>
    )
  }

  const canManage = currentUserRole === "owner" || currentUserRole === "admin"

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* Header */}
      <div className="grid grid-cols-12 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <div className="col-span-6 md:col-span-5">Member</div>
        <div className="hidden md:col-span-3 md:block">Role</div>
        <div className="hidden md:col-span-3 md:block">Joined</div>
        <div className="col-span-6 flex justify-end md:col-span-1">Actions</div>
      </div>

      {/* Rows */}
      <ul className="divide-y">
        {members.map((m) => (
          <li
            key={m.membership_id}
            className="grid grid-cols-12 items-center px-4 py-3 transition-colors hover:bg-muted/30"
          >
            {/* Member info */}
            <div className="col-span-9 md:col-span-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="text-xs font-medium">
                    {initials(m.name, m.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {m.name ?? "No name"}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {m.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="hidden md:col-span-3 md:block">
              <div className="inline-flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                {roleBadge(m.role)}
              </div>
            </div>

            {/* Joined */}
            <div className="hidden md:col-span-3 md:block">
              <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}
              </p>
            </div>

            {/* Actions */}
            <div className="col-span-3 flex justify-end md:col-span-1">
              {canManage ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>View member</DropdownMenuItem>

                    {m.role === "member" && (
                      <DropdownMenuItem>Promote to admin</DropdownMenuItem>
                    )}

                    {m.role === "admin" && currentUserRole === "owner" && (
                      <DropdownMenuItem>Demote to member</DropdownMenuItem>
                    )}

                    {m.role !== "owner" && (
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        Remove member
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </div>

            {/* Mobile metadata */}
            <div className="col-span-12 mt-2 flex items-center gap-2 md:hidden">
              {roleBadge(m.role)}
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}