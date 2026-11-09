"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Clock, Search } from "lucide-react";
import type { Module } from "@/lib/content-shared";
import { cn } from "@/lib/utils";

export function ModuleList({ basePath, items }: { basePath: string; items: Module[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags))).sort(), [items]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const shown = items.filter(
      (i) =>
        (!tag || i.tags.includes(tag)) &&
        (!needle ||
          i.title.toLowerCase().includes(needle) ||
          i.summary.toLowerCase().includes(needle) ||
          i.body_md.toLowerCase().includes(needle)),
    );
    // Keep areas in the order their first module appears (items arrive sorted).
    const map = new Map<string, Module[]>();
    for (const m of shown) {
      const key = m.area || "General";
      map.set(key, [...(map.get(key) ?? []), m]);
    }
    return Array.from(map.entries());
  }, [items, q, tag]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 text-muted sm:w-72">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles and notes…"
            className="w-full bg-transparent text-[13.5px] text-text outline-none placeholder:text-muted"
          />
        </label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <Chip active={tag === null} onClick={() => setTag(null)}>
              All
            </Chip>
            {tags.map((t) => (
              <Chip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                {t}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="py-8 text-center text-[13.5px] text-muted">Nothing matches that search.</p>
      ) : (
        groups.map(([area, mods]) => (
          <section key={area} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <header className="flex items-center justify-between border-b border-border bg-surface-2/60 px-5 py-3">
              <h2 className="font-display text-[15px] font-bold">{area}</h2>
              <span className="text-[12px] text-muted">{mods.length}</span>
            </header>
            <ol>
              {mods.map((m, i) => (
                <li key={m.id} className={cn(i > 0 && "border-t border-border")}>
                  <Link
                    href={`${basePath}/${m.slug}`}
                    className="group flex items-center gap-4 px-5 py-3.5 hover:bg-surface-2/60"
                  >
                    <span className="w-6 shrink-0 text-right font-mono text-[12px] text-muted">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{m.title}</span>
                      {m.summary && <span className="block truncate text-[13px] text-muted">{m.summary}</span>}
                    </span>
                    {m.est_minutes > 0 && (
                      <span className="hidden items-center gap-1 text-[12px] text-muted sm:flex">
                        <Clock className="h-3.5 w-3.5" /> {m.est_minutes} min
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full border px-3 text-[12.5px] transition-colors",
        active ? "border-brand bg-brand/10 font-semibold text-brand" : "border-border bg-surface text-muted hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
