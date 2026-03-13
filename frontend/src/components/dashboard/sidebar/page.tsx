"use client"

import { Check, CheckSquare, ChevronDown, FolderKanban,Folder, Infinity, LayoutDashboard, Link2, Orbit, Power, Repeat, Settings, Shield, Users, Building } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import Link from "next/link"
import { Building2Icon } from "lucide-react"

type Org = {
  id: number
  name: string
  role: "owner" | "admin" | "member"
}


export function Sidebar({ currentOrg, orgs }: {
  currentOrg: Org
  orgs: Org[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const base = `/dashboard/${currentOrg.id}`

  const mainLinks = [{
    label: "Dashboard",
    href: base,
    icon: LayoutDashboard
  }, {
    label: "Projects",
    href: `${base}/Projects`,
    icon: Folder,
  }, {
    label: "Tasks",
    href: `${base}/tasks`,
    icon: CheckSquare
  }, {
    label: "Members",
    href: `${base}/members`,
    icon: Users
  },
  ]
  const adminLinks = currentOrg.role === "owner" || currentOrg.role === "admin" ? [
    {
      label: "Team Management",
      href: `${base}/team`,
      icon: Shield
    },
    {
      label: "Settings",
      href: `${base}/settings`,
      icon: Settings
    },
  ] : []

  return (
    <aside className="w-57 border-r min-h-screen border-gray-400/25 bg-background flex flex-col ml-1">
      <div className="flex gap-1 broder-b px-5 bg-gray-100   rounded-md py-4">
        <Infinity  className="w-8 h-8 shrink-0 pt-1 bg-gray-100 rounded-md "/>
        <p className="tracking-tight font-semibold pt-1 text-2xl pl-1 ">OrgOps</p>

      </div>
      <div className="border-b border-gray-300/25 px-6 py-4 relative bg-gray-100 rounded-md mt-px">
        <button
          onClick={() => setOpen((p) => !p)
          }
          className="flex w-full items-center justify-between text-left">
          <div className="bg-gray-100 ">
            <div className="flex gap-2">
              <Building2Icon size={29}  className="bg-gray-900 p-1 text-gray-50 rounded-lg " />
            <p className="text-base font-light tracking-tight flex text-gray-800 ">
              Current Org
            </p>
            </div>
            <p className="font-semibold text-base bg-gray-100 px-2 py-1 rounded-lg ml-7 tracking-tight truncate max-w-45">
              {currentOrg.name}
            </p>
          </div>
          <ChevronDown className="h-5 w-5" />
        </button>
        {open && (
          <div className="absolute left-6 right-6 mt-4 rounded-md border bg-background shadow-md z-50">
            {orgs.map((org) => (
              <Link
                key={org.id}
                href={`/dashboard/${org.id}`}
                className="flex items-center justify-between px-4   py-2 text-sm hover:bg-muted">
                {org.name} 
                {org.id === currentOrg.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </Link>
            ))}

          </div>
        )}
      </div>
     <div className=" flex-1 overflow-y-auto   rounded-md mt-px">
  <div className="bg-gray-100 px-3 py-5">
    <nav className="space-y-1">
      {mainLinks.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
        const Icon  = link.icon
         return(
          <Link
          key={link.href}
          href={link.href}
          className={`group flex items-center gap-3 rounded-md px-2 py-2 text-sm tracking-tight font-medium trasnsition colors ${isActive ? "bg-primary text-primary-foreground " : "text-gray-600 hover:bg-gray-300/75 hover:text-foreground"}`}>
            <Icon className="h-4 w-4 shrink-0"/>
            {link.label}
          </Link>
         )
      })}
    </nav>
  </div>

  {adminLinks.length > 0 && (
    <div className="mt-1 rounded-md  bg-gray-100">
      <p className=" tracking-tight font-semibold px-3 text-lg    text-gray-900 mb-3 pt-3">
        Admin
      </p>
      <div>
        <nav>
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
            const Icon = link.icon 
            return (
              <Link
              key={link.href}
              href={link.href}
              className={`group flex gap-3 px-3 py-2 text-sm  text-muted-foreground rounded-md font-medium transition colors ${isActive ? "bg-primary text-primary-foreground" : "text-gray-600 hover:bg-gray-300/75  hover:text-foreground"}`}  >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )}
</div>
      
    </aside>
  )
}