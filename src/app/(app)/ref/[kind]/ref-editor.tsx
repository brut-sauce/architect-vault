"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Markdown } from "@/components/markdown";
import { REF_KINDS, slugify, type RefItem, type RefKind } from "@/lib/reference-shared";
import { cn } from "@/lib/utils";
import { deleteRefItem, saveRefItem, type SaveState } from "../actions";

const field =
  "w-full rounded-lg border border-border bg-bg px-3 text-[14px] outline-none focus:border-brand";

export function RefEditor({ kind, item }: { kind: RefKind; item?: RefItem }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(saveRefItem, { error: null });
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [body, setBody] = useState(item?.body_md ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const meta = REF_KINDS[kind];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold">
          {item ? `Edit ${meta.singular}` : `New ${meta.singular}`}
        </h1>
        <Link
          href={item ? `/ref/${kind}/${item.slug}` : `/ref/${kind}`}
          className="text-[13px] text-muted hover:text-text"
        >
          Cancel
        </Link>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <input type="hidden" name="kind" value={kind} />

        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
          <label className="block space-y-1.5">
            <span className="text-[13px] font-semibold">Title</span>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(field, "h-11")}
              placeholder="e.g. Caching strategies"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[13px] font-semibold">Link</span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={cn(field, "h-11 font-mono text-[13px]")}
              placeholder={slugify(title) || "auto from title"}
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-[13px] font-semibold">One-line summary</span>
          <input
            name="summary"
            defaultValue={item?.summary ?? ""}
            className={cn(field, "h-11")}
            placeholder="Shown on the card in the list"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <label className="block space-y-1.5">
            <span className="text-[13px] font-semibold">Tags</span>
            <input
              name="tags"
              defaultValue={item?.tags.join(", ") ?? ""}
              className={cn(field, "h-11")}
              placeholder="comma separated, e.g. storage, caching"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[13px] font-semibold">Order</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={item?.sort_order ?? 0}
              className={cn(field, "h-11")}
            />
          </label>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold">Notes (Markdown)</span>
            <div className="flex rounded-lg border border-border bg-surface p-0.5 text-[12.5px] lg:hidden">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-md px-3 py-1 capitalize",
                    tab === t ? "bg-brand/10 font-semibold text-brand" : "text-muted",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <textarea
              name="body_md"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              spellCheck={false}
              className={cn(
                field,
                "min-h-[60vh] resize-y py-3 font-mono text-[13px] leading-relaxed",
                tab === "preview" && "hidden lg:block",
              )}
              placeholder={"## Section\n\n- key point\n- another point\n\n| Option | When |\n| --- | --- |\n| A | … |"}
            />
            <div
              className={cn(
                "min-h-[60vh] overflow-auto rounded-lg border border-border bg-surface p-5",
                tab === "write" && "hidden lg:block",
              )}
            >
              {body.trim() ? (
                <Markdown source={body} />
              ) : (
                <p className="text-[13.5px] text-muted">The preview appears here as you type.</p>
              )}
            </div>
          </div>
        </div>

        {state.error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[13px] text-red-600">{state.error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-lg bg-brand px-6 text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>

      {item && (
        <form
          action={deleteRefItem}
          onSubmit={(e) => {
            if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) e.preventDefault();
          }}
          className="border-t border-border pt-6"
        >
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="kind" value={kind} />
          <button type="submit" className="text-[13px] font-semibold text-red-600 hover:underline">
            Delete this {meta.singular}
          </button>
        </form>
      )}
    </div>
  );
}
