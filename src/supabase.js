import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://meheuovwkrgnxqskdkqc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laGV1b3Z3a3Jnbnhxc2tka3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTMzNDIsImV4cCI6MjA5MjI4OTM0Mn0.-fCzSkE4El5lBoBV6tWuPNh4AyN22pjZIcPOIS4Kzx8";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,      // 🔥 ESSENCIAL
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});