"use client";

import Link from "next/link";
import { KeyRound, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function initials(email: string | null) {
  if (!email) return "AV";
  const local = email.split("@")[0].replace(/[^a-zA-Z]+/g, " ").trim();
  const parts = local.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "V")).toUpperCase();
}

export function UserMenu({ email }: { email: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-[12px] font-bold text-white"
      >
        {initials(email)}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 rounded-xl border border-border bg-surface p-1.5 shadow-lg">
          <p className="truncate px-2.5 py-2 text-[12px] text-muted">
            {email ?? "Not signed in (Supabase not configured)"}
          </p>
          {email && (
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] hover:bg-surface-2"
            >
              <KeyRound className="h-4 w-4" /> Account & password
            </Link>
          )}
          {email && (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-surface-2"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
