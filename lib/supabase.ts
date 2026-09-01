import { createClient } from '@supabase/supabase-js';

// Public browser client. RLS protects all database access.
// The fallback values keep the app buildable before Vercel environment variables
// are configured; production deployments should set the NEXT_PUBLIC_* variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mgprlouwtoawlswvupjf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_PYMTglQNK7FVGRkYcJ_lGw_k8Eo0xiT';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
