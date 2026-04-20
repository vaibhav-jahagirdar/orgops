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

  const [orgRes, orgsRes, userRes, dashboardRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}`, {
      headers: cookieHeader,
      cache: "no-store"
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
      headers: cookieHeader,
      cache: "no-store"
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: cookieHeader,
      cache: "no-store"
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/dashboard`, {
      headers: cookieHeader,
      cache: "no-store"
    })
  ])

  if (orgRes.status === 401 || orgsRes.status === 401) {
    redirect("/login")
  }


  const orgsJson = await orgsRes.json()
const orgs = (orgsJson?.orgs ?? []).map((o: { id: string; name: string; role: string }) => ({
  ...o,
  id: Number(o.id)
}))
  const fallbackOrg = orgs.find((o :  any) => o.id !== orgId)

  function redirectToFallback(): never {
    if (fallbackOrg) redirect(`/dashboard/${fallbackOrg.id}`)
    redirect("/create-org")
  }

  if (orgRes.status === 403 || !orgRes.ok) {
    redirectToFallback()
  }

  if (!dashboardRes.ok) {
    console.error("Dashboard API failed:", dashboardRes.status)
  }

  const [orgJson, userJson, dashboardJson] = await Promise.all([
    orgRes.json(),
    userRes.json(),
    dashboardRes.json()
  ])

  const org = orgJson?.org
  const user = userJson
  const dashboardData = dashboardJson?.data ?? dashboardJson

  if (!dashboardData || !dashboardData.kpis) {
    console.error("Invalid dashboardData shape:", dashboardData)
    return <div>Loading dashboard...</div>
  }

  return (
  <div className="flex min-h-screen bg-zinc-950">
    <Sidebar currentOrg={org} orgs={orgs} />

    <div className="flex-1 flex flex-col min-w-0">
      <Topbar currentOrg={org} userInfo={user} />

      <main className="flex-1 overflow-y-auto">
        <Maincontent
          currentOrg={org}
          userInfo={user}
          dashboardData={dashboardData}
        />
      </main>
    </div>
  </div>
)
}