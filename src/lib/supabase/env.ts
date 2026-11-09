export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until the Supabase env vars are set; the app then runs without auth. */
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
