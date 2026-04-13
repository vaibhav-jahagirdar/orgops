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
  const cookieHeader = {
    cookie: cookieStore.toString()
  }

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

  if (orgRes.status === 403) {
    redirect("/dashboard")
  }

  if (!orgRes.ok) {
    redirect("/dashboard")
  }

  if (!dashboardRes.ok) {
    console.error("Dashboard API failed:", dashboardRes.status)

  }

  const [orgJson, orgsJson, userJson, dashboardJson] = await Promise.all([
    orgRes.json(),
    orgsRes.json(),
    userRes.json(),
    dashboardRes.json()
  ])

  console.log("ORG RAW:", orgJson)
  console.log("ORGS RAW:", orgsJson)
  console.log("USER RAW:", userJson)
  console.log("DASHBOARD RAW:", dashboardJson)

  
  const org = orgJson?.org
  const orgs = orgsJson?.orgs
  const user = userJson

  const dashboardData = dashboardJson?.data ?? dashboardJson

  if (!dashboardData || !dashboardData.kpis) {
    console.error("Invalid dashboardData shape:", dashboardData)
    return <div>Loading dashboard...</div>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar currentOrg={org} orgs={orgs} />

      <div className="flex-1 flex flex-col">
        <Topbar currentOrg={org} userInfo={user} />

        <main className="flex-1 p-6">
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