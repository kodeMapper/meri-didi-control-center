
import { useState } from "react";
import { WorkerService, BookingService, StatsService, NotificationService } from "@/services/mockDatabase";
import { Users, Calendar, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkerCategoryChart } from "@/components/dashboard/WorkerCategoryChart";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookingsTable";
import { PendingWorkersList } from "@/components/dashboard/PendingWorkersList";

function Dashboard() {
  const [stats] = useState(StatsService.getStats());
  const recentBookings = BookingService.getRecent();
  const pendingWorkers = WorkerService.getPending();
  const { toast } = useToast();

  const handleApproveWorker = (workerId: string) => {
    WorkerService.update(workerId, { status: "Active" });
    toast({
      title: "Worker Approved",
      description: "Worker has been approved successfully.",
    });
  };

  const handleRejectWorker = (workerId: string) => {
    WorkerService.update(workerId, { status: "Rejected" });
    toast({
      title: "Worker Rejected",
      description: "Worker has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
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
          <WorkerCategoryChart data={stats.workersByCategory} />
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
