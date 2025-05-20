
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingList } from "@/components/bookings/BookingList";
import { BookingFilters } from "@/components/bookings/BookingFilters";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Plus, RefreshCw } from "lucide-react";
import { BookingStatus } from "@/types";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [serviceType, setServiceType] = useState<string>("all");
  const [paymentMode, setPaymentMode] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulating data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleExport = (format: string) => {
    // This would be implemented with real functionality in the backend
    console.log(`Exporting bookings in ${format} format`);
  };

  const handleCreateBooking = () => {
    // This would open a modal or redirect to booking creation page
    console.log("Create new booking");
  };

  const handleFilterChange = (
    dates: { from: Date | undefined, to: Date | undefined },
    service: string,
    payment: string,
    loc: string
  ) => {
    setDateRange(dates);
    setServiceType(service);
    setPaymentMode(payment);
    setLocation(loc);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          
          <div className="relative group">
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export
            </Button>
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg hidden group-hover:block z-50">
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport("csv")}
                >
                  Export as CSV
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport("excel")}
                >
                  Export as Excel
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport("pdf")}
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
          
          <Button onClick={handleCreateBooking} className="flex items-center gap-2">
            <Plus size={16} />
            New Booking
          </Button>
        </div>
      </div>

      <BookingFilters 
        dateRange={dateRange}
        serviceType={serviceType}
        paymentMode={paymentMode}
        location={location}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pending Orders
            <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">8</span>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">24</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="pending">
            <BookingList 
              status="Pending" 
              title="Pending Orders" 
              dateRange={dateRange}
              serviceType={serviceType}
              paymentMode={paymentMode}
              location={location}
              searchQuery={searchQuery}
            />
          </TabsContent>
          
          <TabsContent value="confirmed">
            <BookingList 
              status="Confirmed" 
              title="Confirmed Orders" 
              dateRange={dateRange}
              serviceType={serviceType}
              paymentMode={paymentMode}
              location={location}
              searchQuery={searchQuery}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <BookingList 
              status="Completed" 
              title="Completed Orders" 
              dateRange={dateRange}
              serviceType={serviceType}
              paymentMode={paymentMode}
              location={location}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
