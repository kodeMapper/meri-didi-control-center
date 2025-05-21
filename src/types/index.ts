
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
  | "Application Rejected";

export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type PaymentMode = "Cash" | "Online" | "Wallet";

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

export interface City {
  name: string;
  totalWorkers: number;
  activeWorkers: number;
}

export type City = "Mumbai" | "Delhi" | "Bangalore" | "Hyderabad" | "Chennai" | "Kolkata" | "Pune" | "Ahmedabad";

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
  category: "customer" | "worker";
  createdAt: string;
  featured: boolean;
}
