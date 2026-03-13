"use client"

import { ChevronDown, DoorOpen, User, User2Icon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type Org = {
    id: number
    name: string
    role: "owner" | "admin" | "member"
}

type User = {
    id: number
    email: string
    name: string
}

export function Topbar({ currentOrg, userInfo }: {
    currentOrg: Org
    userInfo: User
}) {

    const [open, setOpen] = useState(false)
    const links = [{
        label: "Profile Settings",
        href: `/profile`,
        icon: User
    },

    {
        label: "Logout",
        href: `/logout`,
        icon: DoorOpen
    }]
    return (
        <div className="border-b h-14 border-gray-300/75 rounded-md flex justify-between">
            <div className="flex items-center gap-3 font-semibold tracking-tight">
                <p className="text-lg pl-9">{currentOrg.name}</p>
                <p className="text-xs  text-blue-600 font-semibold tracking-tight border border-gray-700 rounded-2xl px-2 py-px">{currentOrg.role}</p>

            </div>
            <div className="flex items-center pr-15 gap-2 relative px-6 py-5 ">
                <button
                    onClick={() => setOpen((p) => !p)} className="flex gap-2
               max-w-full items-center justify-between ">
                    <User className="border items-center  p-1 rounded-lg   " size={30} />
                    < div className="flex flex-col gap-px">
                        <p className="text-xs font-semibold">{userInfo.name}</p>
                        <p className="font-light text-[11px]">{userInfo.email}</p>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0" />
                </button>
                {open && (

                    <div className="absolute left-6 right-6 shadow-md z-50 border bg-background mt-27 rounded-md">
                        {links.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex gap-3 px-2 py-1 border items-center"
                                >
                                    <Icon size={16} />
                                    <p>{link.label}</p>
                                </Link>
                            )
                        })}
                    </div>

                )}
            </div>

        </div>
    )
}