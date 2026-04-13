"use client"

import {
  Check,
  CheckSquare,
  ChevronDown,
  Folder,
  Infinity,
  LayoutDashboard,
  Settings,
  Shield,
  Users
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Building2Icon } from "lucide-react"

type Org = {
  id: number
  name: string
  role: "owner" | "admin" | "member"
}

export function Sidebar({
  currentOrg,
  orgs
}: {
  currentOrg: Org
  orgs: Org[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const base = `/dashboard/${currentOrg.id}`

  const mainLinks = [
    {
      label: "Dashboard",
      href: base,
      icon: LayoutDashboard
    },
    {
      label: "Projects",
      href: `${base}/Projects`,
      icon: Folder
    },
    {
      label: "Tasks",
      href: `${base}/tasks`,
      icon: CheckSquare
    },
    {
      label: "Members",
      href: `${base}/members`,
      icon: Users
    }
  ]

  const adminLinks =
    currentOrg.role === "owner" || currentOrg.role === "admin"
      ? [
          {
            label: "Team Management",
            href: `${base}/team`,
            icon: Shield
          },
          {
            label: "Settings",
            href: `${base}/settings`,
            icon: Settings
          }
        ]
      : []

  return (
    <aside className="sticky top-0 z-40 h-screen w-[280px] max-w-[82vw] border-r border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 ring-1 ring-border/60">
              <Infinity className="h-5 w-5 text-primary" />
            </div>
            <p className="text-lg font-semibold tracking-tight">OrgOps</p>
          </div>
        </div>

        {/* Org Switcher */}
        <div className="relative border-b border-border/60 px-4 py-4">
          <button
            onClick={() => setOpen((p) => !p)}
            className="group flex w-full items-center justify-between rounded-xl border border-border/70 bg-muted/30 px-3 py-3 text-left transition hover:bg-muted/50"
          >
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <Building2Icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current org
                </p>
              </div>
              <p className="truncate text-sm font-semibold">{currentOrg.name}</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute left-4 right-4 top-[calc(100%-2px)] z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
              <div className="max-h-64 overflow-auto p-1">
                {orgs.map((org) => (
                  <Link
                    key={org.id}
                    href={`/dashboard/${org.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                  >
                    <span className="truncate">{org.name}</span>
                    {org.id === currentOrg.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/")
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {adminLinks.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              <nav className="space-y-1">
                {adminLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(link.href + "/")
                  const Icon = link.icon

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}