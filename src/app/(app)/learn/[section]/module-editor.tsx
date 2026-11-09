"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Markdown } from "@/components/markdown";
import { slugify, type Module } from "@/lib/content-shared";
import { sectionByKey } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { deleteModule, saveModule, type SaveState } from "../actions";

const field = "w-full rounded-lg border border-border bg-bg px-3 text-[14px] outline-none focus:border-brand";

export function ModuleEditor({ sectionKey, item }: { sectionKey: string; item?: Module }) {
  const section = sectionByKey(sectionKey)!;
  const [state, action, pending] = useActionState<SaveState, FormData>(saveModule, { error: null });
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [body, setBody] = useState(item?.body_md ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[12px] text-muted">{section.label}</p>
          <h1 className="font-display text-2xl font-extrabold">
            {item ? `Edit ${section.singular}` : `New ${section.singular}`}
          </h1>
        </div>
        <Link href={item ? `${section.href}/${item.slug}` : section.href} className="text-[13px] text-muted hover:text-text">
          Cancel
        </Link>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <input type="hidden" name="section" value={section.key} />

        <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
          <Field label="Title">
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(field, "h-11")}
              placeholder="e.g. Caching"
            />
          </Field>
          <Field label="Link">
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={cn(field, "h-11 font-mono text-[13px]")}
              placeholder={slugify(title) || "auto from title"}
            />
          </Field>
        </div>

        <Field label="One-line summary">
          <input name="summary" defaultValue={item?.summary ?? ""} className={cn(field, "h-11")} placeholder="Shown in the list" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px_100px]">
          <Field label="Area" hint="groups modules in the list">
            <input name="area" defaultValue={item?.area ?? ""} className={cn(field, "h-11")} placeholder="e.g. Data & Storage" />
          </Field>
          <Field label="Tags" hint="comma separated">
            <input name="tags" defaultValue={item?.tags.join(", ") ?? ""} className={cn(field, "h-11")} placeholder="caching, redis" />
          </Field>
          <Field label="Minutes">
            <input name="est_minutes" type="number" min={0} max={600} defaultValue={item?.est_minutes ?? 0} className={cn(field, "h-11")} />
          </Field>
          <Field label="Order">
            <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={cn(field, "h-11")} />
          </Field>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold">
              Notes <span className="font-normal text-muted">(Markdown, ```mermaid for diagrams)</span>
            </span>
            <div className="flex rounded-lg border border-border bg-surface p-0.5 text-[12.5px] lg:hidden">
              {(["write", "preview"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn("rounded-md px-3 py-1 capitalize", tab === t ? "bg-brand/10 font-semibold text-brand" : "text-muted")}
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
              className={cn(field, "min-h-[65vh] resize-y py-3 font-mono text-[13px] leading-relaxed", tab === "preview" && "hidden lg:block")}
              placeholder={"## Why it matters\n\n…\n\n## How it works\n\n```mermaid\nflowchart LR\n  A --> B\n```"}
            />
            <div
              className={cn(
                "min-h-[65vh] overflow-auto rounded-lg border border-border bg-surface p-5",
                tab === "write" && "hidden lg:block",
              )}
            >
              {body.trim() ? <Markdown source={body} /> : <p className="text-[13.5px] text-muted">The preview appears here as you type.</p>}
            </div>
          </div>
        </div>

        {state.error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-[13px] text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-lg bg-brand px-6 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>

      {item && (
        <form
          action={deleteModule}
          onSubmit={(e) => {
            if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) e.preventDefault();
          }}
          className="border-t border-border pt-6"
        >
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="section" value={section.key} />
          <button type="submit" className="text-[13px] font-semibold text-red-600 hover:underline">
            Delete this {section.singular}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[13px] font-semibold">
        {label} {hint && <span className="font-normal text-muted">· {hint}</span>}
      </span>
      {children}
    </label>
  );
}
