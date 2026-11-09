/**
 * Every section of the app. `enabled: false` shows it greyed out in the
 * sidebar with a "soon" badge; flip it to true once the section is built.
 *
 * Sections with `content: "modules"` store their entries in the `modules`
 * table and share the same list / reader / editor pages.
 */
export type SectionGroup = "overview" | "learn" | "code" | "interview";

export type Section = {
  key: string;
  group: SectionGroup;
  label: string;
  href: string;
  blurb: string;
  enabled: boolean;
  content?: "modules";
  /** Word for one entry, e.g. "module". */
  singular?: string;
};

export const GROUPS: { key: SectionGroup; label: string; tone: string }[] = [
  { key: "overview", label: "Overview", tone: "text-violet-600 dark:text-violet-400" },
  { key: "learn", label: "Learn", tone: "text-sky-600 dark:text-sky-400" },
  { key: "code", label: "Code", tone: "text-emerald-600 dark:text-emerald-400" },
  { key: "interview", label: "Interview", tone: "text-amber-600 dark:text-amber-400" },
];

export const SECTIONS: Section[] = [
  // Overview
  { key: "dashboard", group: "overview", label: "Dashboard", href: "/", blurb: "", enabled: true },
  { key: "progress", group: "overview", label: "Progress", href: "/progress", blurb: "", enabled: false },
  { key: "bookmarks", group: "overview", label: "Bookmarks", href: "/bookmarks", blurb: "", enabled: false },

  // Learn
  {
    key: "sd-fundamentals",
    group: "learn",
    label: "System Design Fundamentals",
    href: "/learn/sd-fundamentals",
    blurb: "The building blocks every design is made of.",
    enabled: true,
    content: "modules",
    singular: "module",
  },
  {
    key: "interview-patterns",
    group: "learn",
    label: "Interview Patterns",
    href: "/learn/interview-patterns",
    blurb: "Reusable solutions that come up again and again.",
    enabled: false,
    content: "modules",
    singular: "pattern",
  },
  {
    key: "mc-fundamentals",
    group: "learn",
    label: "Machine Coding Fundamentals",
    href: "/learn/mc-fundamentals",
    blurb: "What a clean, extensible machine-coding solution needs.",
    enabled: false,
    content: "modules",
    singular: "module",
  },
  {
    key: "concurrency",
    group: "learn",
    label: "Concurrency",
    href: "/learn/concurrency",
    blurb: "Threads, locks and the bugs between them.",
    enabled: false,
    content: "modules",
    singular: "module",
  },

  // Code
  { key: "p0", group: "code", label: "P0 Sheet", href: "/code/p0", blurb: "", enabled: false },
  { key: "p1", group: "code", label: "P1 Sheet", href: "/code/p1", blurb: "", enabled: false },
  { key: "p2", group: "code", label: "P2 Sheet", href: "/code/p2", blurb: "", enabled: false },
  { key: "p3", group: "code", label: "P3 Sheet", href: "/code/p3", blurb: "", enabled: false },

  // Interview
  {
    key: "hld-cookbook",
    group: "interview",
    label: "HLD Cookbook",
    href: "/interview/hld-cookbook",
    blurb: "Recipes for the high-level design round.",
    enabled: false,
    content: "modules",
    singular: "recipe",
  },
  { key: "hld-problems", group: "interview", label: "HLD Problems", href: "/interview/hld-problems", blurb: "", enabled: false },
  {
    key: "lld-cookbook",
    group: "interview",
    label: "LLD Cookbook",
    href: "/interview/lld-cookbook",
    blurb: "Recipes for the low-level design round.",
    enabled: false,
    content: "modules",
    singular: "recipe",
  },
  { key: "lld-problems", group: "interview", label: "LLD Problems", href: "/interview/lld-problems", blurb: "", enabled: false },
];

export function sectionByKey(key: string): Section | undefined {
  return SECTIONS.find((s) => s.key === key);
}

/** A built section that stores modules and lives under the given group. */
export function moduleSection(group: SectionGroup, key: string): Section | undefined {
  const s = sectionByKey(key);
  return s && s.group === group && s.enabled && s.content === "modules" ? s : undefined;
}
