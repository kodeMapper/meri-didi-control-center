import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Booking } from "@/types";
import { Eye, Trash2, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingDetails } from "./BookingDetails";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { deleteBooking, addNotification } from "@/lib/supabase";

interface RecentBookingsTableProps {
  bookings: Booking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [bookingToCopy, setBookingToCopy] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };
  
  const handleViewAll = () => {
    navigate('/bookings');
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      // Delete booking from database, now passing both id and reason
      const success = await deleteBooking(selectedBooking.id, deletionReason);
      
      if (success) {
        // Send notification to worker
        if (selectedBooking.workerId) {
          await addNotification({
            type: "Booking Cancelled",
            message: `Booking #${selectedBooking.id.substring(0, 8)} has been cancelled. Reason: ${deletionReason}`,
            title: "Booking Cancelled",
            read: false,
            user_type: "worker",
            user_identifier: selectedBooking.workerId
          });
        }
        
        // Send notification to customer
        await addNotification({
          type: "Booking Cancelled",
          message: `Your booking for ${selectedBooking.serviceName} on ${selectedBooking.serviceDate} has been cancelled. Reason: ${deletionReason}`,
          title: "Booking Cancelled",
          read: false,
          user_type: "customer",
          user_identifier: selectedBooking.customerId
        });
        
        toast({
          title: "Booking Deleted",
          description: `Booking has been cancelled and notifications sent.`,
        });
        
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Recent Bookings</h3>
        <div className="flex items-center gap-4">
          <Select defaultValue="All Categories">
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Cooking">Cooking</SelectItem>
              <SelectItem value="Sweeping">Sweeping</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-primary" onClick={handleViewAll}>
            View All
          </Button>
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
            {bookings.length > 0 ? bookings.map((booking) => (
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
                      <div className="font-medium">{booking.customerName || "Unknown"}</div>
                      <div className="text-xs text-gray-500">{booking.customerEmail || "No email"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.workerName || "Unknown"}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{booking.serviceName || "Unknown"}</div>
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
                  ${(booking.amount || 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(booking.status || "Unknown")}>
                    {booking.status || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleViewDetails(booking)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
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
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-500 mt-4 px-3">
        Showing 1 to {bookings.length} of {bookings.length} results
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
