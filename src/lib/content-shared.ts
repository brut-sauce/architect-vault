/** Client-safe types and helpers for module content. */

export type Module = {
  id: string;
  section: string;
  slug: string;
  title: string;
  summary: string;
  area: string;
  body_md: string;
  tags: string[];
  est_minutes: number;
  sort_order: number;
  updated_at: string;
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Headings (## and ###) for the on-page contents list. */
export function headingsOf(md: string): { depth: 2 | 3; text: string; id: string }[] {
  const out: { depth: 2 | 3; text: string; id: string }[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      const text = m[2].replace(/[*_`]/g, "");
      out.push({ depth: m[1].length as 2 | 3, text, id: slugify(text) });
    }
  }
  return out;
}

/** Reading time from word count, at ~200 words a minute. */
export function readingMinutes(md: string): number {
  const words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
