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
export type PaymentMode = "Cash" | "Online" | "Card" | "UPI";
export type NotificationMethod = "Email" | "SMS" | "In-App" | "All";

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
  paymentMode?: PaymentMode;
  paymentStatus?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  read: boolean;
  createdAt: string;
  user_type?: UserType;
  user_identifier?: string;
  recipients?: string;
  method?: NotificationMethod;
  scheduled?: string;
  attachmentUrl?: string;
  notification_method?: string;
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

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: City;
  joiningDate: string;
  status: "Active" | "Inactive";
  totalBookings: number;
  subscriptionPlan: string;
  lastActivity: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  discountType: "Percentage" | "Fixed";
  maxDiscount?: number;
  minOrderValue?: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  description?: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  durationType: "Days" | "Months" | "Years";
  features: string[];
  isActive: boolean;
  subscribersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Slider {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  dateRange: { from: string, to: string };
  serviceType: string;
  paymentMode: string;
  location: string;
  searchQuery: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  order: number;
  isActive: boolean;
}
