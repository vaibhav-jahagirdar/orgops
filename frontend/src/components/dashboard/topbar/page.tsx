"use client"

import { ChevronDown, DoorOpen, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type Org = {
  id: number
  name: string
  role: "owner" | "admin" | "member"
}

type UserType = {
  id: number
  email: string
  name: string
}

export function Topbar({
  currentOrg,
  userInfo
}: {
  currentOrg: Org
  userInfo: UserType
}) {
  const [open, setOpen] = useState(false)

  const links = [
    {
      label: "Profile Settings",
      href: `/profile`,
      icon: User
    },
    {
      label: "Logout",
      href: `/logout`,
      icon: DoorOpen
    }
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      {/* Left: org identity */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="truncate text-base font-semibold tracking-tight sm:text-lg">
            {currentOrg.name}
          </p>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
            {currentOrg.role}
          </span>
        </div>
      </div>

      {/* Right: user menu */}
      <div className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className="group flex max-w-[62vw] items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-2.5 py-1.5 transition hover:bg-muted/50 sm:max-w-none sm:gap-3 sm:px-3 sm:py-2"
        >
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-background">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="truncate text-sm font-semibold leading-tight">
              {userInfo.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {userInfo.email}
            </p>
          </div>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}