import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
