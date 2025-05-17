
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use empty strings as fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client when credentials are missing
let supabaseClient;

// Check if credentials are available
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a mock client that doesn't throw errors but logs warnings
  supabaseClient = {
    from: () => ({
      select: () => ({ data: null, error: new Error('Supabase not configured') }),
      insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      update: () => ({ data: null, error: new Error('Supabase not configured') }),
      delete: () => ({ data: null, error: new Error('Supabase not configured') }),
      eq: () => ({ data: null, error: new Error('Supabase not configured') }),
      order: () => ({ data: null, error: new Error('Supabase not configured') }),
      limit: () => ({ data: null, error: new Error('Supabase not configured') }),
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
      }),
    },
    auth: {
      signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
  console.warn('Supabase credentials are missing. Using mock client instead. Please connect to Supabase through the Lovable integration.');
}

export const supabase = supabaseClient;

// Helper to check Supabase connection
export function checkSupabaseConnection() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Please connect to Supabase through the Lovable integration.');
    return false;
  }
  return true;
}
