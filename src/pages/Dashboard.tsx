import { useState, useEffect } from "react";
import { Worker, Booking, Stats, CategoryStat } from "@/types";
import { WorkerService, BookingService, StatsService, NotificationService } from "@/services/mockDatabase";
import { Users, Calendar, Clock, CheckCircle } from "lucide-react";
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

function Dashboard() {
  const [stats, setStats] = useState<Stats>(StatsService.getStats());
  const [recentBookings, setRecentBookings] = useState<Booking[]>(BookingService.getRecent());
  const [pendingWorkers, setPendingWorkers] = useState<Worker[]>(WorkerService.getPending());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
          title="Active Workers"
          value={stats.activeWorkers}
          icon={<CheckCircle size={24} className="text-green-500" />}
          change={{
            value: stats.growthRates.activeWorkers,
            isIncrease: true,
            label: "Since last month",
          }}
        />
        
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<Clock size={24} className="text-orange-500" />}
          change={{
            value: stats.growthRates.pendingApprovals,
            isIncrease: true,
            label: "Since last week",
          }}
        />
        
        <StatCard
          title="Bookings (This Week)"
          value={stats.bookingsThisWeek}
          icon={<Calendar size={24} className="text-blue-500" />}
          change={{
            value: stats.growthRates.bookings,
            isIncrease: true,
            label: "Since last week",
          }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <WorkerCategoryChart data={stats.workersByCategory as any[]} />
        </div>
        <div className="xl:col-span-2">
          <PendingWorkersList
            workers={pendingWorkers}
            onApprove={handleApproveWorker}
            onReject={handleRejectWorker}
          />
        </div>
      </div>

      <RecentBookingsTable bookings={recentBookings} />
    </div>
  );
}

export default Dashboard;
