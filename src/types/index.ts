
export type ServiceType = 
  | "Cleaning"
  | "Cooking"
  | "Driving"
  | "Sweeping"
  | "Landscaping"
  | "Unknown";

export type IDType = 
  | "Aadhar Card"
  | "PAN Card"
  | "Driving License"
  | "Voter ID"
  | "Passport"
  | "Unknown";

export type Availability = 
  | "Full-Time"
  | "Part-Time"
  | "Weekends Only"
  | "Weekdays Only"
  | "Custom"
  | "Unknown";

export type Gender = "Male" | "Female" | "Other" | "Unknown";

export type City = 
  | "Mumbai"
  | "Delhi"
  | "Bangalore"
  | "Hyderabad"
  | "Chennai"
  | "Kolkata"
  | "Pune"
  | "Ahmedabad"
  | "Unknown";

export type Status = "Pending" | "Approved" | "Rejected" | "Active" | "Inactive";

export type WorkerStatus = "Active" | "Inactive" | "Pending" | "Rejected";

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

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
  rating: number;
  totalBookings: number;
  completionRate: number;
  joiningDate: string;
  idProofUrl?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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

export interface Notification {
  id: string;
  type: "Worker Verified" | "New Booking" | "Booking Completed" | "New Worker Application" | "Payment Received" | "Other";
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Stats {
  totalWorkers: number;
  activeWorkers: number;
  pendingApprovals: number;
  bookingsThisWeek: number;
  workersByCategory: {
    category: ServiceType;
    count: number;
    percentage: number;
  }[];
  growthRates: {
    workers: number;
    activeWorkers: number;
    pendingApprovals: number;
    bookings: number;
  };
}
