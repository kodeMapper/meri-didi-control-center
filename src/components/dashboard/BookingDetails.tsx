
import { Booking } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BookingDetailsProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}

export function BookingDetails({ booking, open, onClose }: BookingDetailsProps) {
  if (!booking) {
    return null;
  }

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

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="font-medium text-lg">{booking.customerName}</div>
              <div className="text-gray-500">{booking.customerEmail}</div>
              <div>{booking.customerPhone}</div>
              <div className="text-gray-700">{booking.customerAddress}</div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Booking Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{booking.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span className="font-medium">{booking.serviceTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">${booking.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Worker Information</h3>
            <div className="space-y-3">
              <div className="font-medium text-lg">{booking.workerName || "Unassigned"}</div>
              {booking.workerName ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Assigned
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Unassigned
                </Badge>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Service Information</h3>
              <div className="space-y-3">
                <div className="font-medium">{booking.serviceName}</div>
                <div>{booking.serviceType}</div>
                <div className="text-gray-500">Duration: {booking.serviceDuration} hours</div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Notes</h3>
              <div className="p-3 bg-gray-50 rounded-md">
                {booking.notes || "No additional notes"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
