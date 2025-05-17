
import { useState } from "react";
import { Booking, BookingStatus } from "@/types";
import { BookingService } from "@/services/mockDatabase";
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
import { Badge } from "@/components/ui/badge";
import { Eye, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function Bookings() {
  const [bookings] = useState<Booking[]>(BookingService.getAll());
  const { toast } = useToast();

  const handleStatusChange = (bookingId: string, status: BookingStatus) => {
    BookingService.update(bookingId, { status });
    toast({
      title: "Status Updated",
      description: `Booking status has been updated to ${status}`,
    });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookings</h1>
        <p className="text-gray-500">Manage all customer bookings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <Select defaultValue="All Categories">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Cooking">Cooking</SelectItem>
              <SelectItem value="Sweeping">Sweeping</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">View All</Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
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
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
                        {booking.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.workerName || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.serviceName}</div>
                      <div className="text-xs text-gray-500">{booking.serviceDuration} hours</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{booking.serviceDate}</div>
                      <div className="text-xs text-gray-500">{booking.serviceTime}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${booking.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={booking.status}
                      onValueChange={(value) => handleStatusChange(booking.id, value as BookingStatus)}
                    >
                      <SelectTrigger className={getStatusColor(booking.status)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 text-sm text-gray-500">
          Showing 1 to {bookings.length} of {bookings.length} results
        </div>
      </div>
    </div>
  );
}

export default Bookings;
