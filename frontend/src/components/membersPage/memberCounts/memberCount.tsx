"use client"

import { Crown, ShieldCheck, Users, User } from "lucide-react"

type Props = {
  total: number
  owners: number
  admins: number
  members: number
}

function Item({
  icon,
  label,
  value,
  subtle,
}: {
  icon: React.ReactNode
  label: string
  value: number
  subtle?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={`text-base font-semibold ${subtle ? "text-foreground/90" : "text-foreground"}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default function MemberCounts({ total, owners, admins, members }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
        <Item
          label="Total"
          value={total}
          icon={<Users className="h-4 w-4 text-foreground/80" />}
        />
        <Item
          label="Owners"
          value={owners}
          subtle
          icon={<Crown className="h-4 w-4 text-foreground/70" />}
        />
        <Item
          label="Admins"
          value={admins}
          subtle
          icon={<ShieldCheck className="h-4 w-4 text-foreground/70" />}
        />
        <Item
          label="Members"
          value={members}
          subtle
          icon={<User className="h-4 w-4 text-foreground/70" />}
        />
      </div>
    </div>
  )
}