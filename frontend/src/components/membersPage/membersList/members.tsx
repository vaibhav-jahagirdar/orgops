"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Mail, CalendarDays, Shield } from "lucide-react"
import { useUpdateUserRole } from "@/features/updateRole/hooks"
import { useTransferOwnership } from "@/features/ownershipTransfer/hooks"
import { useParams } from "next/navigation"
import { useState } from "react"

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
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
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

export default function MembersList({ members, isLoading, currentUserRole }: Props) {
  const params = useParams()
  const orgId  = Number(params.orgId)

  const { mutateAsync: updateRole,       isPending }         = useUpdateUserRole()
  const { mutateAsync: transferOwnership, isPending: isTransferPending } = useTransferOwnership()

  const [transferDialogOpen,  setTransferDialogOpen]  = useState(false)
  const [transferTarget,      setTransferTarget]      = useState<Member | null>(null)

  const admins   = members.filter((m) => m.role === "admin")
  const canManage = currentUserRole === "owner" || currentUserRole === "admin"

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

  return (
    <div className="space-y-6">

      {/* ── Member list ── */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="grid grid-cols-12 border-b bg-muted/30 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <div className="col-span-6 md:col-span-5">Member</div>
          <div className="hidden md:col-span-3 md:block">Role</div>
          <div className="hidden md:col-span-3 md:block">Joined</div>
          <div className="col-span-6 flex justify-end md:col-span-1">Actions</div>
        </div>

        <ul className="divide-y">
          {members.map((m) => (
            <li
              key={m.membership_id}
              className="grid grid-cols-12 items-center px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div className="col-span-9 md:col-span-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="text-xs font-medium">
                      {initials(m.name, m.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name ?? "No name"}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {m.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden md:col-span-3 md:block">
                <div className="inline-flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  {roleBadge(m.role)}
                </div>
              </div>

              <div className="hidden md:col-span-3 md:block">
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}
                </p>
              </div>

              <div className="col-span-3 flex justify-end md:col-span-1">
                {canManage && m.role !== "owner" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {m.role === "member" && (
                        <DropdownMenuItem
                          disabled={isPending}
                          onClick={() => updateRole({ orgId, targetId: m.user_id, role: "admin" })}
                        >
                          Promote to admin
                        </DropdownMenuItem>
                      )}
                      {m.role === "admin" && currentUserRole === "owner" && (
                        <DropdownMenuItem
                          disabled={isPending}
                          onClick={() => updateRole({ orgId, targetId: m.user_id, role: "member" })}
                        >
                          Demote to member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-500 focus:text-red-500">
                        Remove member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>

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

  
      {currentUserRole === "owner" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 dark:border-amber-900 dark:bg-amber-950/20">
          <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-500">
            Danger Zone
          </h3>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Transfer Ownership</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Transfer ownership to an admin. You will be demoted to admin immediately.
              </p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 border-amber-400 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400"
              onClick={() => setTransferDialogOpen(true)}
            >
              Transfer Ownership
            </Button>
          </div>
        </div>
      )}

      
      <AlertDialog open={transferDialogOpen} onOpenChange={(open) => {
        setTransferDialogOpen(open)
        if (!open) setTransferTarget(null)
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-amber-500">⚠</span>
              Transfer Ownership
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-1">
                {!transferTarget ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Select an admin to transfer ownership to. Only admins are eligible.
                    </p>
                    {admins.length === 0 ? (
                      <p className="text-sm text-amber-600">
                        No admins available. Promote a member to admin first.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {admins.map((a) => (
                          <li key={a.user_id}>
                            <button
                              className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition hover:bg-muted"
                              onClick={() => setTransferTarget(a)}
                            >
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs">
                                  {initials(a.name, a.email)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{a.name ?? "No name"}</p>
                                <p className="text-xs text-muted-foreground">{a.email}</p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm">
                      You are transferring ownership to{" "}
                      <strong>{transferTarget.name ?? transferTarget.email}</strong>.
                    </p>
                    <p className="text-sm font-medium text-amber-600">
                      You will be demoted to admin and lose owner privileges immediately.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone.
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransferTarget(null)}>
              Cancel
            </AlertDialogCancel>
            {transferTarget && (
              <AlertDialogAction
                disabled={isTransferPending}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  transferOwnership({ targetId: transferTarget.user_id })
                  setTransferDialogOpen(false)
                  setTransferTarget(null)
                }}
              >
                {isTransferPending ? "Transferring..." : "Yes, transfer ownership"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}