import { useState, useEffect } from "react";
import { Worker, ServiceType } from "@/types";
import { WorkerService } from "@/services/mockDatabase";
import { WorkerAPI } from "@/services/api-service";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Edit, 
  CheckCircle, 
  Trash, 
  User, 
  X, 
  Check, 
  Search,
  Filter,
  Download,
  Upload,
  Users,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Plus,
  Eye,
  MoreVertical,
  AlertTriangle,
  TrendingUp,
  Activity,
  Grid3X3,
  List
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PendingWorkersList } from "@/components/dashboard/PendingWorkersList";
import { WorkerProfile } from "@/components/worker/WorkerProfile";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  supabase, 
  getWorkerApplications,
  getWorkersFromApplications,
  updateWorkerApplicationStatus,
  deleteWorkerApplication,
  addNotification
} from "@/lib/supabase";
import { APIDebugComponent } from "@/components/debug/APIDebugComponent";

function WorkerManagement() {
  const [activeWorkers, setActiveWorkers] = useState<Worker[]>([]);
  const [inactiveWorkers, setInactiveWorkers] = useState<Worker[]>([]);
  const [pendingWorkers, setPendingWorkers] = useState<Worker[]>([]);
  const [rejectedWorkers, setRejectedWorkers] = useState<Worker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workerToCopy, setWorkerToCopy] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiConnectionStatus, setApiConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check API connection status first
    const checkApiConnection = async () => {
      setApiConnectionStatus('checking');
      const isConnected = await WorkerAPI.testConnection();
      setApiConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      // Load workers from database
      loadWorkers();
    };
    
    checkApiConnection();
  }, []);
  
  const loadWorkers = async () => {
    setIsLoading(true);
    try {
      // Check if API is connected
      if (apiConnectionStatus === 'connected' || await WorkerAPI.testConnection()) {
        // If connected or wasn't checked yet, try to load from API
        setApiConnectionStatus('connected');
        
        // Load all workers from the new API
        const allWorkers = await WorkerAPI.getAllWorkers();
        
        // Filter workers by status
        setActiveWorkers(allWorkers.filter(worker => worker.status === 'Active'));
        setInactiveWorkers(allWorkers.filter(worker => worker.status === 'Inactive'));
        setPendingWorkers(allWorkers.filter(worker => worker.status === 'Pending'));
        setRejectedWorkers(allWorkers.filter(worker => worker.status === 'Rejected'));
        
        return; // Successfully loaded from API, no need for fallbacks
      } else {
        // API is not connected, mark as disconnected and continue to fallbacks
        setApiConnectionStatus('disconnected');
        throw new Error('API is not connected');
      }
    } catch (error) {
      console.error("Error loading workers from API:", error);
      setApiConnectionStatus('disconnected');
      
      // Only show toast for unexpected errors, not for known API disconnection
      if (error.message !== 'API is not connected') {
        toast({
          title: "API Error",
          description: "Failed to load workers data from API, using fallback sources.",
          variant: "destructive",
        });
      }
      
      try {
        // Try Supabase as first fallback
        const activeWorkersData = await getWorkersFromApplications('Active');
        setActiveWorkers(activeWorkersData);
        
        const inactiveWorkersData = await getWorkersFromApplications('Inactive');
        setInactiveWorkers(inactiveWorkersData);
        
        const pendingWorkersData = await getWorkersFromApplications('Pending');
        setPendingWorkers(pendingWorkersData);
        
        const rejectedWorkersData = await getWorkersFromApplications('Rejected');
        setRejectedWorkers(rejectedWorkersData);
        
        toast({
          title: "Using Supabase",
          description: "Loading workers from Supabase as API is unavailable.",
        });
      } catch (supabaseError) {
        console.error("Error loading from Supabase fallback:", supabaseError);
        
        // Fallback to mock database as last resort
        setActiveWorkers(WorkerService.getActive());
        setInactiveWorkers(WorkerService.getInactive());
        setPendingWorkers(WorkerService.getPending());
        setRejectedWorkers(WorkerService.getRejected());
        
        toast({
          title: "Using Mock Database",
          description: "Loading workers from mock database as API and Supabase are unavailable.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced filtering with search and sort
  const getFilteredAndSortedWorkers = (workers: Worker[]) => {
    let filtered = workers;
    
    // Filter by category
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(worker => worker.serviceType === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(worker => 
        worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort workers
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "name":
          aValue = a.fullName || "";
          bValue = b.fullName || "";
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "bookings":
          aValue = a.totalBookings || 0;
          bValue = b.totalBookings || 0;
          break;
        case "experience":
          aValue = a.experience || 0;
          bValue = b.experience || 0;
          break;
        case "joinDate":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.fullName || "";
          bValue = b.fullName || "";
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  };

  // Helper function to refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Check API connection first
    const isConnected = await WorkerAPI.testConnection();
    setApiConnectionStatus(isConnected ? 'connected' : 'disconnected');
    
    await loadWorkers();
    setIsRefreshing(false);
    toast({
      title: "Data Refreshed",
      description: isConnected ? 
        "Worker data has been updated from the API." : 
        "Worker data has been updated from fallback sources.",
      variant: "default"
    });
  };

  // Export functionality
  const handleExport = () => {
    try {
      const allWorkers = [...activeWorkers, ...inactiveWorkers, ...pendingWorkers, ...rejectedWorkers];
      const csvContent = [
        // CSV Headers
        'ID,Name,Email,Phone,Service Type,Experience,Status,Rating,Total Bookings,Join Date,Location',
        // CSV Data
        ...allWorkers.map(worker => [
          worker.id,
          worker.fullName || '',
          worker.email || '',
          worker.phone || '',
          worker.serviceType || '',
          worker.experience || '',
          worker.status,
          worker.rating || '0',
          worker.totalBookings || '0',
          new Date(worker.createdAt).toLocaleDateString(),
          worker.city || ''
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `workers_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Worker data has been exported to CSV file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export worker data.",
        variant: "destructive",
      });
    }
  };

  // Bulk operations
  const handleBulkActivate = async () => {
    setActionInProgress('activating');
    try {
      for (const workerId of bulkSelected) {
        await updateWorkerApplicationStatus(workerId, 'Active');
        WorkerService.update(workerId, { status: "Active" });
      }
      setBulkSelected([]);
      await loadWorkers();
      toast({
        title: "Bulk Activation Complete",
        description: `${bulkSelected.length} workers have been activated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate some workers",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleBulkDeactivate = async () => {
    setActionInProgress('deactivating');
    try {
      for (const workerId of bulkSelected) {
        await updateWorkerApplicationStatus(workerId, 'Inactive');
        WorkerService.update(workerId, { status: "Inactive" });
      }
      setBulkSelected([]);
      await loadWorkers();
      toast({
        title: "Bulk Deactivation Complete",
        description: `${bulkSelected.length} workers have been deactivated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate some workers",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const toggleBulkSelection = (workerId: string) => {
    setBulkSelected(prev => 
      prev.includes(workerId) 
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const selectAllWorkers = (workers: Worker[]) => {
    const workerIds = workers.map(w => w.id);
    setBulkSelected(prev => 
      prev.length === workerIds.length ? [] : workerIds
    );
  };

  const handleViewWorker = (id: string) => {
    setSelectedWorkerId(id);
    setIsProfileOpen(true);
  };

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setWorkerToCopy(id);
    setIsCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
      setWorkerToCopy(null);
    }, 2000);
  };

  const handleActivateWorker = async (id: string) => {
    setActionInProgress('activating');
    try {
      // Update via the new API
      const success = await WorkerAPI.approveWorker(id);
      if (!success) {
        throw new Error("Failed to activate worker");
      }

      // Try to update in Supabase as fallback/compatibility
      try {
        await updateWorkerApplicationStatus(id, 'Active');
        // Also update in mock database for compatibility
        WorkerService.update(id, { status: "Active" });
      } catch (fallbackError) {
        console.log("Fallback update not critical, continuing:", fallbackError);
      }
      
      // Try to send notification
      try {
        await addNotification({
          type: "Worker Verified",
          message: "Your profile has been activated. You can now receive bookings.",
          title: "Profile Activated",
          read: false,
          user_type: "Worker",
          user_identifier: id
        });
      } catch (notificationError) {
        console.log("Notification sending failed, continuing:", notificationError);
      }
      
      toast({
        title: "Worker Activated",
        description: "Worker has been activated successfully.",
      });
      
      // Refresh worker lists
      await loadWorkers();
    } catch (error) {
      console.error("Error activating worker:", error);
      toast({
        title: "Error",
        description: "Failed to activate worker",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeactivateWorker = async (id: string) => {
    setActionInProgress('deactivating');
    try {
      // Update via the new API
      const success = await WorkerAPI.deactivateWorker(id);
      if (!success) {
        throw new Error("Failed to deactivate worker");
      }

      // Try to update in Supabase as fallback/compatibility
      try {
        await updateWorkerApplicationStatus(id, 'Inactive');
        // Also update in mock database for compatibility
        WorkerService.update(id, { status: "Inactive" });
      } catch (fallbackError) {
        console.log("Fallback update not critical, continuing:", fallbackError);
      }
      
      // Try to send notification
      try {
        await addNotification({
          type: "Worker Verified",
          message: "Your profile has been deactivated. You will not receive new bookings until your profile is activated again.",
          title: "Profile Deactivated",
          read: false,
          user_type: "Worker",
          user_identifier: id
        });
      } catch (notificationError) {
        console.log("Notification sending failed, continuing:", notificationError);
      }
      
      toast({
        title: "Worker Deactivated",
        description: "Worker has been deactivated.",
      });
      
      // Refresh worker lists
      await loadWorkers();
    } catch (error) {
      console.error("Error deactivating worker:", error);
      toast({
        title: "Error",
        description: "Failed to deactivate worker",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleApproveWorker = async (workerId: string) => {
    setActionInProgress('approving');
    try {
      // Update via the new API
      const success = await WorkerAPI.approveWorker(workerId);
      if (!success) {
        throw new Error("Failed to approve worker");
      }

      // Try to update in Supabase as fallback/compatibility
      try {
        await updateWorkerApplicationStatus(workerId, 'Active');
        // Also update in mock database for compatibility
        WorkerService.update(workerId, { status: "Active" });
      } catch (fallbackError) {
        console.log("Fallback update not critical, continuing:", fallbackError);
      }
      
      // Try to send notification
      try {
        await addNotification({
          type: "Worker Verified",
          message: "Congratulations! Your application has been approved. You are now part of our team.",
          title: "Application Approved",
          read: false,
          user_type: "Worker",
          user_identifier: workerId
        });
      } catch (notificationError) {
        console.log("Notification sending failed, continuing:", notificationError);
      }
      
      toast({
        title: "Worker Approved",
        description: "Worker has been approved successfully.",
      });
      
      // Refresh worker lists
      await loadWorkers();
    } catch (error) {
      console.error("Error approving worker:", error);
      toast({
        title: "Error",
        description: "Failed to approve worker",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRejectWorker = async (workerId: string) => {
    setActionInProgress('rejecting');
    try {
      // Update via the new API
      const success = await WorkerAPI.rejectWorker(workerId);
      if (!success) {
        throw new Error("Failed to reject worker");
      }

      // Try to update in Supabase as fallback/compatibility
      try {
        await updateWorkerApplicationStatus(workerId, 'Rejected');
        // Also update in mock database for compatibility
        WorkerService.update(workerId, { status: "Rejected" });
      } catch (fallbackError) {
        console.log("Fallback update not critical, continuing:", fallbackError);
      }
      
      // Try to send notification
      try {
        await addNotification({
          type: "Worker Verified",
          message: "We regret to inform you that your application has been rejected. Thank you for your interest.",
          title: "Application Rejected",
          read: false,
          user_type: "Worker",
          user_identifier: workerId
        });
      } catch (notificationError) {
        console.log("Notification sending failed, continuing:", notificationError);
      }
      
      toast({
        title: "Worker Rejected",
        description: "Worker has been rejected.",
        variant: "destructive",
      });
      
      // Refresh worker lists
      await loadWorkers();
    } catch (error) {
      console.error("Error rejecting worker:", error);
      toast({
        title: "Error",
        description: "Failed to reject worker",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleConfirmDeleteWorker = async () => {
    if (!selectedWorkerId) return;
    
    try {
      // Delete via the new API
      const success = await WorkerAPI.deleteWorker(selectedWorkerId);
      if (!success) {
        throw new Error("Failed to delete worker");
      }

      // Try to delete from Supabase as fallback/compatibility
      try {
        await deleteWorkerApplication(selectedWorkerId);
        // Also delete from mock database for compatibility
        WorkerService.delete(selectedWorkerId);
      } catch (fallbackError) {
        console.log("Fallback delete not critical, continuing:", fallbackError);
      }
      
      toast({
        title: "Worker Deleted",
        description: "Worker has been permanently deleted.",
        variant: "destructive",
      });
      
      // Close dialog and refresh
      setIsDeleteDialogOpen(false);
      setSelectedWorkerId(null);
      
      // Refresh worker lists
      await loadWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast({
        title: "Error",
        description: "Failed to delete worker",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleShowDeleteDialog = (id: string) => {
    setSelectedWorkerId(id);
    setIsDeleteDialogOpen(true);
  };

  // Safe helper to get initials from a name
  const getInitials = (fullName: string | undefined): string => {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((n) => n[0] || "")
      .join("")
      .toUpperCase();
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-yellow-500" />
          <p className="text-gray-500">Loading worker data...</p>
        </div>
      </div>
    );
  }

  // Statistics calculation
  const totalWorkers = activeWorkers.length + inactiveWorkers.length;
  const averageRating = totalWorkers > 0 
    ? [...activeWorkers, ...inactiveWorkers]
        .reduce((sum, worker) => sum + (worker.rating || 0), 0) / totalWorkers 
    : 0;
  const totalBookings = [...activeWorkers, ...inactiveWorkers]
    .reduce((sum, worker) => sum + (worker.totalBookings || 0), 0);

  // Get current workers for display
  const getCurrentWorkers = (tab: string) => {
    switch (tab) {
      case "active": return getFilteredAndSortedWorkers(activeWorkers);
      case "inactive": return getFilteredAndSortedWorkers(inactiveWorkers);
      case "pending": return getFilteredAndSortedWorkers(pendingWorkers);
      case "rejected": return getFilteredAndSortedWorkers(rejectedWorkers);
      default: return [];
    }
  };

  // Mobile card component for responsive view
  const renderWorkerCard = (worker: Worker, showBulkSelect: boolean = false) => (
    <Card key={worker.id} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showBulkSelect && (
            <input
              type="checkbox"
              checked={bulkSelected.includes(worker.id)}
              onChange={() => toggleBulkSelection(worker.id)}
              className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
          )}
          {worker.photoUrl ? (
            <img 
              src={worker.photoUrl} 
              alt={worker.fullName}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-yellow-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center text-yellow-800 font-bold text-lg">
              {getInitials(worker.fullName)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{worker.fullName}</h3>
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusBadgeStyle(worker.status)} border-0`}
              >
                {worker.status === "Pending" && "⏳"}
                {worker.status === "Active" && "✅"}
                {worker.status === "Inactive" && "⚪"}
                {worker.status === "Rejected" && "❌"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 truncate flex items-center gap-1">
              <Mail size={12} />
              {worker.email}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500" />
                {worker.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {worker.totalBookings || 0} bookings
              </span>
              <span className="flex items-center gap-1">
                <Activity size={12} className="text-green-500" />
                {worker.experience}y exp
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 hover:bg-yellow-100"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handleViewWorker(worker.id)}
            >
              <Eye size={16} className="text-blue-500" /> 
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => navigate(`/edit-worker/${worker.id}`)}
            >
              <Edit size={16} className="text-green-500" /> 
              Edit Worker
            </DropdownMenuItem>
            {worker.status !== "Active" ? (
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-green-600" 
                onClick={() => handleActivateWorker(worker.id)}
              >
                <CheckCircle size={16} /> 
                Activate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-orange-600" 
                onClick={() => handleDeactivateWorker(worker.id)}
              >
                <X size={16} /> 
                Deactivate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 cursor-pointer" 
              onClick={() => handleShowDeleteDialog(worker.id)}
            >
              <Trash size={16} /> 
              Delete Worker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );

  const renderWorkerRow = (worker: Worker, showBulkSelect: boolean = false) => (
    <TableRow key={worker.id} className="hover:bg-yellow-50/50 transition-colors group">
      {showBulkSelect && (
        <TableCell className="w-10">
          <input
            type="checkbox"
            checked={bulkSelected.includes(worker.id)}
            onChange={() => toggleBulkSelection(worker.id)}
            className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
          />
        </TableCell>
      )}
      <TableCell>
        <div 
          className="relative group/id cursor-pointer" 
          onClick={() => copyToClipboard(worker.id)}
        >
          <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
            #{worker.id.substring(0, 8)}...
          </span>
          <div className="absolute hidden group-hover/id:flex items-center gap-1 bg-black bg-opacity-90 text-white text-xs py-1 px-2 rounded -top-8 left-0 whitespace-nowrap z-10">
            {workerToCopy === worker.id && isCopied ? (
              <>
                <Check size={12} /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} /> Copy Full ID
              </>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {worker.photoUrl ? (
            <img 
              src={worker.photoUrl} 
              alt={worker.fullName}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-yellow-200"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center text-yellow-800 font-bold text-lg">
              {getInitials(worker.fullName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">{worker.fullName}</div>
            <div className="text-sm text-gray-500 truncate flex items-center gap-1">
              <Mail size={12} />
              {worker.email}
            </div>
            {worker.phone && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Phone size={10} />
                {worker.phone}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className="font-normal bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
        >
          {worker.serviceType || "Unknown"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Activity size={14} className="text-green-500" />
          <span className="font-medium">{worker.experience}</span>
          <span className="text-xs text-gray-500">years</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Badge 
            variant="outline" 
            className={`font-medium ${getStatusBadgeStyle(worker.status)} border-0`}
          >
            {worker.status === "Pending" && "⏳ Pending"}
            {worker.status === "Active" && "✅ Active"}
            {worker.status === "Inactive" && "⚪ Inactive"}
            {worker.status === "Rejected" && "❌ Rejected"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-current" />
          <span className="font-semibold text-yellow-600">
            {worker.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-xs text-gray-400">/5.0</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-blue-500" />
          <span className="font-medium text-blue-600">{worker.totalBookings || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-xs text-gray-500">
          {new Date(worker.createdAt).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 transition-opacity hover:bg-yellow-100"
            >
              <span className="sr-only">Open menu</span>
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handleViewWorker(worker.id)}
            >
              <Eye size={16} className="text-blue-500" /> 
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => navigate(`/edit-worker/${worker.id}`)}
            >
              <Edit size={16} className="text-green-500" /> 
              Edit Worker
            </DropdownMenuItem>
            {worker.status !== "Active" ? (
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-green-600" 
                onClick={() => handleActivateWorker(worker.id)}
              >
                <CheckCircle size={16} /> 
                Activate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-orange-600" 
                onClick={() => handleDeactivateWorker(worker.id)}
              >
                <X size={16} /> 
                Deactivate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600 cursor-pointer" 
              onClick={() => handleShowDeleteDialog(worker.id)}
            >
              <Trash size={16} /> 
              Delete Worker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-yellow-50 via-white to-orange-50 min-h-screen">
      {/* Debug Component - Remove in production */}
      <APIDebugComponent />
      
      {/* Enhanced Header Section with separated search & filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search and filters section */}
          <div className="flex flex-col sm:flex-row gap-3 items-start w-full md:w-2/3">
            <div className="relative w-full sm:w-auto sm:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search workers by name, email, service type, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[160px] bg-gray-50">
                  <Filter size={14} className="mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Driving">Driving</SelectItem>
                  <SelectItem value="Sweeping">Sweeping</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-gray-50">
                    <TrendingUp size={14} className="mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="bookings">Bookings</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="joinDate">Join Date</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-gray-50 px-2"
                  title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Action buttons section */}
          <div className="flex items-center gap-2 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 w-full md:w-auto md:ml-4 md:justify-end">
            {/* View Mode Toggle for Mobile */}
            <div className="flex md:hidden border rounded-md bg-gray-50 mr-auto">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none px-2"
              >
                <List size={14} />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-l-none px-2"
              >
                <Grid3X3 size={14} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`
                  ${apiConnectionStatus === 'connected' ? 'bg-green-50 text-green-600 border-green-200' : 
                    apiConnectionStatus === 'disconnected' ? 'bg-red-50 text-red-600 border-red-200' : 
                    'bg-yellow-50 text-yellow-600 border-yellow-200'}
                `}
              >
                {apiConnectionStatus === 'connected' ? 'API Connected' : 
                  apiConnectionStatus === 'disconnected' ? 'API Disconnected' : 
                  'Checking API...'}
              </Badge>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
              >
                <RefreshCw size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={handleExport}
            >
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-sm"
              onClick={() => navigate("/worker-registration")}
            >
              <Plus size={14} className="mr-1" />
              Add Worker
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Workers</p>
              <p className="text-2xl font-bold text-blue-700">{totalWorkers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Workers</p>
              <p className="text-2xl font-bold text-green-700">{activeWorkers.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{pendingWorkers.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Rating</p>
              <p className="text-2xl font-bold text-purple-700">{averageRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6 flex justify-center w-full overflow-hidden rounded-full p-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 shadow-inner">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            <TabsTrigger
              value="active"
              className="relative flex items-center justify-center rounded-full px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow data-[state=active]:font-semibold"
            >
              <CheckCircle size={12} className="mr-1 lg:mr-1.5" />
              <span className="hidden sm:inline">Active Workers</span>
              <span className="sm:hidden">Active</span>
              <span className="ml-1">({activeWorkers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="relative flex items-center justify-center rounded-full px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-600 data-[state=active]:shadow data-[state=active]:font-semibold"
            >
              <X size={12} className="mr-1 lg:mr-1.5" />
              <span className="hidden sm:inline">Inactive</span>
              <span className="sm:hidden">Inactive</span>
              <span className="ml-1">({inactiveWorkers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="relative flex items-center justify-center rounded-full px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-yellow-600 data-[state=active]:shadow data-[state=active]:font-semibold"
            >
              <AlertTriangle size={12} className="mr-1 lg:mr-1.5" />
              <span className="hidden sm:inline">Pending</span>
              <span className="sm:hidden">Pending</span>
              <span className="ml-1">({pendingWorkers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="relative flex items-center justify-center rounded-full px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow data-[state=active]:font-semibold"
            >
              <X size={12} className="mr-1 lg:mr-1.5" />
              <span className="hidden sm:inline">Rejected</span>
              <span className="sm:hidden">Rejected</span>
              <span className="ml-1">({rejectedWorkers.length})</span>
            </TabsTrigger>
          </div>
        </TabsList>
        
        <TabsContent value="active" className="mt-2">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Bulk Actions Bar */}
            {bulkSelected.length > 0 && (
              <div className="p-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">
                    {bulkSelected.length} worker{bulkSelected.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={handleBulkDeactivate}
                  >
                    <X size={14} className="mr-1" />
                    Deactivate Selected
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={() => setBulkSelected([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className={`overflow-x-auto ${viewMode === 'cards' ? 'hidden lg:block' : ''}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={bulkSelected.length === getCurrentWorkers("active").length && getCurrentWorkers("active").length > 0}
                        onChange={() => selectAllWorkers(getCurrentWorkers("active"))}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ratings</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentWorkers("active").length > 0 ? (
                    getCurrentWorkers("active").map((worker) => renderWorkerRow(worker, true))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <Users className="h-12 w-12 text-gray-300" />
                          <div className="text-gray-500">
                            <p className="font-medium">No active workers found</p>
                            <p className="text-sm">
                              {searchTerm ? 
                                `No results for "${searchTerm}"` : 
                                selectedCategory !== "All Categories" ? 
                                  `No workers in ${selectedCategory} category` :
                                  "Start by approving pending applications"
                              }
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className={`lg:hidden ${viewMode === 'table' ? 'hidden' : 'block'}`}>
              {bulkSelected.length > 0 && (
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => selectAllWorkers(getCurrentWorkers("active"))}
                    >
                      {bulkSelected.length === getCurrentWorkers("active").length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </div>
              )}
              <div className="p-4 space-y-3">
                {getCurrentWorkers("active").length > 0 ? (
                  getCurrentWorkers("active").map((worker) => renderWorkerCard(worker, true))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <div className="text-gray-500">
                      <p className="font-medium">No active workers found</p>
                      <p className="text-sm">
                        {searchTerm ? 
                          `No results for "${searchTerm}"` : 
                          selectedCategory !== "All Categories" ? 
                            `No workers in ${selectedCategory} category` :
                            "Start by approving pending applications"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-2">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Bulk Actions Bar for Inactive Workers */}
            {bulkSelected.length > 0 && (
              <div className="p-4 bg-green-50 border-b border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-700">
                    {bulkSelected.length} worker{bulkSelected.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={handleBulkActivate}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Activate Selected
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={() => setBulkSelected([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}

            {/* Desktop Table View */}
            <div className={`overflow-x-auto ${viewMode === 'cards' ? 'hidden lg:block' : ''}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        checked={bulkSelected.length === getCurrentWorkers("inactive").length && getCurrentWorkers("inactive").length > 0}
                        onChange={() => selectAllWorkers(getCurrentWorkers("inactive"))}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ratings</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentWorkers("inactive").length > 0 ? (
                    getCurrentWorkers("inactive").map((worker) => renderWorkerRow(worker, true))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <X className="h-12 w-12 text-gray-300" />
                          <div className="text-gray-500">
                            <p className="font-medium">No inactive workers found</p>
                            <p className="text-sm">
                              {searchTerm ? 
                                `No results for "${searchTerm}"` : 
                                selectedCategory !== "All Categories" ? 
                                  `No inactive workers in ${selectedCategory} category` :
                                  "All workers are currently active"
                              }
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className={`lg:hidden ${viewMode === 'table' ? 'hidden' : 'block'}`}>
              {bulkSelected.length > 0 && (
                <div className="p-4 border-b">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => selectAllWorkers(getCurrentWorkers("inactive"))}
                  >
                    {bulkSelected.length === getCurrentWorkers("inactive").length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              )}
              <div className="p-4 space-y-3">
                {getCurrentWorkers("inactive").length > 0 ? (
                  getCurrentWorkers("inactive").map((worker) => renderWorkerCard(worker, true))
                ) : (
                  <div className="text-center py-12">
                    <X className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <div className="text-gray-500">
                      <p className="font-medium">No inactive workers found</p>
                      <p className="text-sm">
                        {searchTerm ? 
                          `No results for "${searchTerm}"` : 
                          selectedCategory !== "All Categories" ? 
                            `No inactive workers in ${selectedCategory} category` :
                            "All workers are currently active"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Pending Worker Applications</h2>
            </div>
            {pendingWorkers.length > 0 ? (
              <div className="space-y-4">
                {pendingWorkers.map((worker) => (
                  <div key={worker.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        {worker.photoUrl ? (
                          <img 
                            src={worker.photoUrl} 
                            alt={worker.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-medium">
                            {getInitials(worker.fullName)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">
                            {worker.fullName}
                            <span 
                              className="ml-2 text-xs text-gray-500 cursor-pointer hover:underline"
                              onClick={() => copyToClipboard(worker.id)}
                            >
                              #{worker.id.substring(0, 8)}...
                            </span>
                          </h4>
                          <p className="text-sm text-gray-500">{worker.email}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm"><span className="font-medium">Service Type:</span> {worker.serviceType}</p>
                            <p className="text-sm"><span className="font-medium">Experience:</span> {worker.experience} years</p>
                            <p className="text-sm"><span className="font-medium">Location:</span> {worker.city}</p>
                            <p className="text-sm"><span className="font-medium">Applied on:</span> {new Date(worker.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-green-100 text-green-600 border border-green-200 hover:bg-green-200 hover:text-green-700"
                          onClick={() => handleApproveWorker(worker.id)}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 hover:text-red-700"
                          onClick={() => handleRejectWorker(worker.id)}
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewWorker(worker.id)}
                        >
                          <User size={16} className="mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium">About:</span> {worker.about}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No pending applications
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Rejected Worker Applications</h2>
            </div>
            {rejectedWorkers.length > 0 ? (
              <div className="space-y-4">
                {rejectedWorkers.map((worker) => (
                  <div key={worker.id} className="border border-red-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        {worker.photoUrl ? (
                          <img 
                            src={worker.photoUrl} 
                            alt={worker.fullName}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-medium">
                            {getInitials(worker.fullName)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">
                            {worker.fullName}
                            <span 
                              className="ml-2 text-xs text-gray-500 cursor-pointer hover:underline"
                              onClick={() => copyToClipboard(worker.id)}
                            >
                              #{worker.id.substring(0, 8)}...
                            </span>
                          </h4>
                          <p className="text-sm text-gray-500">{worker.email}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm"><span className="font-medium">Service Type:</span> {worker.serviceType}</p>
                            <p className="text-sm"><span className="font-medium">Experience:</span> {worker.experience} years</p>
                            <p className="text-sm"><span className="font-medium">Location:</span> {worker.city}</p>
                            <p className="text-sm"><span className="font-medium">Applied on:</span> {new Date(worker.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm"><span className="font-medium">Rejected on:</span> {new Date(worker.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-green-100 text-green-600 border border-green-200 hover:bg-green-200 hover:text-green-700"
                          onClick={() => handleApproveWorker(worker.id)}
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Reconsider
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 hover:text-red-700"
                          onClick={() => handleShowDeleteDialog(worker.id)}
                        >
                          <Trash size={16} className="mr-1" />
                          Delete
                        </Button>
                        <Button
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewWorker(worker.id)}
                        >
                          <User size={16} className="mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No rejected applications
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <WorkerProfile
        workerId={selectedWorkerId}
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onStatusChange={() => loadWorkers()}
      />
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Worker</DialogTitle>
            <DialogDescription>
              You are about to permanently delete this worker profile. This action cannot be undone.
              Their information will be completely removed from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDeleteWorker}
            >
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WorkerManagement;
