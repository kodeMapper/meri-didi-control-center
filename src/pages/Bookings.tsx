
import { useState } from "react";
import { Booking, BookingStatus, NotificationType } from "@/types";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookingDetails } from "@/components/dashboard/BookingDetails";

function Bookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "excel">("csv");

  // Fetch bookings from Supabase
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const data = await getRecentBookings(100); // Get up to 100 bookings
      return data;
    }
  });

  // Filter bookings by category
  const filteredBookings = selectedCategory === "All" 
    ? bookings 
    : bookings.filter(booking => booking.serviceType === selectedCategory);

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string, reason: string }) => {
      const success = await deleteBooking(bookingId);
      
      if (!success) {
        throw new Error("Failed to delete booking");
      }
      
      // Create notification for customer
      if (selectedBooking) {
        try {
          const { error } = await supabase
            .from('notifications')
            .insert({
              type: 'Booking Cancelled' as NotificationType,
              message: `Your booking for ${selectedBooking.serviceName} has been cancelled. Reason: ${reason}`,
              user_type: 'customer',
              user_identifier: selectedBooking.customerId,
              read: false,
              created_at: new Date().toISOString()
            });
            
          if (error) {
            console.error("Error creating notification:", error);
          }
        } catch (err) {
          console.error("Failed to create notification:", err);
        }
      }
      
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Booking Deleted",
        description: "The booking has been successfully deleted and the customer has been notified.",
      });
      setIsDeleteDialogOpen(false);
      setDeleteReason("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete booking: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);
      
      if (error) {
        throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedBooking || !deleteReason.trim()) return;
    
    deleteBookingMutation.mutate({ 
      bookingId: selectedBooking.id,
      reason: deleteReason
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

  // Helper function to safely get initials
  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0] || "")
      .join("")
      .toUpperCase();
  };
  
  const handleExport = () => {
    setIsExportDialogOpen(true);
  };
  
  const processExport = () => {
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
        "Status": booking.status || "N/A",
        "Worker": booking.workerName || "N/A",
      }));
    };
    
    const bookingsData = prepareData(filteredBookings);
    
    if (exportFormat === "csv") {
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
      a.download = "bookings-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "excel") {
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
      a.download = "bookings-export.xls";
      a.click();
      URL.revokeObjectURL(url);
    } else if (exportFormat === "pdf") {
      // For PDF, we'll open a new window with a formatted version
      // that can be printed to PDF using the browser
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Bookings Export</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
              </style>
            </head>
            <body>
              <h1>Bookings Export</h1>
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
    
    setIsExportDialogOpen(false);
    
    toast({
      title: "Export Successful",
      description: `Bookings data has been exported in ${exportFormat.toUpperCase()} format.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-gray-500">Manage all customer bookings</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button variant="outline" onClick={() => window.location.href="/completed-services"}>
            <FileText size={16} className="mr-2" />
            Completed Services
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
                <TableHead>DATE</TableHead>
                <TableHead>AMOUNT</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    No bookings found
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
                      <Select
                        defaultValue={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value as BookingStatus)}
                      >
                        <SelectTrigger className={getStatusColor(booking.status || "Unknown")}>
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
                          className="h-8 w-8 text-gray-500 hover:text-green-600"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => handleDeleteClick(booking)}
                        >
                          <Trash2 size={16} />
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
          Showing {filteredBookings.length} booking(s)
        </div>
      </div>

      {/* Booking Details Dialog */}
      <BookingDetails
        booking={selectedBooking}
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Booking Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
              Please provide a reason for cancellation. The customer will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="deleteReason">Reason for Cancellation</Label>
            <Textarea
              id="deleteReason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Please provide a reason for cancellation"
              className="mt-2"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={!deleteReason.trim() || deleteBookingMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteBookingMutation.isPending ? "Deleting..." : "Delete Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Bookings</DialogTitle>
            <DialogDescription>
              Choose a format to export the bookings data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="exportFormat">Export Format</Label>
            <Select
              value={exportFormat}
              onValueChange={(value: "csv" | "pdf" | "excel") => setExportFormat(value)}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={processExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Bookings;
