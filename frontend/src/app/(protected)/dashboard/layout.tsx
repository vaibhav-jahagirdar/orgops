"use client"

import { useMe } from "@/features/auth/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"



export default function DashboardLayout({ children } : any) {
    const router = useRouter()
    const {data, isLoading , isError} = useMe()

    useEffect(() => {
        if(isError) {
            router.replace("/login")
        }
    },[isError, router])

    if(isLoading) return <div>Loading ... </div>

    return <>
    {children}</>

}