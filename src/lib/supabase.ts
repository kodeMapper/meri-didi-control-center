
import { supabase } from "@/integrations/supabase/client";
import type { 
  Worker, 
  Booking,
  Notification,
  WorkerStatus,
  NotificationType,
  UserType
} from "@/types";
import { v4 as uuidv4 } from "uuid";

/**
 * Worker Applications Management
 */

// Function to get worker applications by status
export async function getWorkerApplications(status?: WorkerStatus) {
  try {
    let query = supabase
      .from("worker_applications")
      .select("*");
    
    if (status) {
      query = query.eq("status", status);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching worker applications:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getWorkerApplications:", error);
    return [];
  }
}

// Added function to get workers from applications with a specific status
export async function getWorkersFromApplications(status?: WorkerStatus) {
  try {
    const applications = await getWorkerApplications(status);
    return applications.map(app => mapWorkerApplicationToWorker(app));
  } catch (error) {
    console.error("Error in getWorkersFromApplications:", error);
    return [];
  }
}

// Function to map worker application data to Worker type
export function mapWorkerApplicationToWorker(application: any): Worker {
  return {
    id: application.id || "",
    fullName: application.full_name || "",
    email: application.email || "",
    phone: application.phone || "",
    address: application.address || "",
    city: application.city || "Mumbai",
    gender: application.gender || "Male",
    dateOfBirth: application.date_of_birth || "",
    serviceType: application.service_type || "Cleaning",
    experience: application.experience || 0,
    availability: application.availability || "Full-Time",
    idType: application.id_type || "Aadhar Card",
    idNumber: application.id_number || "",
    about: application.about || "",
    skills: application.skills || [],
    status: application.status || "Pending",
    rating: application.rating || 0,
    totalBookings: application.total_bookings || 0,
    completionRate: application.completion_rate || 0,
    joiningDate: application.joining_date || "",
    createdAt: application.created_at || new Date().toISOString(),
    updatedAt: application.updated_at || new Date().toISOString(),
    idProofUrl: application.id_proof_url || null,
    photoUrl: application.photo_url || null,
  };
}

// Update worker application status
export async function updateWorkerApplicationStatus(id: string, status: WorkerStatus): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("worker_applications")
      .update({ status })
      .eq("id", id);
    
    if (error) {
      console.error("Error updating worker application status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateWorkerApplicationStatus:", error);
    return false;
  }
}

// Delete worker application
export async function deleteWorkerApplication(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("worker_applications")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting worker application:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteWorkerApplication:", error);
    return false;
  }
}

/**
 * Bookings Management
 */

// Get recent bookings
export async function getRecentBookings(limit: number = 5): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching recent bookings:", error);
      return [];
    }
    
    return data.map((booking: any) => ({
      id: booking.id,
      customerId: booking.customer_id || "",
      customerName: booking.customer_name || "Unknown",
      customerEmail: booking.customer_email || "",
      customerPhone: booking.customer_phone || "",
      customerAddress: booking.customer_address || "",
      workerId: booking.worker_id || "",
      workerName: booking.worker_name || "Unassigned",
      serviceType: booking.service_type || "Cleaning",
      serviceName: booking.service_name || "",
      serviceDuration: booking.service_duration || 1,
      serviceDate: booking.service_date || "",
      serviceTime: booking.service_time || "",
      amount: booking.amount || 0,
      status: booking.status || "Pending",
      notes: booking.notes || "",
      feedback: booking.feedback || "",
      rating: booking.rating || 0,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      deletionReason: booking.deletion_reason || ""
    }));
  } catch (error) {
    console.error("Error in getRecentBookings:", error);
    return [];
  }
}

// Get completed bookings
export async function getCompletedBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "Completed")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching completed bookings:", error);
      return [];
    }
    
    return data.map((booking: any) => ({
      id: booking.id,
      customerId: booking.customer_id || "",
      customerName: booking.customer_name || "Unknown",
      customerEmail: booking.customer_email || "",
      customerPhone: booking.customer_phone || "",
      customerAddress: booking.customer_address || "",
      workerId: booking.worker_id || "",
      workerName: booking.worker_name || "Unassigned",
      serviceType: booking.service_type || "Cleaning",
      serviceName: booking.service_name || "",
      serviceDuration: booking.service_duration || 1,
      serviceDate: booking.service_date || "",
      serviceTime: booking.service_time || "",
      amount: booking.amount || 0,
      status: booking.status || "Completed",
      notes: booking.notes || "",
      feedback: booking.feedback || "",
      rating: booking.rating || 0,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      deletionReason: booking.deletion_reason || ""
    }));
  } catch (error) {
    console.error("Error in getCompletedBookings:", error);
    return [];
  }
}

// Delete booking
export async function deleteBooking(id: string, reason: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ 
        status: "Cancelled", 
        deletion_reason: reason 
      })
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting booking:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    return false;
  }
}

/**
 * Notification Management
 */

// Add notification
export async function addNotification(notification: {
  type: NotificationType;
  message: string;
  title?: string;
  read: boolean;
  user_type?: UserType;
  user_identifier?: string;
  recipients?: string;
}): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        type: notification.type,
        message: notification.message,
        title: notification.title || null,
        read: notification.read || false,
        user_type: notification.user_type || null,
        user_identifier: notification.user_identifier || null,
        recipients: notification.recipients || null,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error("Error adding notification:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in addNotification:", error);
    return false;
  }
}

// Get all notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
    
    return data.map((notification: any) => ({
      id: notification.id,
      type: notification.type,
      message: notification.message,
      title: notification.title || "",
      read: notification.read,
      createdAt: notification.created_at,
      userType: notification.user_type,
      userIdentifier: notification.user_identifier
    }));
  } catch (error) {
    console.error("Error in getNotifications:", error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    
    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return false;
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("read", false);
    
    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error);
    return false;
  }
}

// Get unread notifications count
export async function getUnreadNotificationsCount(): Promise<number> {
  try {
    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("read", false);
    
    if (error) {
      console.error("Error getting unread notifications count:", error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getUnreadNotificationsCount:", error);
    return 0;
  }
}

// Mock implementations for PromoCodes
export const getPromoCodes = async () => {
  return [
    {
      id: "1",
      code: "WELCOME2025",
      discount: 20,
      expires_at: new Date().toISOString(),
      description: "Welcome discount for new users",
      usage_limit: 100,
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      code: "SUMMER25",
      discount: 25,
      expires_at: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
      description: "Summer special discount",
      usage_limit: 200,
      created_at: new Date().toISOString()
    }
  ];
};

export const addPromoCode = async (data: any) => {
  console.log("Adding promo code", data);
  return { id: Math.random().toString(), ...data };
};

export const updatePromoCode = async (id: string, data: any) => {
  console.log(`Updating promo code ${id}`, data);
  return { id, ...data };
};

export const deletePromoCode = async (id: string) => {
  console.log(`Deleting promo code ${id}`);
  return true;
};

// Export the supabase client directly so it can be used elsewhere
export { supabase };
