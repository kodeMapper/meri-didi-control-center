export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export type UserType = "Worker" | "Customer" | "Admin";

export type WorkerStatus = "Pending" | "Active" | "Rejected" | "Inactive";

export type ServiceType = "Cleaning" | "Cooking" | "Driving" | "Sweeping" | "Landscaping";

export type ServiceCategory = "Cleaning" | "Cooking" | "Driving" | "Sweeping" | "Landscaping";

export type NotificationType = 
  | "General Announcement" 
  | "Special Offer" 
  | "New Booking" 
  | "Booking Completed" 
  | "Payment Received" 
  | "Worker Verified" 
  | "New Worker Application"
  | "Profile Activated"
  | "Profile Deactivated"
  | "Application Approved"
  | "Application Rejected"
  | "Booking Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type PaymentMode = "Cash" | "Online" | "Wallet" | "Card" | "UPI";

export interface Worker {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gender: string;
  dateOfBirth: string;
  serviceType: ServiceType;
  experience: number;
  availability: string;
  idType: string;
  idNumber: string;
  about: string;
  skills: string[];
  status: WorkerStatus;
  rating: number;
  totalBookings: number;
  completionRate: number;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
  idProofUrl: string | null;
  photoUrl: string | null;
  religion?: string; // Added religion field
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
  workerEmail?: string;
  workerPhone?: string;
  serviceType: ServiceType;
  serviceName: string;
  serviceDuration: number;
  serviceDate: string;
  serviceTime: string;
  amount: number;
  status: BookingStatus;
  notes?: string;
  additionalNotes?: string;
  paymentMode?: PaymentMode;
  paymentStatus?: PaymentStatus;
  cashPaymentConfirmedAt?: string;
  cashPaymentConfirmedBy?: string;
  feedback: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  deletionReason: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userType?: UserType;
  userIdentifier?: string;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export interface Stats {
  workers: number;
  bookings: number;
  earnings: number;
  activeWorkers?: number;
  totalWorkers?: number;
  growthRates?: {
    workers: number;
    bookings: number;
    earnings: number;
  };
  pendingApprovals?: number;
  bookingsThisWeek?: number;
  workersByCategory?: CategoryStat[];
}

export type City = string;

export const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", 
  "Chennai", "Kolkata", "Pune", "Ahmedabad"
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: City;
  totalBookings: number;
  lastBookingDate: string;
  createdAt: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
  description?: string;
}

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

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  category: "customer" | "worker" | "Customer Testimonial" | "Worker Testimonial" | "Service Showcase";
  createdAt: string;
  featured: boolean;
}

export interface BookingFilters {
  dateRange: { from: string; to: string };
  serviceType: string;
  paymentMode: string;
  location: string;
  searchQuery: string;
}

