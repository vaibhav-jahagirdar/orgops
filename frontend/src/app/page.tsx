import Link from 'next/link'
import type { Metadata } from 'next'
import { Syne } from 'next/font/google'
import { IBM_Plex_Mono } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'OrgOps — Project operations for modern teams',
  description: 'Multi-tenant project and team management for growing organizations.',
}

const features = [
  {
    label: '01',
    title: 'Multi-tenant workspaces',
    description:
      'Isolated organizations with full role-based access control. Invite members, assign roles, and keep data cleanly separated across tenants.',
  },
  {
    label: '02',
    title: 'Project & task tracking',
    description:
      'Create projects, break them into tasks, and track status across your team. Everything in one place — no context switching.',
  },
  {
    label: '03',
    title: 'Built for teams at scale',
    description:
      'Row-level security, refresh token rotation, and atomic commits under the hood. Production-grade architecture from day one.',
  },
]

export default function Page() {
  return (
    <div
      className={`${syne.variable} ${mono.variable} min-h-screen bg-[#080808] text-white`}
      style={{ fontFamily: 'var(--font-syne), sans-serif' }}
    >
     
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />


      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <span
          className="text-[15px] font-semibold tracking-tight text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          OrgOps
        </span>

        <nav className="flex items-center gap-1">
          <Link
            href="/login"
            className="px-4 py-1.5 text-[13px] text-zinc-400 hover:text-white transition-colors rounded-md hover:bg-white/[0.05]"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-[13px] bg-white text-black font-medium rounded-md hover:bg-zinc-100 transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>


      <section className="relative z-10 mx-auto max-w-4xl px-8 pt-28 pb-24">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1"
        >
          <span
            className="text-[11px] tracking-widest text-zinc-500 uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            v1.0 — Now available
          </span>
        </div>

        <h1
          className="text-[56px] font-bold leading-[1.05] tracking-tight text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Project operations
          <br />
          <span className="text-zinc-500">for modern teams.</span>
        </h1>

        <p className="mt-6 max-w-[480px] text-[16px] leading-relaxed text-zinc-400">
          OrgOps brings structure to multi-tenant organizations — projects, tasks, members,
          and roles. Everything you need to run a team, nothing you don't.
        </p>

        <div className="mt-10 flex items-center gap-3">
          <Link
            href="/register"
            className="inline-flex h-10 items-center px-5 text-[13px] font-medium bg-white text-black rounded-md hover:bg-zinc-100 transition-colors"
          >
            Create your workspace
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center px-5 text-[13px] font-medium text-zinc-400 border border-white/10 rounded-md hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      <div className="relative z-10 border-t border-white/[0.06]" />

      <section className="relative z-10 mx-auto max-w-4xl px-8 py-20">
        <p
          className="mb-10 text-[11px] tracking-widest text-zinc-600 uppercase"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          What&apos;s inside
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {features.map((f) => (
            <div key={f.label} className="py-8 md:px-8 first:md:pl-0 last:md:pr-0">
              <span
                className="block mb-4 text-[11px] tracking-widest text-zinc-700"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {f.label}
              </span>
              <h3
                className="mb-3 text-[15px] font-semibold leading-snug text-white"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {f.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-zinc-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

     
      <div className="relative z-10 border-t border-white/[0.06]" />

  
      <section className="relative z-10 mx-auto max-w-4xl px-8 py-24 text-center">
        <h2
          className="text-[36px] font-bold tracking-tight text-white"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          Ready to get organized?
        </h2>
        <p className="mt-3 text-[14px] text-zinc-500">
          Free to use. No credit card required.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex h-10 items-center px-6 text-[13px] font-medium bg-white text-black rounded-md hover:bg-zinc-100 transition-colors"
          >
            Get started for free
          </Link>
        </div>
      </section>


      <footer className="relative z-10 border-t border-white/[0.06] px-8 py-6 flex items-center justify-between">
        <span
          className="text-[12px] text-zinc-700"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          OrgOps
        </span>
        <span className="text-[12px] text-zinc-700">
          {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  )
}