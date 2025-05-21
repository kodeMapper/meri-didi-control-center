import { useState, useEffect } from "react";
import { Booking, BookingStatus } from "@/types";
import { BookingCard } from "./BookingCard";
import { BookingFilters, BookingFilters as BookingFiltersType } from "./BookingFilters";
import { BookingDetails } from "@/components/dashboard/BookingDetails";
import { LocationMapDialog } from "./LocationMapDialog";
import { supabase } from "@/lib/supabase";

interface BookingListProps {
  status: BookingStatus | BookingStatus[];
  title: string;
  serviceType?: string;
  paymentMode?: string;
  location?: string;
  searchQuery?: string;
  dateRange?: { from: string; to: string };
}

export function BookingList({ status, title, serviceType, paymentMode, location, searchQuery, dateRange }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLocationMapOpen, setIsLocationMapOpen] = useState(false);
  const [filters, setFilters] = useState<BookingFiltersType>({
    search: "",
    serviceType: "",
    city: "",
    dateFrom: undefined,
    dateTo: undefined
  });

  useEffect(() => {
    fetchBookings();
  }, [status]);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("bookings").select("*");
      
      // Handle both single status and array of statuses
      if (Array.isArray(status)) {
        query = query.in("status", status);
      } else {
        query = query.eq("status", status);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
      } else if (data) {
        const formattedBookings = data.map((booking: any) => ({
          id: booking.id,
          customerId: booking.customer_id || "",
          customerName: booking.customer_name || "Unknown",
          customerEmail: booking.customer_email || "",
          customerPhone: booking.customer_phone || "",
          customerAddress: booking.customer_address || "",
          workerId: booking.worker_id || "",
          workerName: booking.worker_name || "Unassigned",
          serviceType: booking.service_type || "Cleaning",
          serviceName: booking.service_name || "",
          serviceDuration: booking.service_duration || 1,
          serviceDate: booking.service_date || "",
          serviceTime: booking.service_time || "",
          amount: booking.amount || 0,
          status: booking.status || "Pending",
          notes: booking.notes || "",
          feedback: booking.feedback || "",
          rating: booking.rating || 0,
          createdAt: booking.created_at,
          updatedAt: booking.updated_at,
          deletionReason: booking.deletion_reason || ""
        }));
        
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error("Error in fetchBookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...bookings];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(booking => 
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.workerName.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.customerEmail.toLowerCase().includes(searchLower) ||
        booking.serviceName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply service type filter
    if (filters.serviceType) {
      result = result.filter(booking => 
        booking.serviceType === filters.serviceType
      );
    }
    
    // Apply city filter - assuming city might be in the customer address
    if (filters.city) {
      result = result.filter(booking => 
        booking.customerAddress.includes(filters.city)
      );
    }
    
    // Apply date from filter
    if (filters.dateFrom) {
      result = result.filter(booking => {
        if (!booking.serviceDate) return false;
        const bookingDate = new Date(booking.serviceDate);
        return bookingDate >= filters.dateFrom!;
      });
    }
    
    // Apply date to filter
    if (filters.dateTo) {
      result = result.filter(booking => {
        if (!booking.serviceDate) return false;
        const bookingDate = new Date(booking.serviceDate);
        return bookingDate <= filters.dateTo!;
      });
    }
    
    setFilteredBookings(result);
  };

  const handleFilterChange = (newFilters: BookingFiltersType) => {
    setFilters(newFilters);
  };
  
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleViewLocation = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsLocationMapOpen(true);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <BookingFilters onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-36 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-lg text-gray-500 mb-2">No bookings found</div>
          <div className="text-sm text-gray-400">
            {filters.search || filters.serviceType || filters.city || filters.dateFrom || filters.dateTo ? 
              "Try adjusting your filters to see more results" : 
              "There are no bookings in this category yet"}
          </div>
        </div>
      ) : (
        <div>
          <div className="text-sm text-gray-500 mb-4">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
          {filteredBookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onViewDetails={handleViewDetails} 
              onDeleted={fetchBookings}
            />
          ))}
        </div>
      )}
      
      <BookingDetails
        booking={selectedBooking}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
      
      {selectedBooking && (
        <LocationMapDialog
          open={isLocationMapOpen}
          onOpenChange={setIsLocationMapOpen}
          address={selectedBooking.customerAddress}
        />
      )}
    </div>
  );
}
