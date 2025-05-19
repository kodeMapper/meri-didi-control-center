
import { useState } from "react";
import { Booking } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCompletedBookings } from "@/lib/supabase";
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
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookingDetails } from "@/components/dashboard/BookingDetails";

function CompletedServices() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch completed bookings
  const { data: completedBookings = [], isLoading } = useQuery({
    queryKey: ['completedBookings'],
    queryFn: async () => {
      const data = await getCompletedBookings();
      return data;
    }
  });

  // Filter bookings by category
  const filteredBookings = selectedCategory === "All" 
    ? completedBookings 
    : completedBookings.filter(booking => booking.serviceType === selectedCategory);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const prepareData = (bookings: Booking[]) => {
      return bookings.map(booking => ({
        "Booking ID": booking.id,
        "Customer Name": booking.customerName || "N/A",
        "Customer Email": booking.customerEmail || "N/A",
        "Service Type": booking.serviceType || "N/A",
        "Service Name": booking.serviceName || "N/A",
        "Date": booking.serviceDate || "N/A",
        "Time": booking.serviceTime || "N/A",
        "Amount": booking.amount ? `$${booking.amount.toFixed(2)}` : "N/A",
        "Worker": booking.workerName || "N/A",
        "Status": "Completed",
      }));
    };
    
    const bookingsData = prepareData(filteredBookings);
    
    if (format === "csv") {
      // Generate CSV
      const headers = Object.keys(bookingsData[0]).join(",");
      const rows = bookingsData.map(booking => 
        Object.values(booking).map(value => `"${value}"`).join(",")
      );
      const csv = [headers, ...rows].join("\n");
      
      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "completed-services-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "excel") {
      // For Excel, we'll use CSV but change the extension
      const headers = Object.keys(bookingsData[0]).join(",");
      const rows = bookingsData.map(booking => 
        Object.values(booking).map(value => `"${value}"`).join(",")
      );
      const csv = [headers, ...rows].join("\n");
      
      // Download as Excel
      const blob = new Blob([csv], { type: "application/vnd.ms-excel" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "completed-services-export.xls";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      // For PDF, we'll open a new window with a formatted version
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Completed Services Export</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h1>Completed Services Export</h1>
              <table>
                <thead>
                  <tr>
                    ${Object.keys(bookingsData[0]).map(header => `<th>${header}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${bookingsData.map(booking => `
                    <tr>
                      ${Object.values(booking).map(value => `<td>${value}</td>`).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
    
    toast({
      title: "Export Successful",
      description: `Completed services data has been exported in ${format.toUpperCase()} format.`,
    });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Completed Services</h1>
          <p className="text-gray-500">View all completed service bookings</p>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="csv">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Export As" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv" onSelect={() => handleExport('csv')}>CSV</SelectItem>
              <SelectItem value="pdf" onSelect={() => handleExport('pdf')}>PDF</SelectItem>
              <SelectItem value="excel" onSelect={() => handleExport('excel')}>Excel</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => handleExport('csv')} className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <Select 
            defaultValue="All" 
            onValueChange={(value) => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="Cooking">Cooking</SelectItem>
              <SelectItem value="Sweeping">Sweeping</SelectItem>
              <SelectItem value="Driving">Driving</SelectItem>
              <SelectItem value="Landscaping">Landscaping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOOKING ID</TableHead>
                <TableHead>CUSTOMER</TableHead>
                <TableHead>WORKER</TableHead>
                <TableHead>SERVICE</TableHead>
                <TableHead>DATE COMPLETED</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>FEEDBACK</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading completed services...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No completed services found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">
                      {booking.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
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
                      {booking.workerName || "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{booking.serviceName || booking.serviceType || "Unknown"}</div>
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
                      {booking.feedback ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Rating: {booking.rating || "N/A"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          No feedback
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-blue-600"
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-blue-600"
                          onClick={() => handleExport('pdf')}
                        >
                          <FileText size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 text-sm text-gray-500">
          Showing {filteredBookings.length} completed service(s)
        </div>
      </div>

      {/* Booking Details Dialog */}
      <BookingDetails
        booking={selectedBooking}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}

export default CompletedServices;
