
import { Booking, BookingStatus, Customer, GalleryItem, Notification, NotificationType, PromoCode, ServicePlan, Stats, Worker, WorkerStatus } from '@/types';

class WorkerServiceClass {
  workers: Worker[] = [
    {
      id: "1",
      fullName: "Raj Sharma",
      email: "raj@example.com",
      phone: "9823456789",
      address: "123 Main St, Andheri East",
      city: "Mumbai",
      gender: "Male",
      dateOfBirth: "1990-05-15",
      serviceType: "Cleaning",
      experience: 5,
      availability: "Weekdays",
      idType: "Aadhar Card",
      idNumber: "1234-5678-9012",
      about: "Experienced in house cleaning services",
      skills: ["Deep Cleaning", "Furniture Cleaning", "Floor Polishing"],
      status: "Active",
      rating: 4.8,
      totalBookings: 32,
      completionRate: 98,
      joiningDate: "2023-10-15",
      createdAt: "2023-10-15T10:30:00Z",
      updatedAt: "2025-04-15T14:20:00Z",
      idProofUrl: "https://example.com/id-proofs/raj-sharma.jpg",
      photoUrl: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      id: "2",
      fullName: "Priya Patel",
      email: "priya@example.com",
      phone: "9876543210",
      address: "456 Park Avenue, Dadar West",
      city: "Mumbai",
      gender: "Female",
      dateOfBirth: "1992-08-23",
      serviceType: "Sweeping",
      experience: 3,
      availability: "Full-Time",
      idType: "PAN Card",
      idNumber: "ABCDE1234F",
      about: "Specializing in sweeping and house keeping",
      skills: ["Floor Sweeping", "Dust Removal", "Waste Management"],
      status: "Active",
      rating: 4.5,
      totalBookings: 28,
      completionRate: 96,
      joiningDate: "2024-01-10",
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2025-03-20T11:45:00Z",
      idProofUrl: "https://example.com/id-proofs/priya-patel.jpg",
      photoUrl: "https://randomuser.me/api/portraits/women/26.jpg"
    },
    {
      id: "3",
      fullName: "Amit Kumar",
      email: "amit@example.com",
      phone: "9865432107",
      address: "789 Business Square, Kurla",
      city: "Mumbai",
      gender: "Male",
      dateOfBirth: "1988-03-10",
      serviceType: "Cooking",
      experience: 7,
      availability: "Part-Time",
      idType: "Driving License",
      idNumber: "DL9876543210",
      about: "Professional cook with experience in various cuisines",
      skills: ["Indian Cuisine", "Chinese Food", "Continental"],
      status: "Pending",
      rating: 4.9,
      totalBookings: 45,
      completionRate: 99,
      joiningDate: "2023-05-05",
      createdAt: "2023-05-05T14:10:00Z",
      updatedAt: "2025-02-18T16:30:00Z",
      idProofUrl: "https://example.com/id-proofs/amit-kumar.jpg",
      photoUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: "4",
      fullName: "Anjali Singh",
      email: "anjali@example.com",
      phone: "9834567812",
      address: "101 Heights, Bandra West",
      city: "Mumbai",
      gender: "Female",
      dateOfBirth: "1994-11-27",
      serviceType: "Driving",
      experience: 4,
      availability: "Weekends Only",
      idType: "Passport",
      idNumber: "P1234567",
      about: "Professional driver with clean record",
      skills: ["Car Driving", "Highway Driving", "City Navigation"],
      status: "Active",
      rating: 4.7,
      totalBookings: 36,
      completionRate: 97,
      joiningDate: "2024-02-20",
      createdAt: "2024-02-20T08:45:00Z",
      updatedAt: "2025-04-01T12:15:00Z",
      idProofUrl: "https://example.com/id-proofs/anjali-singh.jpg",
      photoUrl: "https://randomuser.me/api/portraits/women/67.jpg"
    }
  ];

  getAll() {
    return this.workers;
  }

  getById(id: string) {
    return this.workers.find(worker => worker.id === id) || null;
  }

  getActive() {
    return this.workers.filter(worker => worker.status === "Active");
  }
  
  getPending() {
    return this.workers.filter(worker => worker.status === "Pending");
  }
  
  getRejected() {
    return this.workers.filter(worker => worker.status === "Rejected");
  }

