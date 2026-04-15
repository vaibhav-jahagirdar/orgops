"use client"

import { useProjectDetail } from "@/features/projectDetail/hooks"
import { useParams } from "next/navigation"
import ProjectHeader from "@/components/projectDetail/projectHeader"
import ProjectStats from "@/components/projectDetail/projectStats"


export default function ProjectDetailPage() {
    const params = useParams()
    const orgId = Number(params.orgId)
    const projectId = Number(params.projectId)

    const { data, isLoading, isError } = useProjectDetail(orgId, projectId)
    console.log("PROJECT DETAIL DATA", data)

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (isError || !data) {
        return <div>Error loading project details.</div>
    }

    return (
        <div>
        <ProjectHeader project={data.project} creator={data.creator} health={data.health}/>
        <ProjectStats stats={data.stats}/>

        </div>
    )
}