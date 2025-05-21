import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Stats, Worker, WorkerStatus, Booking, NotificationType } from '@/types';
import { WorkerService, BookingService, NotificationService, StatsService } from '@/services/mockDatabase';
import { Button } from '@/components/ui/button';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Sector,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [pendingWorkers, setPendingWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const statsData = StatsService.getStats();
        setStats(statsData);

        const recentBookingsData = BookingService.getRecent(5);
        setRecentBookings(recentBookingsData);

        const pendingWorkersData = WorkerService.getPending();
        setPendingWorkers(pendingWorkersData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const approveWorker = (workerId: string) => {
    WorkerService.update(workerId, { status: 'Active' as WorkerStatus });
    setPendingWorkers((prev) => prev.filter((w) => w.id !== workerId));
    NotificationService.create({
      type: 'Profile Activated' as NotificationType,
      title: 'Worker Profile Activated',
      message: 'Your profile has been approved and activated.',
      read: false,
      userType: 'Worker',
      userIdentifier: workerId,
    });
    toast({
      title: 'Worker Approved',
      description: 'Worker has been approved successfully.',
    });
  };

  const rejectWorker = (workerId: string) => {
    WorkerService.update(workerId, { status: 'Rejected' as WorkerStatus });
    setPendingWorkers((prev) => prev.filter((w) => w.id !== workerId));
    NotificationService.create({
      type: 'Application Rejected' as NotificationType,
      title: 'Worker Application Rejected',
      message: 'Your application has been reviewed and rejected.',
      read: false,
      userType: 'Worker',
      userIdentifier: workerId,
    });
    toast({
      title: 'Worker Rejected',
      description: 'Worker has been rejected.',
      variant: 'destructive',
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

  // Enhanced Pie Chart render function for active slice
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          dy={8}
          textAnchor="middle"
          fill="#333"
          fontSize={22}
          fontWeight={700}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="#888"
          fontSize={14}
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 14}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.2}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${value} workers`}</text>
      </g>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-[#fcfcf7] min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Overview of your platform's performance and activities
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Total Workers"
          value={stats.totalWorkers || stats.workers}
          icon={<Users className="h-7 w-7 text-blue-500" />}
          change={stats.growthRates?.workers}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pendingApprovals || pendingWorkers.length}
          icon={<UserCheck className="h-7 w-7 text-red-500" />}
          bgColor="bg-red-50"
          textColor="text-red-600"
          isHighlighted={pendingWorkers.length > 0}
        />
        <StatsCard
          title="Today's Bookings"
          value={stats.bookings}
          icon={<Calendar className="h-7 w-7 text-indigo-500" />}
          change={stats.growthRates?.bookings}
          bgColor="bg-indigo-50"
          textColor="text-indigo-600"
        />
        <StatsCard
          title="Price Updates"
          value={3}
          icon={<DollarSign className="h-7 w-7 text-green-500" />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Enhanced Donut Chart */}
        <Card className="p-6 flex flex-col items-center shadow-lg card-animate">
          <h2 className="text-lg font-semibold mb-6">Workers by Category</h2>
          {stats.workersByCategory && stats.workersByCategory.length > 0 ? (
            <div className="relative flex flex-col items-center">
              <div className="h-72 w-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.workersByCategory}
                      cx="50%"
                      cy="50%"
                      outerRadius={({ index }) => (activeIndex === index ? 120 : 110)}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={true}
                      onMouseEnter={(_, idx) => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                      label={({ percent }) =>
                        percent > 0.08 ? `${(percent * 100).toFixed(0)}%` : ''
                      }
                      labelLine={false}
                    >
                      {stats.workersByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          style={{ transition: 'all 0.3s' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} workers`, name]} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-3xl font-bold text-gray-700 animate-fadein">
                    {stats.totalWorkers || stats.workers}
                  </div>
                  <div className="text-xs text-gray-400">Total Workers</div>
                </div>
              </div>
              {/* Modern Legend */}
              <div className="flex flex-wrap justify-center mt-6 gap-6 legend-animate">
                {stats.workersByCategory.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="inline-block w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span
                      className="text-base font-medium"
                      style={{ color: entry.color }}
                    >
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </Card>

        {/* Booking Trends Area Chart */}
        <Card className="p-6 shadow-lg card-animate">
          <h2 className="text-lg font-semibold mb-6">Booking Trends</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: 'Jan', bookings: 18 },
                  { month: 'Feb', bookings: 24 },
                  { month: 'Mar', bookings: 31 },
                  { month: 'Apr', bookings: 32 },
                  { month: 'May', bookings: 48 },
                  { month: 'Jun', bookings: 62 },
                  { month: 'Jul', bookings: 75 },
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="p-6 mb-10 shadow-lg table-animate">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Bookings</h2>
          <Button
            variant="outline"
            size="sm"
            className="border-indigo-500 text-indigo-600 rounded-full px-4 py-1 font-semibold hover:bg-indigo-500 hover:text-white transition"
            onClick={() => navigate('/bookings')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-semibold">Service</th>
                <th className="px-4 py-2 text-left font-semibold">Customer</th>
                <th className="px-4 py-2 text-left font-semibold">Date/Time</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-indigo-50 transition">
                    <td className="px-4 py-2">{booking.serviceName}</td>
                    <td className="px-4 py-2">{booking.customerName}</td>
                    <td className="px-4 py-2">
                      {new Date(booking.serviceDate).toLocaleDateString()}{' '}
                      {booking.serviceTime}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : booking.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium">
                      ₹{booking.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Worker Applications Table */}
      <Card className="p-6 mb-10 shadow-lg table-animate">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Worker Applications</h2>
          <Button
            variant="ghost"
            size="sm"
            className="border-indigo-500 text-indigo-600 rounded-full px-4 py-1 font-semibold hover:bg-indigo-500 hover:text-white transition"
            onClick={() => navigate('/worker-management')}
          >
            Manage Workers
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Category</th>
                <th className="px-4 py-2 text-left font-semibold">Experience</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingWorkers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No pending approvals
                  </td>
                </tr>
              ) : (
                pendingWorkers.slice(0, 5).map((worker) => (
                  <tr key={worker.id} className="hover:bg-green-50 transition">
                    <td className="px-4 py-2 flex items-center gap-2">
                      {worker.photoUrl ? (
                        <img
                          src={worker.photoUrl}
                          alt={worker.fullName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                          {worker.fullName.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span>{worker.fullName}</span>
                    </td>
                    <td className="px-4 py-2">{worker.serviceType}</td>
                    <td className="px-4 py-2">{worker.experience} yrs</td>
                    <td className="px-4 py-2">
                      {new Date(worker.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                          onClick={() => approveWorker(worker.id)}
                        >
                          <CheckCircle2 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                          onClick={() => rejectWorker(worker.id)}
                        >
                          <XCircle size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pendingWorkers.length > 5 && (
            <div className="text-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/worker-management')}
              >
                View {pendingWorkers.length - 5} more pending approvals
              </Button>
            </div>
          )}
        </div>
      </Card>
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

function StatsCard({
  title,
  value,
  icon,
  change,
  isCurrency = false,
  bgColor,
  textColor,
  isHighlighted = false,
}: StatsCardProps) {
  const formatValue = () => {
    if (isCurrency) {
      return `₹${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  return (
    <Card
      className={`flex flex-col justify-between h-36 p-5 rounded-xl shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg bg-white ${
        isHighlighted ? 'border-yellow-400 ring-2 ring-yellow-200' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold mt-2">{formatValue()}</div>
        <div className="text-sm text-gray-500">{title}</div>
        {change !== undefined && (
          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {change >= 0 ? '+' : ''}
            {change}%
          </span>
        )}
      </div>
    </Card>
  );
}

// Add this CSS to your global styles or in a <style jsx global> block:
/*
.card-animate {
  transition: box-shadow 0.3s, transform 0.3s;
}
.card-animate:hover {
  box-shadow: 0 8px 32px 0 rgba(60,60,120,0.15);
  transform: translateY(-2px) scale(1.02);
}
.table-animate tbody tr {
  transition: background 0.2s;
}
.table-animate tbody tr:hover {
  background: #f0f4ff;
}
.legend-animate > div {
  opacity: 0;
  animation: fadein 0.7s forwards;
}
.legend-animate > div:nth-child(1) { animation-delay: 0.1s; }
.legend-animate > div:nth-child(2) { animation-delay: 0.2s; }
.legend-animate > div:nth-child(3) { animation-delay: 0.3s; }
.legend-animate > div:nth-child(4) { animation-delay: 0.4s; }
@keyframes fadein {
  to { opacity: 1; }
}
.animate-fadein {
  animation: fadein 1s;
}
*/
