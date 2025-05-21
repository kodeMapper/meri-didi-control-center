
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Stats, Worker, WorkerStatus, Booking, NotificationType, CategoryStat } from '@/types';
import { WorkerService, BookingService, NotificationService, StatsService } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [pendingWorkers, setPendingWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get stats
        const statsData = StatsService.getStats();
        setStats(statsData);
        
        // Get recent bookings
        const recentBookingsData = BookingService.getRecent(5);
        setRecentBookings(recentBookingsData);
        
        // Get pending workers
        const pendingWorkersData = WorkerService.getPending();
        setPendingWorkers(pendingWorkersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);
  
  const approveWorker = (workerId: string) => {
    // Update worker status
    WorkerService.update(workerId, { status: "Active" as WorkerStatus });
    
    // Remove from pending workers list
    setPendingWorkers(prev => prev.filter(w => w.id !== workerId));
    
    // Send notification
    NotificationService.create({
      type: "Profile Activated" as NotificationType,
      title: "Worker Profile Activated",
      message: "Your profile has been approved and activated.",
      read: false,
      userType: "Worker",
      userIdentifier: workerId
    });
    
    toast({
      title: "Worker Approved",
      description: "Worker has been approved successfully.",
    });
  };
  
  const rejectWorker = (workerId: string) => {
    // Update worker status
    WorkerService.update(workerId, { status: "Rejected" as WorkerStatus });
    
    // Remove from pending workers list
    setPendingWorkers(prev => prev.filter(w => w.id !== workerId));
    
    // Send notification
    NotificationService.create({
      type: "Application Rejected" as NotificationType,
      title: "Worker Application Rejected",
      message: "Your application has been reviewed and rejected.",
      read: false,
      userType: "Worker",
      userIdentifier: workerId
    });
    
    toast({
      title: "Worker Rejected",
      description: "Worker has been rejected.",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Failed to load dashboard data.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Workers"
          value={stats.totalWorkers || stats.workers}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          change={stats.growthRates?.workers}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        
        <StatsCard 
          title="Total Bookings"
          value={stats.bookings}
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          change={stats.growthRates?.bookings}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        
        <StatsCard 
          title="Total Earnings"
          value={stats.earnings}
          isCurrency={true}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          change={stats.growthRates?.earnings}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        
        <StatsCard 
          title="Pending Approvals"
          value={stats.pendingApprovals || pendingWorkers.length}
          icon={<Clock className="h-5 w-5 text-yellow-600" />}
          bgColor="bg-yellow-50"
          textColor="text-yellow-600"
          isHighlighted={pendingWorkers.length > 0}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Bookings Section */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Recent Bookings</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/bookings')}>
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentBookings.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No bookings found
                </div>
              ) : (
                recentBookings.map(booking => (
                  <div key={booking.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{booking.serviceName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.serviceDate).toLocaleDateString()} at {booking.serviceTime}
                      </p>
                      <p className="text-xs text-gray-400">
                        {booking.customerName}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-sm px-2 py-1 rounded ${
                        booking.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                        booking.status === "Completed" ? "bg-green-100 text-green-800" :
                        booking.status === "Cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {booking.status}
                      </span>
                      <span className="font-medium mt-1">₹{booking.amount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
        
        {/* Workers by Category Chart */}
        <div>
          <Card className="p-4 h-full">
            <h2 className="text-lg font-medium mb-4">Workers by Category</h2>
            
            {stats.workersByCategory && stats.workersByCategory.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.workersByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {stats.workersByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} workers`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No data available
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Pending Worker Approvals Section */}
      <div className="mb-8">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Pending Worker Approvals</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/worker-management')}>
              Manage Workers
            </Button>
          </div>
          
          <div className="space-y-4">
            {pendingWorkers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No pending approvals
              </div>
            ) : (
              pendingWorkers.slice(0, 3).map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                      {worker.photoUrl ? (
                        <img src={worker.photoUrl} alt={worker.fullName} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        worker.fullName.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{worker.fullName}</p>
                      <p className="text-sm">{worker.serviceType} • {worker.experience} years exp</p>
                      <p className="text-xs text-gray-500">{new Date(worker.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                      onClick={() => approveWorker(worker.id)}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                      onClick={() => rejectWorker(worker.id)}
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
            
            {pendingWorkers.length > 3 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/worker-management')}
                >
                  View {pendingWorkers.length - 3} more pending approvals
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
  isCurrency?: boolean;
  bgColor: string;
  textColor: string;
  isHighlighted?: boolean;
}

function StatsCard({ title, value, icon, change, isCurrency = false, bgColor, textColor, isHighlighted = false }: StatsCardProps) {
  const formatValue = () => {
    if (isCurrency) {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };
  
  return (
    <Card className={`p-6 ${isHighlighted ? 'border-yellow-500 ring-1 ring-yellow-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-2">{formatValue()}</p>
        </div>
        <div className={`p-2 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center mt-4">
          <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={16} className="mr-1" />
            <span className="text-sm font-medium">{change}%</span>
          </div>
          <span className="text-xs text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </Card>
  );
}
