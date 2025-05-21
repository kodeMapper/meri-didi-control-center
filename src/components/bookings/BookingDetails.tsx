
import { Booking } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  MessageSquare,
  Star
} from "lucide-react";

interface BookingDetailsProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}

export function BookingDetails({ booking, open, onClose }: BookingDetailsProps) {
  if (!booking) return null;

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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Booking Details</DialogTitle>
            <Badge variant="outline" className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Booking Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Booking Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><Calendar size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Service Date</div>
                  <div>{formatDate(booking.serviceDate)}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><Clock size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Service Time & Duration</div>
                  <div>{booking.serviceTime || "N/A"} ({booking.serviceDuration || 0} hours)</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><DollarSign size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Amount</div>
                  <div>${(booking.amount || 0).toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><CreditCard size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Payment Method</div>
                  <div>{booking.paymentMode || "N/A"}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2 col-span-2">
                <div className="mt-0.5"><MapPin size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Service Location</div>
                  <div>{booking.customerAddress || "No address provided"}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><User size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Customer Name</div>
                  <div>{booking.customerName || "N/A"}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><Mail size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Customer Email</div>
                  <div>{booking.customerEmail || "N/A"}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><Phone size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Customer Phone</div>
                  <div>{booking.customerPhone || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Worker Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Worker Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><User size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Worker Name</div>
                  <div>{booking.workerName || "Not assigned yet"}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><Mail size={16} className="text-gray-500" /></div>
                <div>
                  <div className="text-sm font-medium">Worker Email</div>
                  <div>{booking.workerEmail || "N/A"}</div>
                </div>
              </div>
              
              {booking.workerPhone && (
                <div className="flex items-start gap-2">
                  <div className="mt-0.5"><Phone size={16} className="text-gray-500" /></div>
                  <div>
                    <div className="text-sm font-medium">Worker Phone</div>
                    <div>{booking.workerPhone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Information */}
          {(booking.additionalNotes || booking.feedback || booking.rating) && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                {booking.additionalNotes && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5"><MessageSquare size={16} className="text-gray-500" /></div>
                    <div>
                      <div className="text-sm font-medium">Additional Notes</div>
                      <div>{booking.additionalNotes}</div>
                    </div>
                  </div>
                )}
                
                {booking.feedback && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5"><MessageSquare size={16} className="text-gray-500" /></div>
                    <div>
                      <div className="text-sm font-medium">Customer Feedback</div>
                      <div>{booking.feedback}</div>
                    </div>
                  </div>
                )}
                
                {booking.rating && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5"><Star size={16} className="text-gray-500" /></div>
                    <div>
                      <div className="text-sm font-medium">Rating</div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < booking.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="ml-2">({booking.rating}/5)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {booking.status === "Pending" && (
            <Button>
              Confirm Booking
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
