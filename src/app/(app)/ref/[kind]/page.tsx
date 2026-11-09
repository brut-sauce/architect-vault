import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { REF_KINDS, isRefKind, listRefItems } from "@/lib/reference";
import { RefList } from "./ref-list";

export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  return { title: isRefKind(kind) ? REF_KINDS[kind].label : "Reference" };
}

export default async function RefKindPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!isRefKind(kind) || !REF_KINDS[kind].enabled) notFound();
  const meta = REF_KINDS[kind];

  const { items, error } = await listRefItems(kind);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.16em] text-rose-600 uppercase dark:text-rose-400">
            Reference
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{meta.label}</h1>
          <p className="mt-1.5 text-[14.5px] text-muted">{meta.blurb}</p>
        </div>
        <Link
          href={`/ref/${kind}/new`}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-[13.5px] font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> New {meta.singular}
        </Link>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-[13.5px] text-red-600">
          Could not load entries: {error}
          {error.includes("reference_items") && " Run supabase/migrations/0002_reference.sql in Supabase."}
        </p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
          <p className="font-semibold">No {meta.singular}s yet</p>
          <p className="mt-1 text-[13.5px] text-muted">
            Paste your first notes in Markdown and they will show up here.
          </p>
          <Link
            href={`/ref/${kind}/new`}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-[13.5px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Add the first one
          </Link>
        </div>
      ) : (
        <RefList kind={kind} items={items} />
      )}
    </div>
  );
}
