"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HelpCircle, Menu, Search, X } from "lucide-react";
import { MOBILE_TABS, titleFor } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function AppShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  // Close the mobile drawer when the route changes.
  useEffect(() => setDrawer(false), [pathname]);

  return (
    <div className="min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-w)] border-r border-border bg-surface lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawer(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[var(--sidebar-w)] border-r border-border bg-surface shadow-xl">
            <button
              aria-label="Close menu"
              onClick={() => setDrawer(false)}
              className="absolute top-4 right-3 grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[var(--sidebar-w)]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg/85 px-4 backdrop-blur lg:px-8">
          <button
            aria-label="Open menu"
            onClick={() => setDrawer(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <p className="hidden text-[13px] font-semibold sm:block">{titleFor(pathname)}</p>
          <div className="ml-auto flex items-center gap-2">
            <label className="flex h-9 w-44 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-muted sm:w-64">
              <Search className="h-4 w-4 shrink-0" />
              <input
                placeholder="Search topics, systems, problems…"
                className="w-full bg-transparent text-[13px] text-text outline-none placeholder:text-muted"
                disabled
                title="Search arrives with the content sections"
              />
            </label>
            <button
              aria-label="Help"
              className="hidden h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted hover:text-text sm:grid"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <UserMenu email={email} />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pt-8 pb-28 lg:px-8 lg:pb-12">{children}</main>
      </div>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        {MOBILE_TABS.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                active ? "font-semibold text-brand" : "text-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
