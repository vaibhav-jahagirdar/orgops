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
  const { kpis, myTasks, deadlines, projects, insights } = dashboardData
  const allTasks = [...myTasks.overdue, ...myTasks.today, ...myTasks.upcoming]

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 p-6">

      {/* ── KPI Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-px bg-zinc-900 border border-zinc-900 rounded-sm overflow-hidden sm:grid-cols-4">
        <KpiCard label="Projects"  value={kpis.activeProjects} icon={Folder}        />
        <KpiCard label="Due Today" value={kpis.dueToday}       icon={CheckSquare}   />
        <KpiCard label="Overdue"   value={kpis.overdue}        icon={AlertTriangle} danger />
        {isAdmin && <KpiCard label="Members" value={kpis.members} icon={Users} />}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Left — 2/3 */}
        <div className="lg:col-span-2 space-y-4">
          <Panel
            title="Your Work"
            action={
              <Link
                href={`/dashboard/${currentOrg.id}/tasks/create`}
                className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
              >
                <Plus className="h-3.5 w-3.5" />
                New task
              </Link>
            }
          >
            {allTasks.length === 0 && <Empty text="No tasks assigned to you" />}
            {myTasks.overdue.map((t) => (
              <Row key={t.id} title={t.title} sub={t.project} badge="Overdue" danger />
            ))}
            {myTasks.today.map((t) => (
              <Row key={t.id} title={t.title} sub={t.project} badge="Today" />
            ))}
            {myTasks.upcoming.map((t) => (
              <Row key={t.id} title={t.title} sub={t.project} badge={t.due_date} />
            ))}
          </Panel>

          {isAdmin && (
            <Panel
              title="Project Health"
              action={
                <Link
                  href={`/dashboard/${currentOrg.id}/projects/create`}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New project
                </Link>
              }
            >
              {projects.length === 0 && <Empty text="No projects yet" />}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {projects.map((p) => (
                  <ProjectRow
                    key={p.id}
                    name={p.name}
                    progress={p.progress}
                    overdueTasks={p.overdueTasks}
                  />
                ))}
              </div>
            </Panel>
          )}
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-4">
          <Panel title="Deadlines">
            {deadlines.length === 0 && <Empty text="No upcoming deadlines" />}
            {deadlines.map((d) => (
              <Row key={d.id} title={d.title} sub={d.project} badge={d.due_date} />
            ))}
          </Panel>

          {isAdmin && (
            <Panel title="Insights">
              <InsightRow label="Unassigned tasks"  value={insights.unassignedTasks}       />
              <InsightRow label="Risky projects"    value={insights.riskyProjects}          />
              <InsightRow label="Overloaded users"  value={insights.overloadedUsers.length} />
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiCard({
  label, value, icon: Icon, danger,
}: {
  label: string; value: number; icon: any; danger?: boolean
}) {
  return (
    <div className="relative bg-zinc-950 px-5 py-5">
      <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 mb-3">
        {label}
      </p>
      <p className={`font-mono text-4xl font-medium leading-none tracking-tight tabular-nums ${
        danger ? "text-rose-500" : "text-zinc-100"
      }`}>
        {value}
      </p>
      <Icon className="absolute top-5 right-5 h-4 w-4 text-zinc-800" />
    </div>
  )
}

function Panel({
  title, children, action,
}: {
  title: string; children: React.ReactNode; action?: React.ReactNode
}) {
  return (
    <section className="rounded-sm border border-zinc-900 bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900">
        <h2 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-2 space-y-px">
        {children}
      </div>
    </section>
  )
}

function Row({
  title, sub, badge, danger,
}: {
  title: string; sub: string; badge: string; danger?: boolean
}) {
  return (
    <div className={`group flex items-center justify-between rounded-sm px-3 py-2.5 border-l-2 transition-colors cursor-pointer ${
      danger
        ? "border-l-rose-900 hover:border-l-rose-500 hover:bg-rose-950/20"
        : "border-l-transparent hover:border-l-zinc-700 hover:bg-zinc-900/40"
    }`}>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors">
          {title}
        </p>
        <p className="truncate text-xs text-zinc-600 mt-0.5">{sub}</p>
      </div>
      <span className={`ml-4 shrink-0 font-mono text-[11px] font-medium ${
        danger ? "text-rose-500" : "text-zinc-600"
      }`}>
        {badge}
      </span>
    </div>
  )
}

function InsightRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-sm px-3 py-2.5 transition hover:bg-zinc-900/40">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500/70 flex-shrink-0" />
      <span className="text-[13px] text-zinc-500 flex-1">{label}</span>
      <span className="font-mono text-xs font-medium text-zinc-300">{value}</span>
    </div>
  )
}

function ProjectRow({
  name, progress, overdueTasks,
}: {
  name: string; progress: number; overdueTasks: number
}) {
  return (
    <div className="rounded-sm border border-zinc-900 bg-zinc-900/20 px-3 py-3 transition hover:border-zinc-800">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[13px] font-medium text-zinc-300 truncate mr-3">{name}</p>
        <span className="font-mono text-[11px] text-zinc-600 shrink-0">{progress}%</span>
      </div>
      <div className="h-px bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-px bg-zinc-500 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      {overdueTasks > 0 && (
        <p className="mt-2 font-mono text-[11px] font-medium text-rose-500">{overdueTasks} overdue</p>
      )}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-sm border border-dashed border-zinc-900 mx-1 py-8">
      <p className="text-xs text-zinc-700">{text}</p>
    </div>
  )
}