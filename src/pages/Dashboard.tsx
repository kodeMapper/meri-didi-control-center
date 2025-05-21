import { useState, useEffect } from "react";
import { Worker, Booking, Stats, CategoryStat } from "@/types";
import { WorkerService, BookingService, StatsService, NotificationService } from "@/services/mockDatabase";
import { Users, Calendar, Clock, CheckCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkerCategoryChart } from "@/components/dashboard/WorkerCategoryChart";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookingsTable";
import { PendingWorkersList } from "@/components/dashboard/PendingWorkersList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  getWorkerApplications, 
  getRecentBookings, 
  mapWorkerApplicationToWorker, 
  updateWorkerApplicationStatus, 
  deleteWorkerApplication 
} from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const [stats, setStats] = useState<Stats>(StatsService.getStats());
  const [recentBookings, setRecentBookings] = useState<Booking[]>(BookingService.getRecent());
  const [pendingWorkers, setPendingWorkers] = useState<Worker[]>(WorkerService.getPending());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data for booking trends chart
  const bookingTrendsData = [
    { name: 'Jan', bookings: 10 },
    { name: 'Feb', bookings: 18 },
    { name: 'Mar', bookings: 25 },
    { name: 'Apr', bookings: 32 },
    { name: 'May', bookings: 45 },
    { name: 'Jun', bookings: 55 },
    { name: 'Jul', bookings: 70 },
  ];

  useEffect(() => {
    // Load data from Supabase and update state
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load pending workers from worker_applications table
        const pendingData = await getWorkerApplications('Pending');
          
        if (pendingData && pendingData.length > 0) {
          // Transform the data to match our Worker type structure
          const transformedWorkers = pendingData.map(worker => mapWorkerApplicationToWorker(worker));
          setPendingWorkers(transformedWorkers);
        }
        
        // Load recent bookings using our helper
        const bookingsData = await getRecentBookings(5);
        if (bookingsData && bookingsData.length > 0) {
          setRecentBookings(bookingsData);
        }
      } catch (error) {
        console.error("Error in data loading:", error);
        // Keep existing mock data if Supabase fails
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleApproveWorker = async (workerId: string) => {
    try {
      // Update in Supabase
      const success = await updateWorkerApplicationStatus(workerId, 'Active');
      
      if (!success) {
        throw new Error("Failed to update worker status");
      }
      
      // Also update in mock database for compatibility
      WorkerService.update(workerId, { status: "Active" });
      
      toast({
        title: "Worker Approved",
        description: "Worker has been approved successfully.",
      });
      
      // Refresh pending workers list
      const pendingData = await getWorkerApplications('Pending');
      
      if (pendingData) {
        // Transform the data to match our Worker type structure
        const transformedWorkers = pendingData.map(worker => mapWorkerApplicationToWorker(worker));
        setPendingWorkers(transformedWorkers);
      }
    } catch (error) {
      console.error("Error approving worker:", error);
      toast({
        title: "Error",
        description: "There was an error approving this worker.",
        variant: "destructive",
      });
    }
  };

  const handleRejectWorker = async (workerId: string) => {
    try {
      // Update in Supabase
      const success = await updateWorkerApplicationStatus(workerId, 'Rejected');
      
      if (!success) {
        throw new Error("Failed to update worker status");
      }
      
      // Also update in mock database for compatibility
      WorkerService.update(workerId, { status: "Rejected" });
      
      toast({
        title: "Worker Rejected",
        description: "Worker has been rejected.",
        variant: "destructive",
      });
      
      // Refresh pending workers list
      const pendingData = await getWorkerApplications('Pending');
      
      if (pendingData) {
        // Transform the data to match our Worker type structure
        const transformedWorkers = pendingData.map(worker => mapWorkerApplicationToWorker(worker));
        setPendingWorkers(transformedWorkers);
      }
    } catch (error) {
      console.error("Error rejecting worker:", error);
      toast({
        title: "Error",
        description: "There was an error rejecting this worker.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your platform's performance and activities</p>
        </div>
        <Button onClick={() => navigate("/worker-registration")} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          + Add New Worker
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={stats.totalWorkers}
          icon={<Users size={24} className="text-primary" />}
          change={{
            value: stats.growthRates.workers,
            isIncrease: true,
            label: "Since last month",
          }}
        />
        
        <StatCard
          title="Pending Applications"
          value={pendingWorkers.length || stats.pendingApprovals}
          icon={<Clock size={24} className="text-red-500" />}
          change={{
            value: 5,
            isIncrease: true,
            label: "5 new today",
          }}
        />
        
        <StatCard
          title="Today's Bookings"
          value={stats.bookingsThisWeek}
          icon={<Calendar size={24} className="text-blue-500" />}
          change={{
            value: 8,
            isIncrease: true,
            label: "Since yesterday",
          }}
        />
        
        <StatCard
          title="Price Updates"
          value={3}
          icon={<DollarSign size={24} className="text-green-500" />}
          change={{
            value: 0,
            isIncrease: false,
            label: "Last updated 2h ago",
          }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Workers by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <WorkerCategoryChart data={stats.workersByCategory} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-[400px]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={bookingTrendsData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-md shadow">
                            <p className="font-medium">{label}</p>
                            <p className="text-blue-600">
                              Bookings: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookings"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <PendingWorkersList
          workers={pendingWorkers}
          onApprove={handleApproveWorker}
          onReject={handleRejectWorker}
        />
        
        <RecentBookingsTable bookings={recentBookings} />
      </div>
    </div>
  );
}

export default Dashboard;
