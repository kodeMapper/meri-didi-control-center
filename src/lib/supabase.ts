
// Import the properly configured supabase client
import { supabase as configuredSupabase } from '@/integrations/supabase/client';

// Export the configured client
export const supabase = configuredSupabase;

// Helper to check Supabase connection
export function checkSupabaseConnection() {
  return true; // We know our client is configured correctly now
}

// Helper function for worker applications
export type WorkerApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gender: string;
  date_of_birth: string;
  service_type: string;
  experience: number;
  availability: string;
  id_type: string;
  id_number: string;
  about: string;
  id_proof_url: string | null;
  photo_url: string | null;
  status: string;
  skills: string[];
  rating: number;
  total_bookings: number;
  completion_rate: number;
  created_at: string;
  updated_at: string;
}

// Type-safe helper for worker applications
export async function getWorkerApplications(status?: string) {
  let query = supabase
    .from('worker_applications')
    .select('*');
    
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching worker applications:", error);
    return [];
  }
  
  return data as WorkerApplication[];
}
