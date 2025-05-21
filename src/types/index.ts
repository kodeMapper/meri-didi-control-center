
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
  gender?: string;
  dateOfBirth?: string;
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
  mediaType?: "image" | "video";
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
  totalEarnings: number;
  growthRates: {
    workers: number;
    bookings: number;
    earnings: number;
  };
  workersByCategory: CategoryStat[];
  bookingTrends: {
    date: string;
    bookings: number;
  }[];
}

export interface ServiceType {
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
