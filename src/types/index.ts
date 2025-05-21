

// Extend this file as needed with more type definitions

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  serviceName?: string;
  serviceDescription?: string;
  serviceDate?: string;
  serviceTime?: string;
  serviceDuration?: number;
  serviceType?: string;
  status: string;
  paymentMode?: string;
  paymentStatus?: string;
  amount?: number;
  workerName?: string;
  workerId?: string;
  workerEmail?: string;
  workerPhone?: string;
  customerId?: string;
  rating?: number;
  feedback?: string;
  additionalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface BookingFilters {
  dateRange: { from: string, to: string };
  serviceType: string;
  paymentMode: string;
  location: string;
  searchQuery: string;
}

export interface Worker {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  photoUrl?: string;
  rating?: number;
  totalBookings?: number;
  completionRate?: number;
  serviceType?: string;
  experience?: number;
  availability?: string;
  idType?: string;
  idNumber?: string;
  idProofUrl?: string;
  status: string;
  skills?: string[];
  about?: string;
  createdAt?: string;
  updatedAt?: string;
  gender?: string;
  dateOfBirth?: string;
  joiningDate?: string;
}

export interface WorkerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  photoUrl?: string;
  serviceType: string;
  experience: number;
  availability: string;
  idType: string;
  idNumber: string;
  idProofUrl?: string;
  status: string;
  about: string;
  gender: string;
  dateOfBirth: string;
  skills?: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  order: number;
  isActive: boolean;
  mediaType: "image" | "video";
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface Stats {
  totalWorkers: number;
  pendingApprovals: number;
  bookingsThisWeek: number;
  totalEarnings?: number;
  growthRates: {
    workers: number;
    bookings: number;
    earnings: number;
  };
  workersByCategory: CategoryStat[];
  bookingTrends?: {
    date: string;
    bookings: number;
  }[];
  activeWorkers?: number;
}

export type ServiceType = 'Cleaning' | 'Cooking' | 'Driving' | 'Sweeping' | 'Landscaping' | string;

export interface ServiceTypeObj {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  userType?: string;
  userIdentifier?: string;
}

export interface ServicePricing {
  id: string;
  serviceName: string;
  category: string;
  description?: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  totalBookings?: number;
  lastBookingDate?: string;
  createdAt: string;
  status: string;
}

export type City = 'Mumbai' | 'Delhi' | 'Bangalore' | 'Hyderabad' | 'Chennai' | 'Kolkata' | 'Pune' | 'Ahmedabad' | string;

export type PaymentMode = 'Cash' | 'Online' | 'Card' | 'UPI' | string;

export type WorkerStatus = 'Pending' | 'Active' | 'Inactive' | 'Rejected' | 'Verified';

export type NotificationType = 
  | 'New Worker Application'
  | 'Worker Verified' 
  | 'New Booking'
  | 'Booking Completed'
  | 'Payment Received'
  | 'System'
  | string;

export type UserType = 'Admin' | 'Worker' | 'Customer' | 'All';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export type ServiceCategory = 'Cleaning' | 'Cooking' | 'Driving' | 'Sweeping' | 'Landscaping' | string;

export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  description?: string;
  usageLimit: number;
  usageCount?: number;
  isActive: boolean;
  createdAt: string;
}

