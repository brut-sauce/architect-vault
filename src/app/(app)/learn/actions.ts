"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { slugify } from "@/lib/content-shared";
import { sectionByKey } from "@/lib/sections";
import { createClient } from "@/lib/supabase/server";

export type SaveState = { error: string | null };

const schema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  section: z.string().refine((k) => sectionByKey(k)?.content === "modules", "Unknown section"),
  title: z.string().trim().min(1, "Give it a title").max(200),
  slug: z.string().trim().max(80).optional(),
  summary: z.string().trim().max(400),
  area: z.string().trim().max(80),
  tags: z.string().max(400),
  body_md: z.string().max(300_000),
  est_minutes: z.coerce.number().int().min(0).max(600).default(0),
  sort_order: z.coerce.number().int().min(-9999).max(9999).default(0),
});

export async function saveModule(_prev: SaveState, formData: FormData): Promise<SaveState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const v = parsed.data;
  const section = sectionByKey(v.section)!;
  const slug = slugify(v.slug || v.title);
  if (!slug) return { error: "The title needs at least one letter or number." };

  const row = {
    section: v.section,
    slug,
    title: v.title,
    summary: v.summary,
    area: v.area,
    body_md: v.body_md,
    est_minutes: v.est_minutes,
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
    ? await supabase.from("modules").update(row).eq("id", v.id)
    : await supabase.from("modules").insert(row);

  if (error) {
    if (error.code === "23505") return { error: `Another entry in this section already uses the link "${slug}".` };
    if (error.message.includes("modules")) return { error: `${error.message}. Run supabase/migrations/0003_modules.sql.` };
    return { error: error.message };
  }

  revalidatePath(section.href);
  redirect(`${section.href}/${slug}`);
}

export async function deleteModule(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const section = sectionByKey(String(formData.get("section") ?? ""));
  if (!section || !z.string().uuid().safeParse(id).success) return;

  const supabase = await createClient();
  await supabase.from("modules").delete().eq("id", id);
  revalidatePath(section.href);
  redirect(section.href);
}
