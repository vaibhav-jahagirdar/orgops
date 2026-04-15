"use client"

import { useEffect, useState } from "react"

type Props = {
  stats: {
    total: number
    inProgress: number
    overdue: number
    todo: number
    done: number
    memberCount: number
  }
}

const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
  </svg>
)
const CircleDotIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
)
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const UsersIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const LayoutGridIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
)
const AlertIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

type CardConfig = {
  label: string
  value: string | number
  icon: React.ReactNode
  warn?: boolean
  extra?: React.ReactNode
}

export default function ProjectStats({ stats }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const completion = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  const cards: CardConfig[] = [
    { label: "Total",       value: stats.total,       icon: <LayoutGridIcon /> },
    { label: "In Progress", value: stats.inProgress,  icon: <CircleDotIcon /> },
    { label: "Todo",        value: stats.todo,         icon: <ClockIcon /> },
    { label: "Done",        value: stats.done,         icon: <CheckIcon /> },
    { label: "Overdue",     value: stats.overdue,      icon: <AlertIcon />, warn: stats.overdue > 0 },
    { label: "Members",     value: stats.memberCount,  icon: <UsersIcon /> },
    {
      label: "Progress",
      value: `${completion}%`,
      icon: <TrendUpIcon />,
      extra: (
        <div className="mt-2 h-px w-full bg-zinc-100">
          <div
            className="h-px bg-zinc-800 transition-all duration-700"
            style={{ width: `${completion}%` }}
          />
        </div>
      ),
    },
  ]

  return (
    <section className="w-full">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {cards.map((card, i) => (
          <article
            key={card.label}
            className="relative rounded-lg border border-zinc-200 bg-white px-3 py-2.5 transition-colors duration-150 hover:border-zinc-300 hover:bg-zinc-50"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(5px)",
              transition: `opacity 240ms ease ${i * 40}ms, transform 240ms ease ${i * 40}ms`,
            }}
          >
            <div className="flex items-center gap-1.5 text-zinc-400">
              {card.icon}
              <p className="text-[10px] font-medium uppercase tracking-widest">{card.label}</p>
            </div>

            <p className={`mt-1.5 text-[17px] font-semibold leading-none tracking-tight ${
              card.warn ? "text-zinc-900" : "text-zinc-800"
            }`}>
              {card.value}
              {card.warn && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-zinc-900 align-middle" />
              )}
            </p>

            {card.extra}
          </article>
        ))}
      </div>
    </section>
  )
}