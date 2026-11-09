import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { REF_KINDS, getRefItem, headingsOf, isRefKind } from "@/lib/reference";
import { PrintButton } from "./print-button";

type Params = { params: Promise<{ kind: string; slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { kind, slug } = await params;
  if (!isRefKind(kind)) return {};
  const item = await getRefItem(kind, slug);
  return { title: item?.title ?? REF_KINDS[kind].label };
}

export default async function RefItemPage({ params }: Params) {
  const { kind, slug } = await params;
  if (!isRefKind(kind) || !REF_KINDS[kind].enabled) notFound();
  const item = await getRefItem(kind, slug);
  if (!item) notFound();

  const toc = headingsOf(item.body_md);
  const updated = new Date(item.updated_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
      <article className="min-w-0">
        <div className="no-print mb-6 flex items-center justify-between gap-3">
          <Link
            href={`/ref/${kind}`}
            className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" /> {REF_KINDS[kind].label}
          </Link>
          <div className="flex gap-2">
            <PrintButton />
            <Link
              href={`/ref/${kind}/${item.slug}/edit`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[13px] hover:bg-surface-2"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
          </div>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight">{item.title}</h1>
        {item.summary && <p className="mt-2 text-[15px] text-muted">{item.summary}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
          {item.tags.map((t) => (
            <span key={t} className="rounded-md bg-surface-2 px-2 py-0.5">
              {t}
            </span>
          ))}
          <span className="ml-1">Updated {updated}</span>
        </div>

        <div className="mt-8">
          {item.body_md.trim() ? (
            <Markdown source={item.body_md} />
          ) : (
            <p className="text-muted">This sheet is empty. Click Edit to add your notes.</p>
          )}
        </div>
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
