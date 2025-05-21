import { useState } from "react";
import { Booking } from "@/types";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Trash2, 
  Copy,
  Check,
  MapPin,
  Calendar,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteBooking, addNotification } from "@/lib/supabase";
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

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onDeleted: () => void;
  onViewLocation?: (address: string) => void; // Added this prop
}

export function BookingCard({ booking, onViewDetails, onDeleted, onViewLocation }: BookingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

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

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    
    toast({
      title: "ID Copied",
      description: "Booking ID has been copied to clipboard",
    });
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleDeleteBooking = async () => {
    if (!deletionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for cancellation",
        variant: "destructive"
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Delete booking from database, passing both id and reason
      const success = await deleteBooking(booking.id, deletionReason);
      
      if (success) {
        // Send notification to worker
        if (booking.workerId) {
          await addNotification({
            type: "Booking Cancelled",
            message: `Booking #${booking.id.substring(0, 8)} has been cancelled. Reason: ${deletionReason}`,
            title: "Booking Cancelled",
            read: false,
            user_type: "worker",
            user_identifier: booking.workerId
          });
        }
        
        // Send notification to customer
        await addNotification({
          type: "Booking Cancelled",
          message: `Your booking for ${booking.serviceName} on ${booking.serviceDate} has been cancelled. Reason: ${deletionReason}`,
          title: "Booking Cancelled",
          read: false,
          user_type: "customer",
          user_identifier: booking.customerId
        });
        
        toast({
          title: "Booking Deleted",
          description: `Booking has been cancelled and notifications sent.`,
        });
        
        // Close dialog and reset
        setIsDeleteDialogOpen(false);
        setDeletionReason("");
        onDeleted();
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  // Helper function to safely get initials
  const getInitials = (name: string): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0] || "")
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <CardHeader className="py-3 px-4 bg-gray-50 border-b flex flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div 
                className="relative group cursor-pointer" 
                onClick={() => copyToClipboard(booking.id)}
              >
                <span className="text-sm font-medium text-gray-600">
                  #{booking.id.substring(0, 8)}
                </span>
                <div className="absolute hidden group-hover:flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded -top-8 left-0 whitespace-nowrap z-10">
                  {isCopied ? (
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
            </div>
            <Badge variant="outline" className={cn(getStatusColor(booking.status))}>
              {booking.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500"
              onClick={() => onViewDetails(booking)}
              title="View Details"
            >
              <Eye size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500"
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Delete Booking"
            >
              <Trash2 size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Customer</h4>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                  {getInitials(booking.customerName)}
                </div>
                <div>
                  <div className="font-medium">{booking.customerName || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{booking.customerEmail || "No email"}</div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Service</h4>
              <div>
                <div className="font-medium">{booking.serviceName || "Unknown Service"}</div>
                <div className="text-xs text-gray-500">{booking.serviceType || "Unknown Type"}</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Worker</h4>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
                  {getInitials(booking.workerName)}
                </div>
                <div className="font-medium">{booking.workerName || "Unassigned"}</div>
              </div>
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{formatDate(booking.serviceDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Clock size={16} className="text-gray-400" />
                    <span>{formatTime(booking.serviceTime)}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Duration & Price</h4>
                  <div className="text-sm">Duration: {booking.serviceDuration || 0} hours</div>
                  <div className="text-sm font-semibold">Amount: ${booking.amount?.toFixed(2) || "0.00"}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{booking.customerAddress || "No address provided"}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => onViewLocation?.(booking.customerAddress || "")}
                >
                  <MapPin size={14} className="mr-1" />
                  View on Map
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                <div className="text-sm bg-gray-50 p-2 rounded min-h-[80px]">
                  {booking.notes || "No additional notes"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {isExpanded && (
          <CardFooter className="border-t bg-gray-50 py-2 px-4 flex justify-between">
            <div className="text-xs text-gray-500">
              Created: {formatDate(booking.createdAt)}
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {formatDate(booking.updatedAt)}
            </div>
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              You are about to delete booking #{booking.id.substring(0, 8)}. This action cannot be undone.
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
              disabled={!deletionReason.trim() || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
