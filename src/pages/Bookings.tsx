
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingList } from "@/components/bookings/BookingList";
import { BookingFiltersBar } from "@/components/bookings/BookingFilters";
import { BookingFilters, BookingStatus } from "@/types";

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingFilters>({
    dateRange: { from: "", to: "" },
    serviceType: "",
    paymentMode: "",
    location: "",
    searchQuery: "",
  });

  const handleFiltersChange = (newFilters: BookingFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
      </div>

      <BookingFiltersBar onFiltersChange={handleFiltersChange} />

      <div className="mt-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <BookingList status="Pending" title="All" filters={filters} />
          </TabsContent>
          
          <TabsContent value="pending">
            <BookingList status="Pending" title="Pending" filters={filters} />
          </TabsContent>
          
          <TabsContent value="confirmed">
            <BookingList status="Confirmed" title="Confirmed" filters={filters} />
          </TabsContent>
          
          <TabsContent value="completed">
            <BookingList status="Completed" title="Completed" filters={filters} />
          </TabsContent>
          
          <TabsContent value="cancelled">
            <BookingList status="Cancelled" title="Cancelled" filters={filters} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
