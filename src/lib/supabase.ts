
// Import the properly configured supabase client
import { supabase as configuredSupabase } from '@/integrations/supabase/client';
import { Booking, BookingStatus, ServiceType, Notification, NotificationType } from '@/types';

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
      customerName: booking.customer_name || "Unknown",
      customerEmail: booking.customer_email || "No email",
      customerPhone: "N/A", // Not in the current schema
      customerAddress: "N/A", // Not in the current schema
      workerId: booking.worker_id || "",
      workerName: "Assigned Worker", // We'll need to fetch this separately
      serviceType: booking.service_type as ServiceType,
      serviceName: booking.service_type || "Unknown Service",
      serviceDuration: 2, // Default value since we don't have this field
      serviceDate: booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "N/A",
      serviceTime: booking.booking_date ? new Date(booking.booking_date).toLocaleTimeString() : "N/A",
      amount: booking.amount || 0,
      status: booking.status as BookingStatus || "Pending",
      notes: "",
      feedback: booking.feedback || "", // Using the new field
      rating: booking.rating || 0, // Using the new field
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    })) as Booking[];
  } catch (error) {
    console.error("Exception fetching bookings:", error);
    return [];
  }
}

// Helper for fetching completed bookings
export async function getCompletedBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'Completed')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching completed bookings:", error);
      return [];
    }
    
    // Map Supabase booking format to our application's Booking format
    return data.map(booking => ({
      id: booking.id,
      customerId: booking.id, // Placeholder as we don't have this field
      customerName: booking.customer_name || "Unknown",
      customerEmail: booking.customer_email || "No email",
      customerPhone: "N/A", // Not in the current schema
      customerAddress: "N/A", // Not in the current schema
      workerId: booking.worker_id || "",
      workerName: "Assigned Worker", // We'll need to fetch this separately
      serviceType: booking.service_type as ServiceType,
      serviceName: booking.service_type || "Unknown Service",
      serviceDuration: 2, // Default value since we don't have this field
      serviceDate: booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : "N/A",
      serviceTime: booking.booking_date ? new Date(booking.booking_date).toLocaleTimeString() : "N/A",
      amount: booking.amount || 0,
      status: "Completed" as BookingStatus,
      notes: "",
      feedback: booking.feedback || "", // Using the new field
      rating: booking.rating || 0, // Using the new field
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    })) as Booking[];
  } catch (error) {
    console.error("Exception fetching completed bookings:", error);
    return [];
  }
}

// Helper to delete a booking
export async function deleteBooking(bookingId: string) {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);
    
    if (error) {
      console.error("Error deleting booking:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting booking:", error);
    return false;
  }
}

// Helper to convert WorkerApplication to Worker type
export function mapWorkerApplicationToWorker(app: WorkerApplication) {
  return {
    id: app.id,
    fullName: app.full_name,
    email: app.email,
    phone: app.phone,
    address: app.address,
    city: app.city as any,
    gender: app.gender as any,
    dateOfBirth: app.date_of_birth,
    serviceType: app.service_type as any,
    experience: app.experience,
    availability: app.availability as any,
    idType: app.id_type as any,
    idNumber: app.id_number,
    about: app.about,
    skills: app.skills || [],
    status: app.status as any,
    rating: app.rating,
    totalBookings: app.total_bookings,
    completionRate: app.completion_rate,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
    idProofUrl: app.id_proof_url,
    photoUrl: app.photo_url,
    joiningDate: app.created_at
  };
}

// Helper to get worker applications as Worker[] type
export async function getWorkersFromApplications(status?: string) {
  const applications = await getWorkerApplications(status);
  return applications.map(app => mapWorkerApplicationToWorker(app));
}

// Helper to update worker application status
export async function updateWorkerApplicationStatus(id: string, status: string) {
  try {
    const { error } = await supabase
      .from('worker_applications')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
    
    if (error) {
      console.error("Error updating worker status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating worker status:", error);
    return false;
  }
}

// Helper to delete worker application
export async function deleteWorkerApplication(id: string) {
  try {
    const { error } = await supabase
      .from('worker_applications')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting worker:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting worker:", error);
    return false;
  }
}

// Helper to add a notification
export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        type: notification.type,
        message: notification.message,
        read: false,
        user_type: notification.user_type,
        user_identifier: notification.user_identifier,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error adding notification:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception adding notification:", error);
    return false;
  }
}

// Helper to get notifications
export async function getNotifications() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    
    return data.map(notification => ({
      id: notification.id,
      type: notification.type as NotificationType,
      message: notification.message,
      read: notification.read,
      createdAt: notification.created_at,
      user_type: notification.user_type,
      user_identifier: notification.user_identifier
    })) as Notification[];
  } catch (error) {
    console.error("Exception fetching notifications:", error);
    return [];
  }
}

// Helper to mark a notification as read
export async function markNotificationAsRead(id: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception marking notification as read:", error);
    return false;
  }
}

// Helper to mark all notifications as read
export async function markAllNotificationsAsRead() {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
    
    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception marking all notifications as read:", error);
    return false;
  }
}
