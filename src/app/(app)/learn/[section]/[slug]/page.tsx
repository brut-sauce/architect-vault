import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Pencil } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { getModule, headingsOf, neighbours, readingMinutes } from "@/lib/content";
import { moduleSection } from "@/lib/sections";
import { PrintButton } from "./print-button";

type Params = { params: Promise<{ section: string; slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { section, slug } = await params;
  const s = moduleSection("learn", section);
  if (!s) return {};
  const m = await getModule(s.key, slug);
  return { title: m?.title ?? s.label };
}

export default async function ModulePage({ params }: Params) {
  const { section: key, slug } = await params;
  const section = moduleSection("learn", key);
  if (!section) notFound();
  const m = await getModule(section.key, slug);
  if (!m) notFound();

  const { prev, next } = await neighbours(section.key, slug);
  const toc = headingsOf(m.body_md);
  const minutes = m.est_minutes || readingMinutes(m.body_md);
  const updated = new Date(m.updated_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <article className="min-w-0">
        <div className="no-print mb-6 flex items-center justify-between gap-3">
          <Link href={section.href} className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-text">
            <ArrowLeft className="h-4 w-4" /> {section.label}
          </Link>
          <div className="flex gap-2">
            <PrintButton />
            <Link
              href={`${section.href}/${m.slug}/edit`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[13px] hover:bg-surface-2"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
          </div>
        </div>

        {m.area && <p className="text-[12px] font-bold tracking-[0.12em] text-sky-600 uppercase dark:text-sky-400">{m.area}</p>}
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight">{m.title}</h1>
        {m.summary && <p className="mt-2 text-[15px] text-muted">{m.summary}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {minutes} min
          </span>
          <span className="mx-1">·</span>
          {m.tags.map((t) => (
            <span key={t} className="rounded-md bg-surface-2 px-2 py-0.5">
              {t}
            </span>
          ))}
          <span className="ml-1">Updated {updated}</span>
        </div>

        <div className="mt-8">
          {m.body_md.trim() ? (
            <Markdown source={m.body_md} />
          ) : (
            <p className="text-muted">This {section.singular} is empty. Click Edit to add your notes.</p>
          )}
        </div>

        {(prev || next) && (
          <nav className="no-print mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
            {prev ? (
              <Link href={`${section.href}/${prev.slug}`} className="rounded-xl border border-border bg-surface p-4 hover:border-brand/40">
                <span className="flex items-center gap-1 text-[12px] text-muted">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous
                </span>
                <span className="mt-1 block font-semibold">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`${section.href}/${next.slug}`}
                className="rounded-xl border border-border bg-surface p-4 text-right hover:border-brand/40"
              >
                <span className="flex items-center justify-end gap-1 text-[12px] text-muted">
                  Next <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 block font-semibold">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>

      {toc.length > 1 && (
        <aside className="no-print hidden xl:block">
          <nav className="sticky top-20 space-y-1 text-[13px]">
            <p className="pb-1 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">On this page</p>
            {toc.map((h) => (
              <a
                key={h.id + h.text}
                href={`#${h.id}`}
                className={`block truncate text-muted hover:text-text ${h.depth === 3 ? "pl-3" : ""}`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </aside>
      )}
    </div>
  );
}