  create(worker: Omit<Worker, 'id' | 'rating' | 'totalBookings' | 'completionRate' | 'joiningDate' | 'createdAt' | 'updatedAt'>) {
    const newWorker: Worker = {
      ...worker,
      id: crypto.randomUUID(),
      rating: 0,
      totalBookings: 0,
      completionRate: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.workers.push(newWorker);
    return newWorker;
  }

  update(id: string, updates: Partial<Worker>) {
    const workerIndex = this.workers.findIndex(worker => worker.id === id);
    if (workerIndex === -1) return null;
    
    this.workers[workerIndex] = {
      ...this.workers[workerIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.workers[workerIndex];
  }

  delete(id: string) {
    const index = this.workers.findIndex(worker => worker.id === id);
    if (index !== -1) {
      this.workers.splice(index, 1);
      return true;
    }
    return false;
  }
}

class BookingServiceClass {
  bookings: Booking[] = [
    {
      id: "1",
      customerId: "c1",
      customerName: "Rahul Mehta",
      customerEmail: "rahul@example.com",
      customerPhone: "9876543210",
      customerAddress: "22 Lake View, Powai, Mumbai",
      workerId: "1",
      workerName: "Raj Sharma",
      workerEmail: "raj@example.com",
      workerPhone: "9823456789",
      serviceType: "Cleaning",
      serviceName: "Deep House Cleaning",
      serviceDuration: 3,
      serviceDate: "2025-05-15",
      serviceTime: "10:00 AM",
      amount: 1200,
      status: "Completed",
      notes: "Please bring all required cleaning supplies",
      additionalNotes: "The customer has a pet dog",
      paymentMode: "Cash",
      paymentStatus: "Paid",
      cashPaymentConfirmedAt: "2025-05-15T13:45:00Z",
      cashPaymentConfirmedBy: "worker",
      feedback: "Great service, very thorough cleaning",
      rating: 5,
      createdAt: "2025-05-10T14:30:00Z",
      updatedAt: "2025-05-15T13:45:00Z",
      deletionReason: ""
    },
    {
      id: "2",
      customerId: "c2",
      customerName: "Neha Shah",
      customerEmail: "neha@example.com",
      customerPhone: "9876541230",
      customerAddress: "7B Green Avenue, Andheri West, Mumbai",
      workerId: "3",
      workerName: "Amit Kumar",
      workerEmail: "amit@example.com",
      workerPhone: "9865432107",
      serviceType: "Cooking",
      serviceName: "Party Catering",
      serviceDuration: 5,
      serviceDate: "2025-05-20",
      serviceTime: "03:00 PM",
      amount: 3500,
      status: "Confirmed",
      notes: "Party for 15 people",
      additionalNotes: "Vegetarian food only",
      paymentMode: "Online",
      paymentStatus: "Paid",
      feedback: "",
      rating: 0,
      createdAt: "2025-05-12T10:15:00Z",
      updatedAt: "2025-05-12T11:20:00Z",
      deletionReason: ""
    },
    {
      id: "3",
      customerId: "c3",
      customerName: "Vikram Singh",
      customerEmail: "vikram@example.com",
      customerPhone: "9845673210",
      customerAddress: "33 Business Park, Goregaon East, Mumbai",
      workerId: "1",
      workerName: "Raj Sharma",
      workerEmail: "raj@example.com",
      workerPhone: "9823456789",
      serviceType: "Cleaning",
      serviceName: "Office Cleaning",
      serviceDuration: 4,
      serviceDate: "2025-05-25",
      serviceTime: "08:00 AM",
      amount: 1800,
      status: "Pending",
      notes: "Focus on sanitizing all surfaces",
      additionalNotes: "",
      paymentMode: "Card",
      paymentStatus: "Pending",
      feedback: "",
      rating: 0,
      createdAt: "2025-05-18T09:30:00Z",
      updatedAt: "2025-05-18T09:30:00Z",
      deletionReason: ""
    }
  ];

  getAll() {
    return this.bookings;
  }

  getById(id: string) {
    return this.bookings.find(booking => booking.id === id) || null;
  }
  
  getRecent(limit = 5) {
    return this.bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
  
  getPending() {
    return this.bookings.filter(booking => booking.status === "Pending");
  }
  
  getCompleted() {
    return this.bookings.filter(booking => booking.status === "Completed");
  }

  create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
    const newBooking: Booking = {
      ...booking,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.bookings.push(newBooking);
    return newBooking;
  }

  update(id: string, updates: Partial<Booking>) {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return null;
    
    this.bookings[bookingIndex] = {
      ...this.bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.bookings[bookingIndex];
  }

  delete(id: string) {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
      this.bookings.splice(index, 1);
      return true;
    }
    return false;
  }
}

class NotificationServiceClass {
  notifications: Notification[] = [
    {
      id: "1",
      type: "New Worker Application",
      title: "New Worker Application Received",
      message: "A new worker application has been submitted by Vishal Patel for review.",
      read: false,
      createdAt: "2025-05-18T09:30:00Z",
      userType: "Admin",
      userIdentifier: "admin1"
    },
    {
      id: "2",
      type: "Worker Verified",
      title: "Worker Verification Complete",
      message: "Suresh Kumar's identity and documents have been successfully verified.",
      read: false,
      createdAt: "2025-05-17T14:30:00Z",
      userType: "Worker",
      userIdentifier: "worker123"
    },
    {
      id: "3",
      type: "New Booking",
      title: "New Booking Received",
      message: "Ajay Singh has booked a cleaning service for May 25, 2025.",
      read: false,
      createdAt: "2025-05-16T11:15:00Z",
      userType: "Worker",
      userIdentifier: "worker456"
    }
  ];

  getAll() {
    return this.notifications as Notification[];
  }
  
  getUnread() {
    return this.notifications.filter(notification => !notification.read) as Notification[];
  }
  
  getByUser(userType: string, userIdentifier: string) {
    return this.notifications.filter(
      notification => notification.userType === userType && notification.userIdentifier === userIdentifier
    ) as Notification[];
  }

  create(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    this.notifications.push(newNotification);
    return newNotification;
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    return true;
  }

  delete(id: string) {
    const index = this.notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      return true;
    }
    return false;
  }
}

class StatsServiceClass {
  getStats(): Stats {
    return {
      workers: 45,
      bookings: 128,
      earnings: 152000,
      activeWorkers: 32,
      totalWorkers: 45,
      growthRates: {
        workers: 15,
        bookings: 24,
        earnings: 18
      },
      pendingApprovals: 8,
      bookingsThisWeek: 38,
      workersByCategory: [
        { name: "Cleaning", value: 18, color: "#10B981" },
        { name: "Cooking", value: 12, color: "#F59E0B" },
        { name: "Driving", value: 8, color: "#3B82F6" },
        { name: "Sweeping", value: 7, color: "#EC4899" }
      ]
    };
  }
}

export const WorkerService = new WorkerServiceClass();
export const BookingService = new BookingServiceClass();
export const NotificationService = new NotificationServiceClass();
export const StatsService = new StatsServiceClass();
