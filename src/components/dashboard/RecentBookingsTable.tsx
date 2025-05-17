
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
import { Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecentBookingsTableProps {
  bookings: Booking[];
}

export function RecentBookingsTable({ bookings }: RecentBookingsTableProps) {
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
          <Button variant="outline" size="sm" className="text-primary">
            View All
          </Button>
        </div>
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
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
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

      <div className="text-sm text-gray-500 mt-4 px-3">
        Showing 1 to {bookings.length} of {bookings.length} results
      </div>
    </div>
  );
}
