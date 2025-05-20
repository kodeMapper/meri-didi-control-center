
import { useState, useEffect } from "react";
import { Booking } from "@/types";
import { BookingService } from "@/services/mockDatabase";
import { supabase, getRecentBookings, deleteBooking } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookingDetails } from "@/components/dashboard/BookingDetails";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Trash2, Search, Copy, Check, Filter } from "lucide-react";

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [bookingToCopy, setBookingToCopy] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Try to get bookings from Supabase
      const data = await getRecentBookings(100);
      if (data && data.length > 0) {
        setBookings(data);
      } else {
        // Fallback to mock data
        setBookings(BookingService.getAll());
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback to mock data
      setBookings(BookingService.getAll());
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      // Delete booking from database, now passing both id and reason
      const success = await deleteBooking(selectedBooking.id, deletionReason);
      
      if (success) {
        toast({
          title: "Booking Deleted",
          description: `Booking has been cancelled. Reason: ${deletionReason}`,
        });
        
        // Refresh bookings list
        fetchBookings();
        
        // Close dialog and reset
        setIsDeleteDialogOpen(false);
        setDeletionReason("");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const handleShowDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setBookingToCopy(id);
    setIsCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
      setBookingToCopy(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to safely get initials
  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0] || "")
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-gray-500">View all customer bookings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by customer, worker or booking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <Select 
              defaultValue="All" 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOOKING ID</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>WORKER</TableHead>
                <TableHead>SERVICE</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading && filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div 
                      className="relative group cursor-pointer" 
                      onClick={() => copyToClipboard(booking.id)}
                    >
                      <span className="text-xs text-gray-600">
                        #{booking.id.substring(0, 8)}...
                      </span>
                      <div className="absolute hidden group-hover:flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded -top-8 left-0 whitespace-nowrap">
                        {bookingToCopy === booking.id && isCopied ? (
                          <>
                            <Check size={12} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy ID
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                        {getInitials(booking.customerName)}
                      </div>
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.workerName || "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.serviceName || "N/A"}</div>
                      <div className="text-xs text-gray-500">{booking.serviceDuration || 0} hours</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.serviceDate || "N/A"}</div>
                      <div className="text-xs text-gray-500">{booking.serviceTime || "N/A"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${booking.amount?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewBooking(booking)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleShowDeleteDialog(booking)}
                        title="Delete Booking"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    {isLoading ? (
                      <p className="text-gray-500">Loading bookings...</p>
                    ) : (
                      <p className="text-gray-500">No bookings found.</p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <BookingDetails
        booking={selectedBooking}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              You are about to delete booking #{selectedBooking?.id.substring(0, 8)}. This action cannot be undone.
              Please provide a reason for cancellation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Textarea
                id="deletion-reason"
                placeholder="Enter reason for cancellation"
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteBooking}
              disabled={!deletionReason.trim()}
            >
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Bookings;
