import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { RefItem, RefKind } from "./reference-shared";

export * from "./reference-shared";

const COLUMNS = "id, kind, slug, title, summary, body_md, tags, sort_order, updated_at";

export async function listRefItems(
  kind: RefKind,
): Promise<{ items: RefItem[]; error: string | null }> {
  if (!supabaseConfigured) return { items: [], error: "Supabase is not configured." };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reference_items")
    .select(COLUMNS)
    .eq("kind", kind)
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  return { items: (data as RefItem[]) ?? [], error: error?.message ?? null };
}

export async function getRefItem(kind: RefKind, slug: string): Promise<RefItem | null> {
  if (!supabaseConfigured) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("reference_items")
    .select(COLUMNS)
    .eq("kind", kind)
    .eq("slug", slug)
    .maybeSingle();
  return (data as RefItem) ?? null;
}
