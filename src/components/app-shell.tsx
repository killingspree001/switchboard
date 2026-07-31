"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridIcon,
  InboxIcon,
  UsersIcon,
  MegaphoneIcon,
  BookIcon,
  MenuIcon,
  CloseIcon,
} from "./icons";

const nav = [
  { href: "/dashboard", label: "Overview", icon: GridIcon },
  { href: "/inbox", label: "Inbox", icon: InboxIcon, badge: 2 },
  { href: "/leads", label: "Leads", icon: UsersIcon },
  { href: "/campaigns", label: "Campaigns", icon: MegaphoneIcon },
  { href: "/knowledge", label: "Knowledge", icon: BookIcon },
];

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-copper">
        {/* switchboard jack plug mark */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" className="h-4.5 w-4.5">
          <circle cx="12" cy="9" r="4.5" />
          <path d="M12 13.5V21M8.5 17.5h7" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        Switchboard
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-ink-soft text-white"
                : "text-zinc-400 hover:bg-ink-soft/60 hover:text-zinc-200"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-copper" />
            )}
            <Icon className={`h-5 w-5 shrink-0 ${active ? "text-copper" : ""}`} />
            <span className="font-medium">{item.label}</span>
            {item.badge ? (
              <span className="ml-auto rounded-full bg-copper px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function DemoNotice() {
  return (
    <div className="rounded-lg border border-ink-line bg-ink-soft/50 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        Demo mode
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
        Showing sample data. Connect Supabase and your API keys to go live.
      </p>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh w-full">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-ink px-4 py-5 lg:flex">
        <Logo />
        <div className="mt-8 flex-1">
          <NavLinks />
        </div>
        <DemoNotice />
        <div className="mt-4 flex items-center gap-2.5 border-t border-ink-line pt-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-copper-tint font-display text-xs font-bold text-copper-deep">
            AD
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">Admin</p>
            <p className="truncate text-xs text-zinc-500">workspace owner</p>
          </div>
        </div>
      </aside>

      {/* mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-zinc-300 hover:bg-ink-soft"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </header>

      {/* mobile slide over menu */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-ink px-4 py-5">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-zinc-300 hover:bg-ink-soft"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8 flex-1">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <DemoNotice />
          </div>
        </div>
      )}

      {/* page content */}
      <main className="flex-1 pt-14 lg:pl-60 lg:pt-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
