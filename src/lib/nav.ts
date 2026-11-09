import {
  BarChart3,
  Bookmark,
  BookOpen,
  ClipboardList,
  Cpu,
  FileCode2,
  GitFork,
  LayoutDashboard,
  Network,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { GROUPS, SECTIONS } from "./sections";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
  count?: number;
};

export type NavGroup = { label: string; tone: string; items: NavItem[] };

const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  progress: BarChart3,
  bookmarks: Bookmark,
  "sd-fundamentals": Network,
  "interview-patterns": Puzzle,
  "mc-fundamentals": Cpu,
  concurrency: GitFork,
  p0: FileCode2,
  p1: FileCode2,
  p2: FileCode2,
  p3: FileCode2,
  "hld-cookbook": BookOpen,
  "hld-problems": ClipboardList,
  "lld-cookbook": BookOpen,
  "lld-problems": ClipboardList,
};

export const NAV: NavGroup[] = GROUPS.map((g) => ({
  label: g.label,
  tone: g.tone,
  items: SECTIONS.filter((s) => s.group === g.key).map((s) => ({
    label: s.label,
    href: s.href,
    icon: ICONS[s.key] ?? LayoutDashboard,
    soon: !s.enabled,
  })),
}));

/** Mobile bottom bar: Home plus the built sections (max 5). */
export const MOBILE_TABS: NavItem[] = SECTIONS.filter((s) => s.enabled)
  .slice(0, 5)
  .map((s) => ({
    label: s.key === "dashboard" ? "Home" : s.label.split(" ").slice(0, 2).join(" "),
    href: s.href,
    icon: ICONS[s.key] ?? LayoutDashboard,
  }));

export function titleFor(pathname: string): string {
  if (pathname === "/account") return "Account";
  const exact = SECTIONS.find((s) => s.href === pathname);
  if (exact) return exact.label;
  const prefix = SECTIONS.find((s) => s.href !== "/" && pathname.startsWith(s.href + "/"));
  return prefix?.label ?? "Architect Vault";
}
