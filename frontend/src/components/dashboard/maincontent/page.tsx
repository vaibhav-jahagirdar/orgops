"use client"

import { Folder, CheckSquare, AlertTriangle, Users, Plus } from "lucide-react"
import Link from "next/link"

type DashboardData = {
  kpis: {
    activeProjects: number
    dueToday: number
    overdue: number
    completionRate: number
    members: number
  }
  myTasks: {
    overdue: any[]
    today: any[]
    upcoming: any[]
  }
  deadlines: any[]
  projects: any[]
  activity: any[]
  insights: {
    overloadedUsers: any[]
    unassignedTasks: number
    riskyProjects: number
  }
}

export function Maincontent({
  currentOrg,
  userInfo,
  dashboardData
}: {
  currentOrg: any
  userInfo: any
  dashboardData: DashboardData
}) {
  const isAdmin = ["owner", "admin"].includes(currentOrg.role)
  const { kpis, myTasks, deadlines, projects, activity, insights } = dashboardData

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        <Card title="Projects" value={kpis.activeProjects} icon={Folder} />
        <Card title="Due Today" value={kpis.dueToday} icon={CheckSquare} />
        <Card title="Overdue" value={kpis.overdue} icon={AlertTriangle} highlight />
        {isAdmin && <Card title="Members" value={kpis.members} icon={Users} />}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className={isAdmin ? "lg:col-span-7" : "lg:col-span-8"}>
          <Section
            title="Your Work"
            action={
              <Link
                href={`/dashboard/${currentOrg.id}/tasks/create`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Task
              </Link>
            }
          >
            {[...myTasks.overdue, ...myTasks.today, ...myTasks.upcoming].length === 0 && (
              <Empty text="No tasks assigned" />
            )}

            {myTasks.overdue.map((t) => (
              <Row key={t.id} title={t.title} sub={t.project} right="Overdue" danger />
            ))}

            {myTasks.today.map((t) => (
              <Row key={t.id} title={t.title} sub={t.project} right="Today" />
            ))}

            {myTasks.upcoming.map((t) => (
              <Row key={t.id} title={t.title} sub={t.project} right={t.due_date} />
            ))}
          </Section>
        </div>

        <div className={`${isAdmin ? "lg:col-span-5" : "lg:col-span-4"} space-y-6`}>
          <Section title="Deadlines">
            {deadlines.length === 0 && <Empty text="No upcoming deadlines" />}

            {deadlines.map((d) => (
              <Row key={d.id} title={d.title} sub={d.project} right={d.due_date} />
            ))}
          </Section>

          {isAdmin && (
            <Section title="Insights">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="mr-1 text-amber-500">⚠</span>
                {insights.unassignedTasks} unassigned tasks
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="mr-1 text-amber-500">⚠</span>
                {insights.riskyProjects} risky projects
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="mr-1 text-amber-500">⚠</span>
                {insights.overloadedUsers.length} overloaded users
              </p>
            </Section>
          )}
        </div>

        {isAdmin && (
          <div className="lg:col-span-6">
            <Section
              title="Project Health"
              action={
                <Link
                  href={`/dashboard/${currentOrg.id}/projects/create`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Project
                </Link>
              }
            >
              {projects.length === 0 && <Empty text="No projects yet" />}

              {projects.map((p) => (
                <div key={p.id} className="space-y-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {p.name}
                  </p>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-2 rounded-full bg-zinc-900 dark:bg-zinc-100"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  {p.overdueTasks > 0 && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      {p.overdueTasks} overdue
                    </p>
                  )}
                </div>
              ))}
            </Section>
          </div>
        )}

        <div className={isAdmin ? "lg:col-span-6" : "lg:col-span-12"}>
          <Section title="Activity">
            {activity.length === 0 && <Empty text="No recent activity" />}

            {activity.map((a) => (
              <p
                key={a.id}
                className="rounded-md border border-zinc-200/70 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
              >
                {a.message}
              </p>
            ))}
          </Section>
        </div>
      </div>
    </div>
  )
}

function Card({ title, value, icon: Icon, highlight }: any) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-zinc-950 ${
        highlight
          ? "border-rose-200 dark:border-rose-900/60"
          : "border-zinc-200 dark:border-zinc-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {title}
        </p>
        <Icon
          className={`h-4 w-4 ${
            highlight ? "text-rose-500" : "text-zinc-500 dark:text-zinc-400"
          }`}
        />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {value}
      </p>
    </div>
  )
}

function Section({ title, children, action }: any) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {action}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Row({ title, sub, right, danger }: any) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-transparent px-2 py-2 transition hover:border-zinc-200 hover:bg-zinc-50 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/50">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
          {title}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
      </div>
      <span
        className={`ml-3 shrink-0 text-xs font-medium ${
          danger
            ? "text-rose-600 dark:text-rose-400"
            : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        {right}
      </span>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-zinc-300 px-3 py-3 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
      {text}
    </p>
  )
}