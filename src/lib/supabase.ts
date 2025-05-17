
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to show error message when Supabase isn't properly configured
export function checkSupabaseConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials are missing. Please connect to Supabase through the Lovable integration.');
    return false;
  }
  return true;
}
