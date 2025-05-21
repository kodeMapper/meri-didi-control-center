import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Booking, BookingStatus } from "@/types";
import { 
  Eye, 
  MapPin, 
  MoreHorizontal, 
  Phone, 
  Calendar, 
  Clock, 
  DollarSign,
  User,
  Briefcase
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { BookingService } from "@/services/mockDatabase";
import { LocationMapDialog } from "./LocationMapDialog";

export interface BookingListProps {
  status: BookingStatus;
  title: string;
  dateRange?: { from: string; to: string };
  filters?: {
    serviceType: string;
    paymentMode: string;
    location: string;
    searchQuery: string;
  };
}

export function BookingList({ status, title, dateRange, filters }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>(BookingService.getByStatus(status));
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  
  const openMap = (address: string) => {
    setSelectedAddress(address);
    setIsMapOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by service type
    if (filters?.serviceType && filters.serviceType !== "all" && booking.serviceType !== filters.serviceType) {
      return false;
    }
    
    // Filter by payment mode
    if (filters?.paymentMode && filters.paymentMode !== "all" && booking.paymentMode !== filters.paymentMode) {
      return false;
    }
    
    // Filter by location (simple substring match)
    if (filters?.location && filters.location !== "all" && !booking.customerAddress.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by search query (match against customer name, worker name, or service type)
    if (filters?.searchQuery && !booking.customerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !booking.workerName.toLowerCase().includes(filters.searchQuery.toLowerCase()) && 
        !booking.serviceType.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !booking.serviceName.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (dateRange?.from && dateRange.to) {
      const bookingDate = new Date(booking.serviceDate);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      
      if (bookingDate < fromDate || bookingDate > toDate) {
        return false;
      }
    }
    
    return true;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "Pending":
        return "border-yellow-500";
      case "Confirmed":
        return "border-blue-500";
      case "Completed":
        return "border-green-500";
      case "Cancelled":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  const handleViewBooking = (id: string) => {
    console.log(`View booking with ID: ${id}`);
  };

  const handleEditBooking = (id: string) => {
    console.log(`Edit booking with ID: ${id}`);
  };

  const handleCancelBooking = (id: string) => {
    console.log(`Cancel booking with ID: ${id}`);
  };

  const handleProcessRefund = (id: string) => {
    console.log(`Process refund for booking with ID: ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </span>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="p-8 text-center border rounded-lg bg-white">
          <p className="text-gray-500">No {status.toLowerCase()} bookings found matching your filters.</p>
          <Button variant="outline" className="mt-4">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className={`p-4 border-l-4 ${getStatusColor(booking.status)}`}>
                <div className="flex justify-between">
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    <Briefcase size={16} />
                    {booking.serviceName}
                  </h3>
                  <Badge variant={booking.status === "Cancelled" ? "destructive" : "outline"} className="font-normal">
                    {booking.status}
                  </Badge>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <User size={16} className="mt-1 text-gray-500" />
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone size={12} /> {booking.customerPhone}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Briefcase size={16} className="mt-1 text-gray-500" />
                    <div>
                      <div className="font-medium">Worker</div>
                      <div className="text-sm text-gray-600">{booking.workerName}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 cursor-pointer hover:text-blue-600" onClick={() => openMap(booking.customerAddress)}>
                    <MapPin size={16} className="mt-1 text-gray-500" />
                    <div className="text-sm text-gray-600 truncate max-w-[90%]" title={booking.customerAddress}>
                      {booking.customerAddress}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="mt-1 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">
                        {new Date(booking.serviceDate).toLocaleDateString()} 
                        <span className="flex items-center gap-1 mt-1">
                          <Clock size={12} /> {booking.serviceTime}
                          <span className="ml-1">({booking.serviceDuration} mins)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-500" />
                      <span className="font-semibold">${booking.amount}</span>
                      {booking.paymentStatus && (
                        <Badge variant={booking.paymentStatus === "Paid" ? "default" : "outline"} className="ml-2">
                          {booking.paymentStatus}
                        </Badge>
                      )}
                      {booking.paymentMode && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {booking.paymentMode}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewBooking(booking.id)} 
                        className="h-8 w-8"
                      >
                        <Eye size={16} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewBooking(booking.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditBooking(booking.id)}>
                            Edit Booking
                          </DropdownMenuItem>
                          {status !== "Cancelled" && status !== "Completed" && (
                            <DropdownMenuItem onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                          {status === "Cancelled" && (
                            <DropdownMenuItem onClick={() => handleProcessRefund(booking.id)}>
                              Process Refund
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <LocationMapDialog 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        address={selectedAddress} 
      />
    </div>
  );
}
