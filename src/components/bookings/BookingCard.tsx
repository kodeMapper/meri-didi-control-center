import { useState } from "react";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, DollarSign, User, ChevronDown, ChevronUp, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface BookingCardProps {
  booking: Booking;
  onViewDetails: () => void;
  onDeleted: () => void;
  onViewLocation?: (address: string) => void;
}

export function BookingCard({ booking, onViewDetails, onDeleted, onViewLocation }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");

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

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleViewLocation = () => {
    if (onViewLocation && booking.customerAddress) {
      onViewLocation(booking.customerAddress);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              Booking #{booking.id.substring(0, 8)}...
            </h3>
            <p className="text-sm text-gray-500">{booking.serviceName}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center text-gray-600 text-sm">
            <User size={16} className="mr-2" />
            <span>
              {booking.customerName || "Unknown"} {booking.customerEmail ? `(${booking.customerEmail})` : ""}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2" />
            <span>{booking.serviceDate || "No date"}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-2" />
            <span>
              {booking.serviceTime || "No time"} ({booking.serviceDuration || 0} hours)
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <DollarSign size={16} className="mr-2" />
            <span>${(booking.amount || 0).toFixed(2)}</span>
          </div>
          {booking.customerAddress && (
            <div className="flex items-center text-gray-600 text-sm col-span-2">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span className="truncate">{booking.customerAddress}</span>
              {onViewLocation && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-6 p-1" 
                  onClick={handleViewLocation}
                >
                  View
                </Button>
              )}
            </div>
          )}
          {booking.workerName && (
            <div className="flex items-center text-gray-600 text-sm">
              <User size={16} className="mr-2" />
              <span>Worker: {booking.workerName}</span>
            </div>
          )}
        </div>

        {expanded && (
          <div className="mt-4 border-t pt-4">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Payment Mode:</strong> {booking.paymentMode || "N/A"}
            </div>
            {booking.additionalNotes && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Notes:</strong> {booking.additionalNotes}
              </div>
            )}
            {booking.feedback && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Feedback:</strong> {booking.feedback}
              </div>
            )}
            {booking.rating && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Rating:</strong> {booking.rating} / 5
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 p-1 h-8" 
            onClick={handleToggleExpand}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show More
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary p-0 h-8 w-8"
              onClick={onViewDetails}
            >
              <Eye size={16} />
            </Button>
            {booking.status !== "Completed" && booking.status !== "Cancelled" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500 p-0 h-8 w-8"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for cancellation
            </label>
            <textarea 
              className="w-full p-2 border rounded-md"
              rows={3}
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDeleted();
                setIsDeleteDialogOpen(false);
              }}
              disabled={!deletionReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
