import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
