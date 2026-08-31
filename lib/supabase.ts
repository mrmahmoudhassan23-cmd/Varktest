import { createClient } from '@supabase/supabase-js';

// This is the public Supabase client key. It is safe to expose in a browser app;
// database access is protected by Row Level Security policies.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://mgprlouwtoawlswvupjf.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_PYMTglQNK7FVGRkYcJ_lGw_k8Eo0xiT';

export const supabase = createClient(supabaseUrl, supabaseKey);
