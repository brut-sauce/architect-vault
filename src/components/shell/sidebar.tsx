"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vault } from "lucide-react";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 border-b border-border px-5 py-4"
      >
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-sm">
          <Vault className="h-5 w-5" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-bold">Architect Vault</span>
          <span className="block text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
            Learning hub
          </span>
        </span>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV.map((group) => (
          <div key={group.label}>
            <p
              className={cn(
                "px-2 pb-1.5 text-[11px] font-bold tracking-[0.12em] uppercase",
                group.tone,
              )}
            >
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors",
                        active
                          ? "bg-brand/10 font-semibold text-brand"
                          : "text-text/80 hover:bg-surface-2 hover:text-text",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.count !== undefined && (
                        <span className="text-[11px] tabular-nums text-muted">{item.count}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-5 py-3 text-[11px] text-muted">
        Architect Vault · v0.1
      </div>
    </div>
  );
}
