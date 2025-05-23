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
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 11;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    
    // Create more vibrant colors based on the fill color
    const fillColor = typeof fill === 'string' ? fill : '#888';
    
    return (
      <g>
        {/* Inner segment */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          strokeWidth={2}
          stroke="#fff"
        />
        
        {/* Outer highlight */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={outerRadius + 3}
          outerRadius={outerRadius + 7}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.3}
        />
        
        {/* Pulse animation on active segment */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 4}
          outerRadius={innerRadius - 1}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.8}
        />
        
        {/* Subtle connecting line */}
        <path 
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} 
          stroke={fillColor} 
          strokeWidth={1.5}
          fill="none" 
          strokeDasharray="3,3"
        />
        
        {/* Endpoint circle */}
        <circle 
          cx={ex} 
          cy={ey} 
          r={3} 
          fill={fillColor} 
          stroke="#fff" 
          strokeWidth={1.5}
          style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))' }}
        />
        
        {/* Data label */}
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={-12}
          textAnchor={textAnchor}
          fill="#333"
          fontSize={12}
          fontWeight="bold"
        >
          {payload.name}
        </text>
        
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={4}
          textAnchor={textAnchor}
          fill="#666"
          fontSize={11}
        >
          {`${value} workers`}
        </text>
        
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={19}
          textAnchor={textAnchor}
          fill="#888"
          fontSize={10}
        >
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-xs bg-yellow-100 px-3 py-1.5 rounded-full text-yellow-800 border border-yellow-200 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

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
        {/* Modern Interactive Pie Chart */}
        <Card className="p-6 flex flex-col shadow-md border border-gray-100 bg-white" style={{ overflow: 'visible' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Workers by Category</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Last 30 days</span>
            </div>
          </div>
          {stats.workersByCategory && stats.workersByCategory.length > 0 ? (
            <div className="relative flex flex-col items-center pie-chart-container">
              <div className="relative h-80 w-full" style={{ position: 'relative', overflow: 'visible' }}>
                <ResponsiveContainer width="100%" height="100%" className="flex items-center justify-center" style={{ overflow: 'visible' }}>
                  <PieChart>
                    <defs>
                      {stats.workersByCategory.map((entry, index) => (
                        <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                      <filter id="shadow" height="200%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.2" />
                      </filter>
                    </defs>
                    <Pie
                      data={stats.workersByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={({ index }) => (activeIndex === index ? 130 : 120)}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive={true}
                      animationBegin={200}
                      animationDuration={800}
                      onMouseEnter={(_, idx) => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      paddingAngle={3}
                    >
                      {stats.workersByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#colorGradient-${index})`}
                          stroke="#fff"
                          strokeWidth={2}
                          style={{ 
                            filter: 'url(#shadow)',
                            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="custom-tooltip bg-white p-3 rounded-lg shadow-xl border border-gray-100 backdrop-blur-md relative z-50">
                              <p className="font-semibold" style={{ color: data.color }}>{data.name}</p>
                              <p className="text-sm text-gray-600">{`${data.value} workers (${((data.value / (stats.totalWorkers || stats.workers)) * 100).toFixed(1)}%)`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      wrapperStyle={{ 
                        outline: 'none',
                        zIndex: 9999,
                        position: 'relative'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Centered label in the middle of the pie chart */}
                <div 
                  className="absolute bg-white rounded-full shadow-inner flex flex-col items-center justify-center" 
                  style={{
                    width: '160px',
                    height: '160px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
                    pointerEvents: 'none' // Allows interaction with chart elements beneath
                  }}
                >
                  <div className="text-4xl font-bold text-yellow-600 animate-pulse-subtle">
                    {stats.totalWorkers || stats.workers}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">Total Workers</div>
                </div>
              </div>
              {/* Interactive Legend */}
              <div className="flex flex-wrap justify-center mt-6 gap-4 legend-animate">
                {stats.workersByCategory.map((entry, idx) => (
                  <div 
                    key={entry.name} 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-transform hover:scale-105"
                    style={{ 
                      backgroundColor: `${entry.color}20`,
                      border: activeIndex === idx ? `2px solid ${entry.color}` : '2px solid transparent'
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: entry.color }}
                    >
                      {entry.name}
                    </span>
                    <span className="text-xs text-gray-600">
                      {((entry.value / (stats.totalWorkers || stats.workers)) * 100).toFixed(0)}%
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

        {/* Enhanced Area Chart with Animations and Gradients */}
        <Card className="p-6 shadow-md border border-gray-100 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Booking Trends</h2>
            <div className="flex items-center gap-2 bg-indigo-50 rounded-full px-3 py-1">
              <button className="text-xs text-indigo-700 font-medium hover:text-indigo-900">Weekly</button>
              <span className="text-gray-300">|</span>
              <button className="text-xs text-indigo-500 font-medium hover:text-indigo-900">Monthly</button>
              <span className="text-gray-300">|</span>
              <button className="text-xs text-indigo-500 font-medium hover:text-indigo-900">Yearly</button>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: 'Jan', bookings: 18, target: 15 },
                  { month: 'Feb', bookings: 24, target: 22 },
                  { month: 'Mar', bookings: 31, target: 28 },
                  { month: 'Apr', bookings: 32, target: 30 },
                  { month: 'May', bookings: 48, target: 32 },
                  { month: 'Jun', bookings: 62, target: 40 },
                  { month: 'Jul', bookings: 75, target: 50 },
                ]}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fcd34d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fcd34d" stopOpacity={0.1} />
                  </linearGradient>
                  <filter id="shadow-area" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
                  </filter>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-sm relative z-50">
                          <p className="font-bold text-gray-700">{label}</p>
                          <p className="text-indigo-600 font-medium">
                            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                            Bookings: {payload[0].value}
                          </p>
                          <p className="text-yellow-600 font-medium">
                            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                            Target: {payload[1].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  wrapperStyle={{ outline: 'none', zIndex: 9999 }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBookings)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1500}
                  style={{ filter: 'url(#shadow-area)' }}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#fcd34d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0.2}
                  fill="url(#colorTarget)"
                  animationDuration={2000}
                  animationBegin={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-600 px-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>22% growth vs last quarter</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span>50% above target</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="p-6 mb-10 shadow-md border border-gray-100 bg-white overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              Last 24 hours
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-indigo-200 text-indigo-600 rounded-full px-4 py-1 font-medium hover:bg-indigo-600 hover:text-white transition-colors"
            onClick={() => navigate('/bookings')}
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date/Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-indigo-50/60 transition group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          booking.serviceName.includes("Cleaning") ? "bg-blue-100 text-blue-700" :
                          booking.serviceName.includes("Cook") ? "bg-green-100 text-green-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {booking.serviceName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">
                          {booking.serviceName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-800">
                          {booking.customerName.split(' ').map(name => name[0]).join('')}
                        </div>
                        {booking.customerName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex flex-col">
                        <span>{new Date(booking.serviceDate).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">{booking.serviceTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : booking.status === 'Completed'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : booking.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
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
      <Card className="p-6 mb-10 shadow-md border border-gray-100 bg-white overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Recent Worker Applications</h2>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
              {pendingWorkers.length} pending
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="border-yellow-200 bg-yellow-50 text-yellow-700 rounded-full px-4 py-1 font-medium hover:bg-yellow-500 hover:text-white transition-colors"
            onClick={() => navigate('/worker-management')}
          >
            Manage Workers
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Experience</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingWorkers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No pending approvals
                  </td>
                </tr>
              ) : (
                pendingWorkers.slice(0, 5).map((worker) => (
                  <tr key={worker.id} className="hover:bg-yellow-50/70 transition group">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {worker.photoUrl ? (
                        <img
                          src={worker.photoUrl}
                          alt={worker.fullName}
                          className="h-9 w-9 rounded-full object-cover border-2 border-yellow-200 group-hover:border-yellow-400 transition-colors"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center font-bold text-white border-2 border-yellow-200 group-hover:border-yellow-400 transition-colors shadow-sm">
                          {worker.fullName.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800 group-hover:text-yellow-700 transition-colors">
                          {worker.fullName}
                        </div>
                        <div className="text-xs text-gray-500">{worker.email || 'No email provided'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {worker.serviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-600 font-medium">{worker.experience}</span> years
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(worker.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors rounded-md"
                          onClick={() => approveWorker(worker.id)}
                        >
                          <CheckCircle2 size={14} className="mr-1" />
                          <span className="text-xs">Approve</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors rounded-md"
                          onClick={() => rejectWorker(worker.id)}
                        >
                          <XCircle size={14} className="mr-1" />
                          <span className="text-xs">Reject</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pendingWorkers.length > 5 && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
                onClick={() => navigate('/worker-management')}
              >
                View {pendingWorkers.length - 5} more pending approvals
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6"/></svg>
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
      className={`flex flex-col justify-between h-36 p-5 rounded-xl shadow-md border ${
        isHighlighted ? 'border-yellow-300' : 'border-gray-100'
      } bg-white`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-full ${bgColor}`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold">{formatValue()}</div>
        <div className="text-sm text-gray-500">{title}</div>
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
