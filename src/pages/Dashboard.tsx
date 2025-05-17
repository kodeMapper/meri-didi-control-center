import { useState, useEffect } from "react";
import { WorkerService, BookingService, StatsService, NotificationService } from "@/services/mockDatabase";
import { Users, Calendar, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkerCategoryChart } from "@/components/dashboard/WorkerCategoryChart";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookingsTable";
import { PendingWorkersList } from "@/components/dashboard/PendingWorkersList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CategoryStat, Worker } from "@/types";

function Dashboard() {
  const [stats, setStats] = useState(StatsService.getStats());
  const [recentBookings, setRecentBookings] = useState(BookingService.getRecent());
  const [pendingWorkers, setPendingWorkers] = useState<Worker[]>(WorkerService.getPending());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from Supabase
    const loadFromSupabase = async () => {
      try {
        // Load pending workers from worker_applications table
        const { data: pendingData, error } = await supabase
          .from('worker_applications')
          .select('*')
          .eq('status', 'Pending')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching worker applications:", error);
        } else if (pendingData && pendingData.length > 0) {
          // Transform the data to match our Worker type structure
          const transformedWorkers: Worker[] = pendingData.map(worker => ({
            id: worker.id,
            fullName: worker.full_name,
            email: worker.email,
            phone: worker.phone,
            address: worker.address,
            city: worker.city as any,
            gender: worker.gender as any,
            dateOfBirth: worker.date_of_birth,
            serviceType: worker.service_type as any,
            experience: worker.experience,
            availability: worker.availability as any,
            idType: worker.id_type as any,
            idNumber: worker.id_number,
            about: worker.about,
            skills: worker.skills || [],
            status: worker.status as any,
            rating: worker.rating,
            totalBookings: worker.total_bookings,
            completionRate: worker.completion_rate,
            createdAt: worker.created_at,
            updatedAt: worker.updated_at,
            idProofUrl: worker.id_proof_url,
            photoUrl: worker.photo_url,
          }));
          
          setPendingWorkers(transformedWorkers);
        }
        
        // Load recent bookings (keeping the existing logic for now)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (bookingsError) {
          console.error("Error loading bookings from Supabase:", bookingsError);
        } else if (bookingsData) {
          setRecentBookings(bookingsData);
        }
      } catch (error) {
        console.error("Error in Supabase data loading:", error);
      }
    };
    
    loadFromSupabase();
  }, []);

  const handleApproveWorker = async (workerId: string) => {
    try {
      // Update in local service
      WorkerService.update(workerId, { status: "Active" });
      
      // Update in Supabase
      const { error } = await supabase
        .from('worker_applications')
        .update({ 
          status: 'Active', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', workerId);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Worker Approved",
        description: "Worker has been approved successfully.",
      });
      
      // Refresh pending workers list from Supabase
      const { data: refreshedData } = await supabase
        .from('worker_applications')
        .select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });
        
      if (refreshedData) {
        // Transform the data to match our Worker type structure
        const transformedWorkers: Worker[] = refreshedData.map(worker => ({
          id: worker.id,
          fullName: worker.full_name,
          email: worker.email,
          phone: worker.phone,
          address: worker.address,
          city: worker.city as any,
          gender: worker.gender as any,
          dateOfBirth: worker.date_of_birth,
          serviceType: worker.service_type as any,
          experience: worker.experience,
          availability: worker.availability as any,
          idType: worker.id_type as any,
          idNumber: worker.id_number,
          about: worker.about,
          skills: worker.skills || [],
          status: worker.status as any,
          rating: worker.rating,
          totalBookings: worker.total_bookings,
          completionRate: worker.completion_rate,
          createdAt: worker.created_at,
          updatedAt: worker.updated_at,
          idProofUrl: worker.id_proof_url,
          photoUrl: worker.photo_url,
        }));
        
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
      // Update in local service
      WorkerService.update(workerId, { status: "Rejected" });
      
      // Update in Supabase
      const { error } = await supabase
        .from('worker_applications')
        .update({ 
          status: 'Rejected', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', workerId);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Worker Rejected",
        description: "Worker has been rejected.",
        variant: "destructive",
      });
      
      // Refresh pending workers list from Supabase
      const { data: refreshedData } = await supabase
        .from('worker_applications')
        .select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });
        
      if (refreshedData) {
        // Transform the data to match our Worker type structure
        const transformedWorkers: Worker[] = refreshedData.map(worker => ({
          id: worker.id,
          fullName: worker.full_name,
          email: worker.email,
          phone: worker.phone,
          address: worker.address,
          city: worker.city as any,
          gender: worker.gender as any,
          dateOfBirth: worker.date_of_birth,
          serviceType: worker.service_type as any,
          experience: worker.experience,
          availability: worker.availability as any,
          idType: worker.id_type as any,
          idNumber: worker.id_number,
          about: worker.about,
          skills: worker.skills || [],
          status: worker.status as any,
          rating: worker.rating,
          totalBookings: worker.total_bookings,
          completionRate: worker.completion_rate,
          createdAt: worker.created_at,
          updatedAt: worker.updated_at,
          idProofUrl: worker.id_proof_url,
          photoUrl: worker.photo_url,
        }));
        
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
          <WorkerCategoryChart data={stats.workersByCategory as CategoryStat[]} />
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
