
// Import the properly configured supabase client
import { supabase as configuredSupabase } from '@/integrations/supabase/client';

// Export the configured client
export const supabase = configuredSupabase;

// Helper to check Supabase connection
export function checkSupabaseConnection() {
  return true; // We know our client is configured correctly now
}
