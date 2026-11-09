export type RefKind = "cheat" | "visual" | "vs" | "anti";

export type RefItem = {
  id: string;
  kind: RefKind;
  slug: string;
  title: string;
  summary: string;
  body_md: string;
  tags: string[];
  sort_order: number;
  updated_at: string;
};

export const REF_KINDS: Record<
  RefKind,
  { label: string; singular: string; blurb: string; enabled: boolean }
> = {
  cheat: {
    label: "Cheat Sheet",
    singular: "cheat sheet",
    blurb: "One-page summaries to revise from the night before.",
    enabled: true,
  },
  visual: {
    label: "Visual Library",
    singular: "diagram",
    blurb: "Diagrams of the building blocks and patterns.",
    enabled: false,
  },
  vs: {
    label: "X vs Y",
    singular: "comparison",
    blurb: "Side-by-side comparisons and when to pick which.",
    enabled: false,
  },
  anti: {
    label: "Anti-patterns",
    singular: "anti-pattern",
    blurb: "Designs that look fine and fail in the interview.",
    enabled: false,
  },
};

export function isRefKind(v: string): v is RefKind {
  return v in REF_KINDS;
}

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
