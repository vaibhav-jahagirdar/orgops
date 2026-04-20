"use client"

import {
  Check,
  CheckSquare,
  ChevronDown,
  Folder,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Plus
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

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
    { label: "Dashboard", href: base,               icon: LayoutDashboard },
    { label: "Projects",  href: `${base}/projects`, icon: Folder          },
   
    { label: "Members",   href: `${base}/members`,  icon: Users           },
  ]

 
  return (
    <aside className="sticky top-0 z-40 h-screen w-[220px] shrink-0 flex flex-col border-r border-zinc-900 bg-zinc-950">


      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-zinc-900">
        <div className="h-5 w-5 rounded-sm bg-zinc-100 flex items-center justify-center shrink-0">
          <span className="font-mono text-[9px] font-bold text-zinc-900 leading-none">OO</span>
        </div>
        <span className="font-mono text-[13px] font-medium text-zinc-300 tracking-tight">
          OrgOps
        </span>
      </div>

   
      <div className="relative px-3 py-3 border-b border-zinc-900">
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center justify-between gap-2 rounded-sm px-3 py-2 bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
        >
          <div className="min-w-0 text-left">
            <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 mb-0.5">
              Workspace
            </p>
            <p className="truncate text-[12px] font-medium text-zinc-300">
              {currentOrg.name}
            </p>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-zinc-600 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-3 right-3 top-[calc(100%-4px)] z-50 mt-1 border border-zinc-800 bg-zinc-950 rounded-sm shadow-xl overflow-hidden">
            <div className="max-h-52 overflow-auto py-1">
              {orgs.map((org) => (
                <Link
                  key={org.id}
                  href={`/dashboard/${org.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-[12px] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
                >
                  <span className="truncate">{org.name}</span>
                  {org.id === currentOrg.id && (
                    <Check className="h-3 w-3 text-zinc-400 shrink-0 ml-2" />
                  )}
                </Link>
              ))}
            </div>
            <div className="border-t border-zinc-900 p-1">
              <Link
                href="/create-org"
                className="flex items-center gap-2 px-3 py-2 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors rounded-sm hover:bg-zinc-900"
              >
                <Plus className="h-3 w-3" />
                New workspace
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-px">
        {mainLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-sm px-3 py-2 text-[12px] font-medium transition-colors border-l-2 ${
                isActive
                  ? "border-l-zinc-400 bg-zinc-900 text-zinc-100"
                  : "border-l-transparent text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-zinc-300" : "text-zinc-600"}`} />
              {link.label}
            </Link>
          )
        })}

       
      </nav>

    
      <div className="px-4 py-3 border-t border-zinc-900">
        <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-700">
          {currentOrg.role}
        </p>
      </div>
    </aside>
  )
}