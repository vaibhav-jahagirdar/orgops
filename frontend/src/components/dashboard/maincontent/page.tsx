"use client"

import { ArrowBigRight, ArrowRight, Building2, CheckSquare, File, FileExclamationPointIcon, Folder, FolderArchive, FolderCheck, FolderCodeIcon, FolderOpen, Users } from "lucide-react"
import Link from "next/link"

type Org = {
    id: number
    name: string
    role: "owner" | "admin" | "member"
    member_count: number
}

type User = {
    id: number
    email: string
    name: string
}
type Project = {
    id: number
    name: string


}
export function Maincontent({ orgs, currentOrg, userInfo, projects, pagination }: {
    orgs: Org[]
    currentOrg: Org
    userInfo: User
    projects: Project[]
    pagination: any
}) {
    const orgInfo = [{
        title: "Active Projects",
        count: pagination.total,
        icon: FolderOpen

    },
    {
        title: "Your Tasks",
        count: pagination.total,
        icon: CheckSquare

    },
    {
        title: "Team Members",
        count: pagination.total,
        icon: Users

    },
    {
        title: "Pending Tasks",
        count: pagination.total,
        icon: FileExclamationPointIcon

    }]
    return (
        <div className="flex flex-col gap-5 ">
            <div className="border flex-col border-gray-300/70 rounded-lg max-w-9/12 bg-gray-100/75 p-6">
                <div className="flex gap-4 px-4">
                    <Building2 className="shrink-0 border rounded-md h-9 w-9 p-1.75" strokeWidth={1.8} />
                    <p className="font-semibold text-lg">{currentOrg.name}</p>
                </div>
                <div className="flex flex-col pl-16">
                    <p className="text-xs font-light tracking-tight  ">Eterprise software solutions</p>
                    <div className="flex gap-3">
                        <p className=" pt-3 text-xs">{currentOrg.member_count} members</p>
                        <span className="text-xs mt-3 text-blue-600 border border-gray-500/80 px-2 rounded-xl py-px" >{currentOrg.role}</span>
                    </div>
                </div>

            </div>
            <div className="flex gap-5.25 ">
                {orgInfo.map((info) => {
                    const Icon = info.icon
                    return (
                        <div key={info.title} >
                            <div className="flex flex-col">
                                <div className="flex justify-around border  border-gray-300/75 bg-gray-300/10 w-55 h-30 rounded-lg ">
                                    <div className="flex flex-col justify-between">
                                        <p className="text-xs font-semibold pt-5 tracking-tight">{info.title}</p>
                                        <p className="font-bold text-2xl pb-6 ">{info.count}</p>
                                    </div>
                                    <Icon className="border my-3 bg-gray-200/15  border-gray-300/85 px-px py-1.5  rounded-lg  h-8 w-8 shrink-0" />

                                </div>



                            </div>




                        </div>
                    )
                }


                )}

            </div>
            <div className="border border-gray-300/75 bg-gray h-48 rounded-lg max-w-6/12 flex flex-col gap-10  bg-gray-300/10">
                <div className="flex justify-between">
                    <div className="flex pt-5">
                        <FolderOpen className="shrink-0 h-4 w-4 ml-5" />
                        <p className="font-semibold text-sm pl-3">Projects</p>
                    </div>
                    <div className="  px-3 py-px shadow-md mt-3 rounded-xl hover:scale-105 transition   mr-2  bg-gray-800/75">
                        <Link
                        href={`/dashboard/${currentOrg.id}/create-project`}
                        className="text-xs font-semibold py-1 text-gray-100/95 transition duration-600 ease-in-out hover:scale-105 ">+ New Project
                        </Link>
                    </div>


                </div>
                <div className="flex">
                {projects.map((project) => (
                    <div  key={project.id}
                    className="border border-gray-300/45 w-80 h-22 rounded-lg mr-4 ml-4 pl-4 pt-1 bg-gray-50">
                        <div className="flex flex-col   ">
                            <div className="flex  border-b pb-4 justify-between">
                                <p className="text-sm tracking-tight pt-1 ">{project.name}</p>
                                <Link
                                href={`/`}>
                                    <ArrowRight />
                                </Link>

                            </div>
                            <div className="pt-2">
                                <p className="text-xs">
                                {currentOrg.member_count} Members 
                            </p>
                            </div>
                    
                            

                        </div>

                    </div>

                ))}
            </div>
             <div className="flex border border-gray-300/75 rounded-lg  flex-col">
                <div className="flex justify-between">
                    <div className="flex gap-2 pl-3">
                        <CheckSquare className="h-5 w-5 shrink-0 "/>
                        <span className="tracking-tight font-semibold">Your Tasks</span>
                       
                    </div>
                     <div className=" px-3 py-px shadow-md mt-px rounded-xl hover:scale-105 transition   mr-2  bg-gray-800/75">
                        <Link
                        href={`/dashboard/${currentOrg.id}/create-project`}
                        className="text-xs font-semibold py-1 text-gray-100/95 transition duration-600 ease-in-out hover:scale-105 ">+ Create Task
                        </Link>
                    </div>
                    
                </div>

             </div>
            </div>
            



        </div>
    )
}