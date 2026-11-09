"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { RefItem, RefKind } from "@/lib/reference-shared";
import { cn } from "@/lib/utils";

export function RefList({ kind, items }: { kind: RefKind; items: RefItem[] }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.tags))).sort(),
    [items],
  );

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (!tag || i.tags.includes(tag)) &&
        (!needle ||
          i.title.toLowerCase().includes(needle) ||
          i.summary.toLowerCase().includes(needle) ||
          i.body_md.toLowerCase().includes(needle)),
    );
  }, [items, q, tag]);

  return (
    <div className="space-y-4">
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

      {shown.length === 0 ? (
        <p className="py-8 text-center text-[13.5px] text-muted">Nothing matches that search.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {shown.map((i) => (
            <li key={i.id}>
              <Link
                href={`/ref/${kind}/${i.slug}`}
                className="block h-full rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-sm"
              >
                <p className="font-display text-[16px] font-bold">{i.title}</p>
                {i.summary && <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">{i.summary}</p>}
                {i.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {i.tags.map((t) => (
                      <span key={t} className="rounded-md bg-surface-2 px-2 py-0.5 text-[11.5px] text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
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
        active
          ? "border-brand bg-brand/10 font-semibold text-brand"
          : "border-border bg-surface text-muted hover:text-text",
      )}
    >
      {children}
    </button>
  );
}
