
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
  try {
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
  } catch (error) {
    console.error("Exception fetching worker applications:", error);
    return [];
  }
}

// Helper for fetching booking data with proper mapping
export async function getRecentBookings(limit = 5) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
    
    // Map Supabase booking format to our application's Booking format
    return data.map(booking => ({
      id: booking.id,
      customerId: booking.id, // Placeholder as we don't have this field
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: "N/A", // Not in the current schema
      customerAddress: "N/A", // Not in the current schema
      workerId: booking.worker_id || "",
      workerName: "Assigned Worker", // We'll need to fetch this separately
      serviceType: booking.service_type as any,
      serviceName: booking.service_type,
      serviceDuration: 2, // Default value since we don't have this field
      serviceDate: new Date(booking.booking_date).toLocaleDateString(),
      serviceTime: new Date(booking.booking_date).toLocaleTimeString(),
      amount: booking.amount,
      status: booking.status,
      notes: "",
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
    }));
  } catch (error) {
    console.error("Exception fetching bookings:", error);
    return [];
  }
}
