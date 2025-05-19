
import { useState } from "react";
import { Booking } from "@/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BookingDetailsProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}

export function BookingDetails({ booking, open, onClose }: BookingDetailsProps) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [isFeedbackMode, setIsFeedbackMode] = useState<boolean>(false);

  const handleSaveFeedback = () => {
    // In a real app, we'd save this to the database
    toast({
      title: "Feedback Saved",
      description: "Customer feedback and rating have been recorded.",
    });
    
    setFeedback("");
    setRating(0);
    setIsFeedbackMode(false);
  };

  if (!booking || !open) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center space-x-2">
            <span>Booking Details</span>
            <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
              ID: {booking.id.substring(0, 8)}...
            </span>
          </DialogTitle>
        </DialogHeader>

        {isFeedbackMode ? (
          <div className="space-y-4">
            <DialogDescription>
              Record customer feedback and rating for this service
            </DialogDescription>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Customer Rating</Label>
              <Select value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Customer Comments</Label>
              <Textarea 
                id="feedback"
                placeholder="Enter customer feedback here"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFeedbackMode(false)}>Cancel</Button>
              <Button onClick={handleSaveFeedback}>Save Feedback</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Customer Details</h3>
                <p className="font-medium">{booking.customerName}</p>
                <p className="text-sm">{booking.customerEmail}</p>
                <p className="text-sm">{booking.customerPhone || 'N/A'}</p>
                <p className="text-sm">{booking.customerAddress || 'N/A'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Worker Details</h3>
                <p className="font-medium">{booking.workerName || 'Unassigned'}</p>
                <p className="text-sm">Worker ID: {booking.workerId || 'N/A'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Service Details</h3>
                <p className="font-medium">{booking.serviceName}</p>
                <p className="text-sm">{booking.serviceType}</p>
                <p className="text-sm">{booking.serviceDuration} hours</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-gray-500">Booking Details</h3>
                <p className="font-medium">Date: {booking.serviceDate}</p>
                <p className="text-sm">Time: {booking.serviceTime}</p>
                <p className="text-sm">Status: <span className="font-semibold">{booking.status}</span></p>
                <p className="text-sm">Amount: <span className="font-semibold">${booking.amount.toFixed(2)}</span></p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold text-sm text-gray-500">Additional Notes</h3>
              <p className="text-sm">{booking.notes || 'No additional notes'}</p>
            </div>
            
            {booking.status === 'Completed' && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Customer Feedback</h3>
                  {booking.feedback ? (
                    <>
                      <p className="text-sm">Rating: {booking.rating || 'N/A'} / 5</p>
                      <p className="text-sm">{booking.feedback}</p>
                    </>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">No feedback recorded</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setIsFeedbackMode(true)}
                      >
                        Add Feedback
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
