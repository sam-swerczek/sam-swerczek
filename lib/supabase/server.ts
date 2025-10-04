import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for use in Server Components and Server Actions
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return createClient(supabaseUrl, supabaseServiceRoleKey);
}
