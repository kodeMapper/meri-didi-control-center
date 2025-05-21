import { Worker, Booking, Notification, CategoryStat, ServiceType, Stats } from "@/types";

// For Worker objects, add idProofUrl and photoUrl
export const WorkerService = {
  workers: [
    {
      id: "1",
      fullName: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      address: "123 Main St, Mumbai",
      city: "Mumbai",
      gender: "Male",
      dateOfBirth: "1990-05-15",
      serviceType: "Cleaning" as ServiceType,
      experience: 5,
      availability: "Weekdays",
      idType: "Aadhar",
      idNumber: "1234-5678-9012",
      about: "Experienced cleaner with attention to detail.",
      skills: ["Deep Cleaning", "Window Cleaning", "Floor Polishing"],
      status: "Active",
      rating: 4.8,
      totalBookings: 45,
      completionRate: 98,
      joiningDate: "2024-01-15",
      createdAt: "2024-01-10T10:30:00Z",
      updatedAt: "2024-05-01T14:20:00Z",
      idProofUrl: "https://example.com/id/1.jpg",
      photoUrl: "https://example.com/photos/1.jpg"
    },
    {
      id: "2",
      fullName: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 56789",
      address: "456 Park Ave, Delhi",
      city: "Delhi",
      gender: "Female",
      dateOfBirth: "1992-11-20",
      serviceType: "Sweeping" as ServiceType,
      experience: 3,
      availability: "Weekends",
      idType: "Passport",
      idNumber: "P1234567",
      about: "Dedicated sweeper ensuring cleanliness.",
      skills: ["Floor Sweeping", "Dusting", "Garbage Disposal"],
      status: "Active",
      rating: 4.5,
      totalBookings: 30,
      completionRate: 95,
      joiningDate: "2024-02-20",
      createdAt: "2024-02-15T14:45:00Z",
      updatedAt: "2024-05-02T09:10:00Z",
      idProofUrl: "https://example.com/id/2.jpg",
      photoUrl: "https://example.com/photos/2.jpg"
    },
    {
      id: "3",
      fullName: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 76543 67890",
      address: "789 Cross Rd, Bangalore",
      city: "Bangalore",
      gender: "Male",
      dateOfBirth: "1988-08-05",
      serviceType: "Cooking" as ServiceType,
      experience: 7,
      availability: "Anytime",
      idType: "Driving License",
      idNumber: "DL1234567890",
      about: "Professional cook specializing in Indian cuisine.",
      skills: ["Indian", "Continental", "Baking"],
      status: "Active",
      rating: 4.9,
      totalBookings: 60,
      completionRate: 99,
      joiningDate: "2024-03-01",
      createdAt: "2024-02-25T18:00:00Z",
      updatedAt: "2024-05-03T11:30:00Z",
      idProofUrl: "https://example.com/id/3.jpg",
      photoUrl: "https://example.com/photos/3.jpg"
    },
    {
      id: "4",
      fullName: "Deepika Reddy",
      email: "deepika@example.com",
      phone: "+91 95432 78901",
      address: "101 MG Rd, Hyderabad",
      city: "Hyderabad",
      gender: "Female",
      dateOfBirth: "1993-04-10",
      serviceType: "Driving" as ServiceType,
      experience: 4,
      availability: "Weekdays",
      idType: "Aadhar",
      idNumber: "9876-5432-1098",
      about: "Reliable driver with excellent navigation skills.",
      skills: ["Car Driving", "Traffic Rules", "Navigation"],
      status: "Active",
      rating: 4.7,
      totalBookings: 35,
      completionRate: 96,
      joiningDate: "2024-03-15",
      createdAt: "2024-03-10T09:00:00Z",
      updatedAt: "2024-05-04T16:45:00Z",
      idProofUrl: "https://example.com/id/4.jpg",
      photoUrl: "https://example.com/photos/4.jpg"
    }
  ],
  getAll: () => {
    return WorkerService.workers;
  },
  getById: (id: string) => {
    return WorkerService.workers.find((worker) => worker.id === id);
  },
  create: (worker: Worker) => {
    WorkerService.workers.push(worker);
  },
  update: (id: string, updatedWorker: Worker) => {
    WorkerService.workers = WorkerService.workers.map((worker) =>
      worker.id === id ? updatedWorker : worker
    );
  },
  delete: (id: string) => {
    WorkerService.workers = WorkerService.workers.filter((worker) => worker.id !== id);
  },
};

