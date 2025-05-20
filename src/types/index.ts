export type ServiceType = "Cleaning" | "Cooking" | "Driving" | "Sweeping" | "Landscaping";
export type WorkerStatus = "Pending" | "Active" | "Inactive" | "Rejected";
export type Gender = "Male" | "Female" | "Other";
export type City = "Mumbai" | "Delhi" | "Bangalore" | "Hyderabad" | "Chennai" | "Kolkata" | "Pune" | "Ahmedabad";
export type Availability = "Full-Time" | "Part-Time" | "Weekends Only" | "Weekdays Only" | "Custom";
export type IDType = "Aadhar Card" | "PAN Card" | "Driving License" | "Voter ID" | "Passport";
export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type NotificationType = "New Worker Application" | "Worker Verified" | "New Booking" | "Booking Completed" | "Payment Received" | "Booking Cancelled" | "General Announcement" | "Special Offer";
export type UserType = "admin" | "worker" | "customer";
export type ServiceCategory = "Cleaning" | "Cooking" | "Driving" | "Sweeping" | "Landscaping";

export interface Worker {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: City;
  gender: Gender;
  dateOfBirth: string;
  serviceType: ServiceType;
  experience: number;
  availability: Availability;
  idType: IDType;
  idNumber: string;
  about: string;
  skills: string[];
  status: WorkerStatus;
  rating?: number;
  totalBookings?: number;
  completionRate?: number;
  joiningDate?: string;
  createdAt: string;
  updatedAt: string;
  idProofUrl?: string | null;
  photoUrl?: string | null;
}

export interface ServicePricing {
  id: string;
  serviceName: string;
  category: ServiceType;
  description: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePlan {
  id: string;
  planName: string;
  description: string;
  category: ServiceCategory;
  frequency: string;
  persons: number;
  basePrice: number;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  workerId: string;
  workerName: string;
  serviceType: ServiceType;
  serviceName: string;
  serviceDuration: number;
  serviceDate: string;
  serviceTime: string;
  amount: number;
  status: BookingStatus;
  notes?: string;
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  deletionReason?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  read: boolean;
  createdAt: string;
  user_type?: UserType;
  user_identifier?: string; // Adding this field to match usage in code
  recipients?: string; // 'all', 'workers', 'customers', or specific IDs
}

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface Stats {
  totalWorkers: number;
  activeWorkers: number;
  pendingApprovals: number;
  bookingsThisWeek: number;
  workersByCategory: CategoryStat[];
  growthRates: {
    workers: number;
    activeWorkers: number;
    pendingApprovals: number;
    bookings: number;
  };
}
