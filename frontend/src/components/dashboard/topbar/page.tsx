"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks";

type Org = {
  id: number;
  name: string;
  role: "owner" | "admin" | "member";
};

type UserType = {
  id: number;
  email: string;
  name: string;
};

export function Topbar({
  currentOrg,
  userInfo,
}: {
  currentOrg: Org;
  userInfo: UserType;
}) {
  const [open, setOpen] = useState(false);

  const { logout } = useAuth(); 

  const initials = userInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    setOpen(false);
    await logout(); 
  };

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-zinc-900 bg-zinc-950 px-5">
      <div className="flex items-center gap-3 min-w-0">
        <p className="text-[13px] font-medium text-zinc-300 truncate">
          {currentOrg.name}
        </p>
        <span className="font-mono text-[9px] tracking-widest uppercase text-zinc-700 border border-zinc-800 px-1.5 py-0.5 rounded-sm">
          {currentOrg.role}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900/50 px-2.5 py-1.5 transition hover:border-zinc-700 hover:bg-zinc-900"
        >
          <div className="h-5 w-5 rounded-sm bg-zinc-800 flex items-center justify-center shrink-0">
            <span className="font-mono text-[9px] font-medium text-zinc-300 leading-none">
              {initials}
            </span>
          </div>
          <span className="hidden sm:block text-[12px] font-medium text-zinc-400 max-w-[120px] truncate">
            {userInfo.name}
          </span>
          <ChevronDown
            className={`h-3 w-3 text-zinc-600 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-1 w-48 border border-zinc-800 bg-zinc-950 rounded-sm shadow-xl overflow-hidden">
            <div className="px-3 py-2.5 border-b border-zinc-900">
              <p className="text-[12px] font-medium text-zinc-300 truncate">
                {userInfo.name}
              </p>
              <p className="text-[11px] text-zinc-600 truncate">
                {userInfo.email}
              </p>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-3.5 w-3.5 text-zinc-600" />
                Profile settings
              </Link>

              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] text-zinc-400 hover:bg-zinc-900 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5 text-zinc-600" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}