// Update Booking objects to include feedback, rating, and deletionReason
export const BookingService = {
  bookings: [
    {
      id: "b001",
      customerId: "c001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1 234-567-8901",
      customerAddress: "456 Maple St, Mumbai",
      workerId: "1",
      workerName: "Rajesh Kumar",
      workerEmail: "rajesh@example.com",
      workerPhone: "+91 98765 43210",
      serviceType: "Cleaning" as ServiceType,
      serviceName: "Deep Cleaning",
      serviceDuration: 3,
      serviceDate: "2025-05-20",
      serviceTime: "10:00 AM",
      amount: 1200,
      status: "Confirmed",
      paymentMode: "Online",
      additionalNotes: "Please bring eco-friendly cleaning products",
      feedback: "",
      rating: 0,
      createdAt: "2025-05-15T09:30:00Z",
      updatedAt: "2025-05-15T09:30:00Z",
      deletionReason: ""
    },
    {
      id: "b002",
      customerId: "c002",
      customerName: "Alice Smith",
      customerEmail: "alice@example.com",
      customerPhone: "+1 345-678-9012",
      customerAddress: "789 Oak St, Delhi",
      workerId: "3",
      workerName: "Amit Patel",
      workerEmail: "amit@example.com",
      workerPhone: "+91 76543 67890",
      serviceType: "Cooking" as ServiceType,
      serviceName: "Indian Cuisine",
      serviceDuration: 2,
      serviceDate: "2025-05-22",
      serviceTime: "07:00 PM",
      amount: 1500,
      status: "Pending",
      paymentMode: "Cash",
      additionalNotes: "Please prepare vegetarian dishes only",
      feedback: "",
      rating: 0,
      createdAt: "2025-05-16T15:45:00Z",
      updatedAt: "2025-05-16T15:45:00Z",
      deletionReason: ""
    },
    {
      id: "b003",
      customerId: "c003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      customerPhone: "+1 456-789-0123",
      customerAddress: "123 Pine St, Bangalore",
      workerId: "1",
      workerName: "Rajesh Kumar",
      workerEmail: "rajesh@example.com",
      workerPhone: "+91 98765 43210",
      serviceType: "Cleaning" as ServiceType,
      serviceName: "Full House Cleaning",
      serviceDuration: 4,
      serviceDate: "2025-05-25",
      serviceTime: "09:00 AM",
      amount: 1800,
      status: "Completed",
      paymentMode: "Card",
      additionalNotes: "Please clean all windows and balconies",
      feedback: "Excellent service, very thorough cleaning",
      rating: 5,
      createdAt: "2025-05-17T12:00:00Z",
      updatedAt: "2025-05-25T17:00:00Z",
      deletionReason: ""
    }
  ],
  getAll: () => {
    return BookingService.bookings;
  },
  getById: (id: string) => {
    return BookingService.bookings.find((booking) => booking.id === id);
  },
  create: (booking: Booking) => {
    BookingService.bookings.push(booking);
  },
  update: (id: string, updatedBooking: Booking) => {
    BookingService.bookings = BookingService.bookings.map((booking) =>
      booking.id === id ? updatedBooking : booking
    );
  },
  delete: (id: string) => {
    BookingService.bookings = BookingService.bookings.filter((booking) => booking.id !== id);
  },
};

// Update Notification objects to include title
export const NotificationService = {
  notifications: [
    {
      id: "n001",
      type: "New Worker Application",
      title: "New Worker Application Received",
      message: "A new worker has applied for the Cleaning category",
      read: false,
      createdAt: "2025-05-20T08:30:00Z"
    },
    {
      id: "n002",
      type: "Worker Verified",
      title: "Worker Verified Successfully",
      message: "Rajesh Kumar has been verified for Cleaning services",
      read: false,
      createdAt: "2025-05-19T14:20:00Z"
    },
    {
      id: "n003",
      type: "New Booking",
      title: "New Booking Received",
      message: "John Doe has booked a Cleaning service for May 20th",
      read: false,
      createdAt: "2025-05-18T11:45:00Z"
    },
    {
      id: "n004",
      type: "Booking Completed",
      title: "Booking Completed",
      message: "Bob Johnson's cleaning service has been completed",
      read: false,
      createdAt: "2025-05-25T18:00:00Z"
    }
  ],
  getAll: () => {
    return NotificationService.notifications;
  },
  getById: (id: string) => {
    return NotificationService.notifications.find((notification) => notification.id === id);
  },
  create: (notification: Notification) => {
    NotificationService.notifications.push(notification);
  },
  update: (id: string, updatedNotification: Notification) => {
    NotificationService.notifications = NotificationService.notifications.map((notification) =>
      notification.id === id ? updatedNotification : notification
    );
  },
  delete: (id: string) => {
    NotificationService.notifications = NotificationService.notifications.filter(
      (notification) => notification.id !== id
    );
  },
  markAsRead: (id: string) => {
    NotificationService.notifications = NotificationService.notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
  },
  markAllAsRead: () => {
    NotificationService.notifications = NotificationService.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
  },
};

// Update the CategoryStats to match the required format
export const getWorkerCategoryStats = (): CategoryStat[] => {
  return [
    { name: "Cleaning", value: 35, color: "#4CAF50" },
    { name: "Cooking", value: 25, color: "#2196F3" },
    { name: "Driving", value: 20, color: "#FF9800" },
    { name: "Sweeping", value: 15, color: "#9C27B0" },
    { name: "Landscaping", value: 5, color: "#607D8B" }
  ];
};

export const getDashboardStats = (): Stats => {
  return {
    workers: 120,
    bookings: 450,
    earnings: 25000,
    activeWorkers: 85
  };
};
