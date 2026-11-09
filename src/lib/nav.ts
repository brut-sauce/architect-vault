import {
  LayoutDashboard,
  CalendarCheck,
  Map,
  Network,
  Boxes,
  Code2,
  Layers,
  ListChecks,
  BarChart3,
  ScrollText,
  Shapes,
  GitCompare,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Count badge; filled from the database once sections exist. */
  count?: number;
};

export type NavGroup = {
  label: string;
  /** Tailwind text colour class for the group heading. */
  tone: string;
  items: NavItem[];
};

/**
 * Sidebar structure. Placeholder groups for the empty shell;
 * we will rename and extend these section by section.
 */
export const NAV: NavGroup[] = [
  {
    label: "Overview",
    tone: "text-violet-600 dark:text-violet-400",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "My Study Plan", href: "/plan", icon: CalendarCheck },
      { label: "Roadmap", href: "/roadmap", icon: Map },
    ],
  },
  {
    label: "Learn",
    tone: "text-sky-600 dark:text-sky-400",
    items: [
      { label: "System Design", href: "/learn/hld", icon: Network },
      { label: "LLD & Patterns", href: "/learn/lld", icon: Boxes },
      { label: "DSA Tracker", href: "/dsa", icon: Code2 },
    ],
  },
  {
    label: "Practice",
    tone: "text-amber-600 dark:text-amber-400",
    items: [
      { label: "Flashcards", href: "/cards", icon: Layers },
      { label: "Quiz", href: "/quiz", icon: ListChecks },
    ],
  },
  {
    label: "Reference",
    tone: "text-rose-600 dark:text-rose-400",
    items: [
      { label: "Cheat Sheet", href: "/ref/cheat", icon: ScrollText },
      { label: "Visual Library", href: "/ref/visual", icon: Shapes },
      { label: "X vs Y", href: "/ref/vs", icon: GitCompare },
      { label: "Anti-patterns", href: "/ref/anti", icon: TriangleAlert },
    ],
  },
  {
    label: "You",
    tone: "text-emerald-600 dark:text-emerald-400",
    items: [{ label: "Progress", href: "/progress", icon: BarChart3 }],
  },
];

/** Items shown in the mobile bottom bar. */
export const MOBILE_TABS: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Learn", href: "/learn/hld", icon: Network },
  { label: "DSA", href: "/dsa", icon: Code2 },
  { label: "Cards", href: "/cards", icon: Layers },
  { label: "You", href: "/progress", icon: BarChart3 },
];

export function titleFor(pathname: string): string {
  for (const g of NAV) {
    for (const i of g.items) {
      if (i.href === pathname) return i.label;
    }
  }
  for (const g of NAV) {
    for (const i of g.items) {
      if (i.href !== "/" && pathname.startsWith(i.href + "/")) return i.label;
    }
  }
  if (pathname.startsWith("/m/")) return "Module";
  if (pathname.startsWith("/learn/")) return "Learn";
  return "Architect Vault";
}
