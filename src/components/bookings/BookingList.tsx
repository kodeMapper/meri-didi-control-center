import { useState, useEffect } from "react";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Button } from "@/components/ui/button";
import { Booking, BookingFilters } from "@/types";
import { LocationMapDialog } from "@/components/bookings/LocationMapDialog";
import { BookingService } from "@/services/mockDatabase";
import { BookingDetails } from "@/components/bookings/BookingDetails";

interface BookingListProps {
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  title: string;
  dateRange?: { from: string; to: string };
  filters?: BookingFilters;
}

export function BookingList({ status, title, dateRange, filters }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLocationMapOpen, setIsLocationMapOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Get or mock bookings data with the given filters
    const fetchBookings = async () => {
      try {
        // If we can access the BookingService, use it
        if (typeof BookingService.getAll === 'function') {
          // Get all bookings and filter by status
          const allBookings = BookingService.getAll();
          const filteredBookings = allBookings.filter(booking => booking.status === status);
          
          // Apply date range filter if provided
          let result = filteredBookings;
          if (dateRange && dateRange.from && dateRange.to) {
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            
            result = result.filter(booking => {
              const bookingDate = new Date(booking.serviceDate);
              return bookingDate >= fromDate && bookingDate <= toDate;
            });
          }
          
          // Apply service type filter
          if (filters && filters.serviceType && filters.serviceType !== "all") {
            result = result.filter(booking => booking.serviceName === filters.serviceType);
          }
          
          // Apply payment mode filter
          if (filters && filters.paymentMode && filters.paymentMode !== "all") {
            result = result.filter(booking => booking.paymentMode === filters.paymentMode);
          }
          
          // Apply location filter - using customerAddress instead of location
          if (filters && filters.location && filters.location !== "all") {
            result = result.filter(booking => booking.customerAddress && 
              booking.customerAddress.toLowerCase().includes(filters.location.toLowerCase()));
          }
          
          // Apply search query
          if (filters && filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            result = result.filter(booking => 
              booking.customerName?.toLowerCase().includes(query) || 
              booking.workerName?.toLowerCase().includes(query) ||
              booking.serviceName?.toLowerCase().includes(query) ||
              booking.id.toLowerCase().includes(query)
            );
          }
          
          setBookings(result);
          setHasMore(false); // Mock pagination for now
        } else {
          // Fallback for mock data when BookingService is not fully implemented
          setBookings([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [status, dateRange, filters, page]);
  
  const handleLoadMore = () => {
    if (hasMore) {
      setPage(p => p + 1);
    }
  };
  
  const handleViewLocation = (address: string) => {
    setSelectedLocation(address);
    setIsLocationMapOpen(true);
  };
  
  const handleCloseLocationMap = () => {
    setIsLocationMapOpen(false);
  };
  
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };
  
  const handleBookingDeleted = () => {
    // Refresh the bookings list
    setPage(1);
  };
  
  if (loading && page === 1) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-500">Loading bookings...</p>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="bg-gray-100 p-4 rounded-full">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 font-medium text-lg">No {title} Bookings</h3>
        <p className="text-gray-500 text-sm mt-1">
          There are no bookings matching your criteria.
        </p>
        {filters && (Object.values(filters).some(f => f !== "" && f !== "all" && f !== undefined)) && (
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onViewDetails={() => handleViewDetails(booking)}
            onDeleted={handleBookingDeleted}
            onViewLocation={() => handleViewLocation(booking.customerAddress || "")}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-200 rounded-full border-t-gray-600"></div>
                Loading...
              </>
            ) : "Load More"}
          </Button>
        </div>
      )}
      
      {selectedLocation && (
        <LocationMapDialog
          open={isLocationMapOpen}
          onClose={handleCloseLocationMap}
          address={selectedLocation}
        />
      )}
      
      {selectedBooking && (
        <BookingDetails
          booking={selectedBooking}
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
}

// Adding the missing Calendar icon
const Calendar = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
