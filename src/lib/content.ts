import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Module } from "./content-shared";

export * from "./content-shared";

const COLUMNS =
  "id, section, slug, title, summary, area, body_md, tags, est_minutes, sort_order, updated_at";

export async function listModules(
  section: string,
): Promise<{ items: Module[]; error: string | null }> {
  if (!supabaseConfigured) return { items: [], error: "Supabase is not configured." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(COLUMNS)
    .eq("section", section)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  return { items: (data as Module[]) ?? [], error: error?.message ?? null };
}

export async function getModule(section: string, slug: string): Promise<Module | null> {
  if (!supabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select(COLUMNS)
    .eq("section", section)
    .eq("slug", slug)
    .maybeSingle();
  return (data as Module) ?? null;
}

/** Neighbours in reading order, for prev / next links. */
export async function neighbours(
  section: string,
  slug: string,
): Promise<{ prev: Module | null; next: Module | null }> {
  const { items } = await listModules(section);
  const i = items.findIndex((m) => m.slug === slug);
  return {
    prev: i > 0 ? items[i - 1] : null,
    next: i >= 0 && i < items.length - 1 ? items[i + 1] : null,
  };
}
