import { LayoutDashboard, ScrollText, type LucideIcon } from "lucide-react";

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

/** Sidebar structure: only sections that are built. Add new ones here as they ship. */
export const NAV: NavGroup[] = [
  {
    label: "Overview",
    tone: "text-violet-600 dark:text-violet-400",
    items: [{ label: "Dashboard", href: "/", icon: LayoutDashboard }],
  },
  {
    label: "Reference",
    tone: "text-rose-600 dark:text-rose-400",
    items: [{ label: "Cheat Sheet", href: "/ref/cheat", icon: ScrollText }],
  },
];

/** Items shown in the mobile bottom bar. */
export const MOBILE_TABS: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Cheat Sheet", href: "/ref/cheat", icon: ScrollText },
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
  return "Architect Vault";
}
