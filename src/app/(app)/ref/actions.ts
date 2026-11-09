"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isRefKind, slugify } from "@/lib/reference-shared";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { error: string | null };

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  kind: z.string().refine(isRefKind, "Unknown section"),
  title: z.string().trim().min(1, "Give it a title").max(200),
  slug: z.string().trim().max(80).optional(),
  summary: z.string().trim().max(400),
  tags: z.string().max(400),
  body_md: z.string().max(200_000),
  sort_order: z.coerce.number().int().min(-9999).max(9999).default(0),
});

export async function saveRefItem(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const v = parsed.data;
  const slug = slugify(v.slug || v.title);
  if (!slug) return { error: "The title needs at least one letter or number." };

  const row = {
    kind: v.kind,
    slug,
    title: v.title,
    summary: v.summary,
    body_md: v.body_md,
    sort_order: v.sort_order,
    tags: Array.from(
      new Set(
        v.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      ),
    ).slice(0, 12),
  };

  const supabase = await createClient();
  const { error } = v.id
    ? await supabase.from("reference_items").update(row).eq("id", v.id)
    : await supabase.from("reference_items").insert(row);

  if (error) {
    if (error.code === "23505") return { error: `Another ${v.kind} entry already uses the link "${slug}".` };
    return { error: error.message };
  }

  revalidatePath(`/ref/${v.kind}`);
  redirect(`/ref/${v.kind}/${slug}`);
}

export async function deleteRefItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  if (!isRefKind(kind) || !z.string().uuid().safeParse(id).success) return;

  const supabase = await createClient();
  await supabase.from("reference_items").delete().eq("id", id);
  revalidatePath(`/ref/${kind}`);
  redirect(`/ref/${kind}`);
}
