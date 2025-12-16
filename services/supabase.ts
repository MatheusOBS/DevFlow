import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://lcktcjalxdiliborsrko.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxja3RjamFseGRpbGlib3JzcmtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3NTE4MzMsImV4cCI6MjA4MTMyNzgzM30.01LyvmabDFceVv76O9ARkUmmoNOuCESMedbO_0zhxrA";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
