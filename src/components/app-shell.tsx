"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GridIcon,
  InboxIcon,
  UsersIcon,
  MegaphoneIcon,
  BookIcon,
} from "./icons";
import ThemeToggle from "./theme-toggle";

const nav = [
  { href: "/dashboard", label: "Overview", icon: GridIcon },
  { href: "/inbox", label: "Inbox", icon: InboxIcon, badge: 2 },
  { href: "/leads", label: "Leads", icon: UsersIcon },
  { href: "/campaigns", label: "Campaigns", icon: MegaphoneIcon },
  { href: "/knowledge", label: "Knowledge", icon: BookIcon },
];

export function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
        {/* patch cable mark, two jacks connecting */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" className="h-4.5 w-4.5">
          <circle cx="7" cy="7" r="2.6" />
          <circle cx="17" cy="17" r="2.6" />
          <path d="M9 9c2.5 2.5 3.5 3.5 6 6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Switchboard
      </span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* desktop tabs */}
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent-tint text-accent-deep"
                      : "text-muted hover:bg-paper hover:text-text"
                  }`}
                >
                  {item.label}
                  {item.badge ? (
                    <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-demo-border bg-demo-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-demo-text sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-demo-text" />
              Demo
            </span>
            <ThemeToggle />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft font-display text-xs font-bold text-accent-deep">
              AD
            </span>
          </div>
        </div>
      </header>

      {/* page content, extra bottom padding on mobile for the tab bar */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>

      {/* mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-accent-deep" : "text-faint"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.badge ? (
                  <span className="absolute right-1/2 top-1.5 -mr-5 h-1.5 w-1.5 rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
