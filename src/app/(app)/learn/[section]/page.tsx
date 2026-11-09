import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { listModules } from "@/lib/content";
import { GROUPS, moduleSection } from "@/lib/sections";
import { ModuleList } from "./module-list";

type Params = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Params) {
  const { section } = await params;
  return { title: moduleSection("learn", section)?.label ?? "Learn" };
}

export default async function SectionPage({ params }: Params) {
  const { section: key } = await params;
  const section = moduleSection("learn", key);
  if (!section) notFound();

  const { items, error } = await listModules(section.key);
  const group = GROUPS.find((g) => g.key === section.group)!;
  const totalMin = items.reduce((n, m) => n + m.est_minutes, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={`text-[11px] font-bold tracking-[0.16em] uppercase ${group.tone}`}>{group.label}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{section.label}</h1>
          <p className="mt-1.5 text-[14.5px] text-muted">
            {section.blurb}
            {items.length > 0 && (
              <span className="ml-2 text-[13px]">
                · {items.length} {section.singular}
                {items.length === 1 ? "" : "s"}
                {totalMin > 0 && ` · ${(totalMin / 60).toFixed(1)}h`}
              </span>
            )}
          </p>
        </div>
        <Link
          href={`${section.href}/new`}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-[13.5px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> New {section.singular}
        </Link>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-[13.5px] text-red-600">
          Could not load {section.singular}s: {error}
          {error.includes("modules") && " Run supabase/migrations/0003_modules.sql in Supabase."}
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="font-semibold">No {section.singular}s yet</p>
          <p className="mt-1 text-[13.5px] text-muted">Paste your first notes in Markdown and they show up here.</p>
          <Link
            href={`${section.href}/new`}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-[13.5px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Add the first one
          </Link>
        </div>
      ) : (
        <ModuleList basePath={section.href} items={items} />
      )}
    </div>
  );
}
