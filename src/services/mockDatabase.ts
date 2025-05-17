
import { Booking, Notification, ServicePricing, Worker, Stats, ServiceType } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Mock database storage
let workers: Worker[] = [];
let bookings: Booking[] = [];
let servicePricing: ServicePricing[] = [];
let notifications: Notification[] = [];

// Initial mock data for service pricing
servicePricing = [
  {
    id: uuidv4(),
    serviceName: "Basic Cleaning",
    category: "Cleaning",
    description: "Regular home cleaning service",
    duration: 2,
    price: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    serviceName: "Deep Cleaning",
    category: "Cleaning",
    description: "Thorough cleaning of entire home",
    duration: 4,
    price: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    serviceName: "Basic Cooking",
    category: "Cooking",
    description: "Simple meal preparation",
    duration: 2,
    price: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    serviceName: "Premium Cooking",
    category: "Cooking",
    description: "Gourmet meal preparation",
    duration: 4,
    price: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    serviceName: "Basic Sweeping",
    category: "Sweeping",
    description: "Regular sweeping service",
    duration: 1,
    price: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Add more sample workers for the demo
workers = [
  {
    id: uuidv4(),
    fullName: "John Smith",
    email: "john.s@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    city: "Mumbai",
    gender: "Male",
    dateOfBirth: "1990-01-15",
    serviceType: "Cleaning",
    experience: 5,
    availability: "Full-Time",
    idType: "Aadhar Card",
    idNumber: "1234-5678-9012",
    about: "Professional cleaner with 5 years of experience",
    skills: ["Deep cleaning", "Office cleaning", "Window cleaning"],
    status: "Active",
    rating: 4.5,
    totalBookings: 1,
    completionRate: 100,
    joiningDate: "2023-01-10",
    createdAt: "2023-01-05T10:30:00Z",
    updatedAt: "2023-01-10T14:20:00Z",
  },
  {
    id: uuidv4(),
    fullName: "Aisha Johnson",
    email: "aisha.j@example.com",
    phone: "+1234567891",
    address: "505 Cedar St",
    city: "Delhi",
    gender: "Female",
    dateOfBirth: "1992-05-20",
    serviceType: "Sweeping",
    experience: 3,
    availability: "Part-Time",
    idType: "PAN Card",
    idNumber: "ABCDE1234F",
    about: "Professional sweeper for residential and commercial properties",
    skills: ["Industrial sweeping", "Residential sweeping", "Equipment maintenance"],
    status: "Pending",
    rating: 0,
    totalBookings: 0,
    completionRate: 0,
    joiningDate: "2025-05-15",
    createdAt: "2025-05-10T09:15:00Z",
    updatedAt: "2025-05-10T09:15:00Z",
  },
  {
    id: uuidv4(),
    fullName: "Priya Sharma",
    email: "priya.s@example.com",
    phone: "+1234567892",
    address: "72 Park Avenue",
    city: "Bangalore",
    gender: "Female",
    dateOfBirth: "1988-08-12",
    serviceType: "Cooking",
    experience: 7,
    availability: "Full-Time",
    idType: "Aadhar Card",
    idNumber: "9876-5432-1098",
    about: "Experienced chef specializing in North Indian cuisine",
    skills: ["North Indian cooking", "South Indian cooking", "Baking"],
    status: "Active",
    rating: 4.8,
    totalBookings: 15,
    completionRate: 98,
    joiningDate: "2024-01-15",
    createdAt: "2024-01-10T08:20:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: uuidv4(),
    fullName: "Rahul Patel",
    email: "rahul.p@example.com",
    phone: "+1234567893",
    address: "45 Lake View",
    city: "Hyderabad",
    gender: "Male",
    dateOfBirth: "1995-03-25",
    serviceType: "Driving",
    experience: 4,
    availability: "Weekends Only",
    idType: "Driving License",
    idNumber: "DL98765432",
    about: "Professional driver with experience in both commercial and private transportation",
    skills: ["City driving", "Highway driving", "Defensive driving"],
    status: "Pending",
    rating: 0,
    totalBookings: 0,
    completionRate: 0,
    joiningDate: "2025-05-16",
    createdAt: "2025-05-14T14:45:00Z",
    updatedAt: "2025-05-14T14:45:00Z",
  }
];

// Add some sample bookings
bookings = [
  {
    id: uuidv4(),
    customerId: uuidv4(),
    customerName: "Alice Williams",
    customerEmail: "alice.w@example.com",
    customerPhone: "+1987654321",
    customerAddress: "123 First Ave, City",
    workerId: workers[0].id,
    workerName: workers[0].fullName,
    serviceType: "Cleaning",
    serviceName: "Basic Cleaning",
    serviceDuration: 2,
    serviceDate: "2025-05-08",
    serviceTime: "10:47",
    amount: 40.00,
    status: "Completed",
    createdAt: "2025-05-07T14:30:00Z",
    updatedAt: "2025-05-08T12:47:00Z",
  },
  {
    id: uuidv4(),
    customerId: uuidv4(),
    customerName: "Bob Johnson",
    customerEmail: "bob.j@example.com",
    customerPhone: "+1987654322",
    customerAddress: "456 Second Ave, City",
    workerId: workers[2].id,
    workerName: workers[2].fullName,
    serviceType: "Cooking",
    serviceName: "Basic Cooking",
    serviceDuration: 2,
    serviceDate: "2025-05-16",
    serviceTime: "05:13",
    amount: 50.00,
    status: "Completed",
    createdAt: "2025-05-15T10:30:00Z",
    updatedAt: "2025-05-16T07:15:00Z",
  },
  {
    id: uuidv4(),
    customerId: uuidv4(),
    customerName: "Daniel Brown",
    customerEmail: "daniel.b@example.com",
    customerPhone: "+1987654323",
    customerAddress: "789 Third Ave, City",
    workerId: workers[0].id,
    workerName: workers[0].fullName,
    serviceType: "Cleaning",
    serviceName: "Garden Maintenance",
    serviceDuration: 3,
    serviceDate: "2025-05-18",
    serviceTime: "05:13",
    amount: 80.00,
    status: "Confirmed",
    createdAt: "2025-05-17T09:20:00Z",
    updatedAt: "2025-05-17T10:15:00Z",
  }
];

// Add some sample notifications
notifications = [
  {
    id: uuidv4(),
    type: "New Worker Application",
    message: "Sarah Johnson has submitted a new worker application",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: uuidv4(),
    type: "Worker Verified",
    message: "Worker Aisha Johnson has been verified",
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: uuidv4(),
    type: "New Booking",
    message: "You have a new booking from Alice Williams",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: uuidv4(),
    type: "Booking Completed",
    message: "Booking #1 has been marked as completed",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: uuidv4(),
    type: "Payment Received",
    message: "Payment of $85 received for booking #3",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  }
];

// Mock statistics
const getStats = (): Stats => {
  const activeWorkers = workers.filter(worker => worker.status === "Active").length;
  const pendingWorkers = workers.filter(worker => worker.status === "Pending").length;
  const completedBookings = bookings.filter(booking => booking.status === "Completed").length;
  
  // Calculate workers by category - fixing the type here
  const workersByCategory: { category: ServiceType; count: number; percentage: number }[] = [
    { category: "Cleaning", count: 42, percentage: 42 },
    { category: "Cooking", count: 38, percentage: 38 },
    { category: "Sweeping", count: 27, percentage: 27 },
  ];

  return {
    totalWorkers: 152,
    activeWorkers: 127,
    pendingApprovals: 18,
    bookingsThisWeek: 236,
    workersByCategory,
    growthRates: {
      workers: 12,
      activeWorkers: 8,
      pendingApprovals: 4,
      bookings: 16,
    }
  };
};

// Worker Service
export const WorkerService = {
  getAll: () => [...workers],
  getById: (id: string) => workers.find(worker => worker.id === id) || null,
  getPending: () => workers.filter(worker => worker.status === "Pending"),
  getActive: () => workers.filter(worker => worker.status === "Active"),
  getByServiceType: (serviceType: ServiceType) => workers.filter(worker => worker.serviceType === serviceType),
  create: (worker: Omit<Worker, "id" | "createdAt" | "updatedAt" | "rating" | "totalBookings" | "completionRate" | "joiningDate">) => {
    const newWorker: Worker = {
      id: uuidv4(),
      ...worker,
      rating: 0,
      totalBookings: 0,
      completionRate: 0,
      joiningDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    workers.push(newWorker);
    
    // Create notification
    NotificationService.create({
      type: "New Worker Application",
      message: `New worker application received from ${newWorker.fullName}`,
      read: false,
    });
    
    return newWorker;
  },
  update: (id: string, updates: Partial<Worker>) => {
    const index = workers.findIndex(worker => worker.id === id);
    if (index !== -1) {
      workers[index] = {
        ...workers[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // If status changed to Active, create notification
      if (updates.status === "Active" && workers[index].status !== updates.status) {
        NotificationService.create({
          type: "Worker Verified",
          message: `Worker ${workers[index].fullName} has been activated`,
          read: false,
        });
      }

      return workers[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = workers.findIndex(worker => worker.id === id);
    if (index !== -1) {
      workers.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Booking Service
export const BookingService = {
  getAll: () => [...bookings],
  getById: (id: string) => bookings.find(booking => booking.id === id) || null,
  getRecent: (limit: number = 5) => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
  create: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => {
    const newBooking: Booking = {
      id: uuidv4(),
      ...booking,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    
    // Create notification
    NotificationService.create({
      type: "New Booking",
      message: `New booking received from ${newBooking.customerName}`,
      read: false,
    });
    
    return newBooking;
  },
  update: (id: string, updates: Partial<Booking>) => {
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      bookings[index] = {
        ...bookings[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // If status changed to Completed, create notification
      if (updates.status === "Completed" && bookings[index].status !== updates.status) {
        NotificationService.create({
          type: "Booking Completed",
          message: `Booking #${bookings[index].id.substring(0, 6)} has been completed`,
          read: false,
        });
      }

      return bookings[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      bookings.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Service Pricing Service
export const PricingService = {
  getAll: () => [...servicePricing],
  getById: (id: string) => servicePricing.find(service => service.id === id) || null,
  getByCategory: (category: string) => servicePricing.filter(service => service.category === category),
  create: (service: Omit<ServicePricing, "id" | "createdAt" | "updatedAt">) => {
    const newService: ServicePricing = {
      id: uuidv4(),
      ...service,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    servicePricing.push(newService);
    return newService;
  },
  update: (id: string, updates: Partial<ServicePricing>) => {
    const index = servicePricing.findIndex(service => service.id === id);
    if (index !== -1) {
      servicePricing[index] = {
        ...servicePricing[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return servicePricing[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = servicePricing.findIndex(service => service.id === id);
    if (index !== -1) {
      servicePricing.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Notification Service
export const NotificationService = {
  getAll: () => [...notifications].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ),
  getUnread: () => notifications.filter(notification => !notification.read),
  create: (notification: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      id: uuidv4(),
      ...notification,
      createdAt: new Date().toISOString()
    };
    notifications.push(newNotification);
    return newNotification;
  },
  markAsRead: (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  },
  markAllAsRead: () => {
    notifications.forEach(notification => {
      notification.read = true;
    });
    return true;
  }
};

// Stats Service
export const StatsService = {
  getStats: getStats
};

export const MockDatabase = {
  WorkerService,
  BookingService,
  PricingService,
  NotificationService,
  StatsService
};
