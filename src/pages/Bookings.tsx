
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingList } from "@/components/bookings/BookingList";
import { BookingStatus } from "@/types";

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<string>("pending");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="pending">
            <BookingList 
              status="Pending" 
              title="Pending Orders" 
            />
          </TabsContent>
          
          <TabsContent value="confirmed">
            <BookingList 
              status="Confirmed" 
              title="Confirmed Orders" 
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <BookingList 
              status="Completed" 
              title="Completed Orders" 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
