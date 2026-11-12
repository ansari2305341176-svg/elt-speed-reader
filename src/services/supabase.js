import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidSupabaseUrl = (() => {
  if (!supabaseUrl) return false;

  try {
    const url = new URL(supabaseUrl);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname);
  } catch {
    return false;
  }
})();

export const supabase =
  hasValidSupabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;