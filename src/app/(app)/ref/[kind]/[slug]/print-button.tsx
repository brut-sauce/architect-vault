"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-[13px] hover:bg-surface-2"
    >
      <Printer className="h-3.5 w-3.5" /> Print
    </button>
  );
}
