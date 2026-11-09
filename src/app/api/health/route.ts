import { NextResponse } from "next/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** Public check that the app can reach the database. */
export async function GET() {
  if (!supabaseConfigured) {
    return NextResponse.json({ ok: false, db: "not_configured" }, { status: 503 });
  }

  const started = Date.now();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("health");

  if (error) {
    return NextResponse.json({ ok: false, db: "error", detail: error.message }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    db: "connected",
    dbTime: data,
    latencyMs: Date.now() - started,
  });
}
