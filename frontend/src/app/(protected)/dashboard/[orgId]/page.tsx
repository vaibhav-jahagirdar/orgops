import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar/page"
import { Topbar } from "@/components/dashboard/topbar/page"
import { Maincontent } from "@/components/dashboard/maincontent/page"

export default async function OrgPage({
    params
}: {
    params: Promise<{ orgId: string }>
}) {
    const { orgId } = await params
    const cookieStore = await cookies()
    const cookieHeader = { cookie: cookieStore.toString() }

    const [orgRes, orgsRes, userRes, projectRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}`, { headers: cookieHeader }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, { headers: cookieHeader }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { headers: cookieHeader }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/projects`, { headers: cookieHeader }),
    ])

    if (orgRes.status === 401 || orgsRes.status === 401) redirect("/login")
    if (orgRes.status === 403) redirect("/dashboard")
    if (!orgRes.ok) redirect("/dashboard")

    const [{ org }, { orgs }, user, projectResponse] = await Promise.all([
        orgRes.json(),
        orgsRes.json(),
        userRes.json(),
        projectRes.json()
    ])

    return (
        <div className="flex min-h-screen">
            <Sidebar currentOrg={org} orgs={orgs} />
            <div className="flex-1 flex flex-col">
                <Topbar currentOrg={org} userInfo={user} />
                <main className="flex-1 p-6">
                    <Maincontent
                        orgs={orgs}
                        currentOrg={org}
                        userInfo={user}
                        projects={projectResponse.data}
                        pagination={projectResponse.pagination}
                    />
                </main>
            </div>
        </div>
    )
}