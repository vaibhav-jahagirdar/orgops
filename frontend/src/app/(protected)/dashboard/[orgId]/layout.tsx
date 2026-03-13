import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function OrgLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<{ orgId: string }>
}) {
    const cookieStore = await cookies()
    const cookieHeader = { cookie: cookieStore.toString() }
    const { orgId } = await params

    const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: cookieHeader })
    if (authRes.status === 401) redirect("/login")

    return <>{children}</>
}