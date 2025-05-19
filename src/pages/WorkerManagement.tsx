
import { useState, useEffect } from "react";
import { Worker, ServiceType } from "@/types";
import { WorkerService } from "@/services/mockDatabase";
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
import { Copy, Edit, CheckCircle, Trash, User, X, Check } from "lucide-react";
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
import { 
  supabase, 
  getWorkersFromApplications, 
  updateWorkerApplicationStatus,
  deleteWorkerApplication,
  addNotification
} from "@/lib/supabase";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load workers from database
    loadWorkers();
  }, []);
  
  const loadWorkers = async () => {
    setIsLoading(true);
    try {
      // Load active workers
      const activeWorkersData = await getWorkersFromApplications('Active');
      setActiveWorkers(activeWorkersData);
      
      // Load inactive workers
      const inactiveWorkersData = await getWorkersFromApplications('Inactive');
      setInactiveWorkers(inactiveWorkersData);
      
      // Load pending workers
      const pendingWorkersData = await getWorkersFromApplications('Pending');
      setPendingWorkers(pendingWorkersData);
      
      // Load rejected workers
      const rejectedWorkersData = await getWorkersFromApplications('Rejected');
      setRejectedWorkers(rejectedWorkersData);
    } catch (error) {
      console.error("Error loading workers:", error);
      toast({
        title: "Error",
        description: "Failed to load workers data",
        variant: "destructive",
      });
      
      // Fallback to mock database
      setActiveWorkers(WorkerService.getActive());
      setPendingWorkers(WorkerService.getPending());
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActiveWorkers = selectedCategory === "All Categories" 
    ? activeWorkers 
    : activeWorkers.filter(worker => worker.serviceType === selectedCategory);

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
    try {
      // Update in Supabase
      const success = await updateWorkerApplicationStatus(id, 'Active');
      if (!success) {
        throw new Error("Failed to update worker status");
      }

      // Also update in mock database for compatibility
      WorkerService.update(id, { status: "Active" });
      
      // Send notification to worker
      await addNotification({
        type: "Worker Verified",
        message: "Your profile has been activated. You can now receive bookings.",
        title: "Profile Activated",
        read: false,
        user_type: "worker",
        user_identifier: id
      });
      
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
    }
  };

  const handleDeactivateWorker = async (id: string) => {
    try {
      // Update in Supabase
      const success = await updateWorkerApplicationStatus(id, 'Inactive');
      if (!success) {
        throw new Error("Failed to update worker status");
      }

      // Also update in mock database for compatibility
      WorkerService.update(id, { status: "Inactive" });
      
      // Send notification to worker
      await addNotification({
        type: "Worker Verified",
        message: "Your profile has been deactivated. You will not receive new bookings until your profile is activated again.",
        title: "Profile Deactivated",
        read: false,
        user_type: "worker",
        user_identifier: id
      });
      
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
    }
  };

  const handleApproveWorker = async (workerId: string) => {
    try {
      // Update in Supabase
      const success = await updateWorkerApplicationStatus(workerId, 'Active');
      if (!success) {
        throw new Error("Failed to update worker status");
      }

      // Also update in mock database for compatibility
      WorkerService.update(workerId, { status: "Active" });
      
      // Send notification
      await addNotification({
        type: "Worker Verified",
        message: "Congratulations! Your application has been approved. You are now part of our team.",
        title: "Application Approved",
        read: false,
        user_type: "worker",
        user_identifier: workerId
      });
      
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
      
      // Send notification
      await addNotification({
        type: "Worker Verified",
        message: "We regret to inform you that your application has been rejected. Thank you for your interest.",
        title: "Application Rejected",
        read: false,
        user_type: "worker",
        user_identifier: workerId
      });
      
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
    }
  };

  const handleConfirmDeleteWorker = async () => {
    if (!selectedWorkerId) return;
    
    try {
      // Delete from Supabase
      const success = await deleteWorkerApplication(selectedWorkerId);
      if (!success) {
        throw new Error("Failed to delete worker");
      }

      // Also delete from mock database for compatibility
      WorkerService.delete(selectedWorkerId);
      
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
        <p className="text-gray-500">Loading worker data...</p>
      </div>
    );
  }

  const renderWorkerRow = (worker: Worker) => (
    <TableRow key={worker.id}>
      <TableCell>
        <div 
          className="relative group cursor-pointer" 
          onClick={() => copyToClipboard(worker.id)}
        >
          <span className="text-xs text-gray-600">
            #{worker.id.substring(0, 8)}...
          </span>
          <div className="absolute hidden group-hover:flex items-center gap-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded -top-8 left-0 whitespace-nowrap">
            {workerToCopy === worker.id && isCopied ? (
              <>
                <Check size={12} /> Copied!
              </>
            ) : (
              <>
                <Copy size={12} /> Copy ID
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
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-medium">
              {getInitials(worker.fullName)}
            </div>
          )}
          <div>
            <div className="font-medium">{worker.fullName}</div>
            <div className="text-sm text-gray-500">{worker.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="font-normal">
          {worker.serviceType || "Unknown"}
        </Badge>
      </TableCell>
      <TableCell>{worker.experience} years</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Badge variant="outline" className={getStatusBadgeStyle(worker.status)}>
            {worker.status === "Pending" && "Pending"}
            {worker.status === "Active" && "Active"}
            {worker.status === "Inactive" && "Inactive"}
            {worker.status === "Rejected" && "Rejected"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          {worker.rating?.toFixed(1) || "0.0"}
        </div>
      </TableCell>
      <TableCell>{worker.totalBookings || 0}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleViewWorker(worker.id)}>
              <User size={16} /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate(`/edit-worker/${worker.id}`)}>
              <Edit size={16} /> Edit Worker
            </DropdownMenuItem>
            {worker.status !== "Active" ? (
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleActivateWorker(worker.id)}>
                <CheckCircle size={16} /> Activate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleDeactivateWorker(worker.id)}>
                <X size={16} /> Deactivate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="flex items-center gap-2 text-red-600" 
              onClick={() => handleShowDeleteDialog(worker.id)}
            >
              <Trash size={16} /> Delete Worker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Worker Management</h1>
          <p className="text-gray-500">Manage your worker profiles and applications</p>
        </div>
        <Button 
          size="sm" 
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
          onClick={() => navigate("/worker-registration")}
        >
          + Add Worker
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="active">Active Workers</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Workers</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <Select 
                defaultValue="All Categories" 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  <SelectItem value="Cleaning">Cleaning</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Driving">Driving</SelectItem>
                  <SelectItem value="Sweeping">Sweeping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ratings</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActiveWorkers.length > 0 ? (
                    filteredActiveWorkers.map((worker) => renderWorkerRow(worker))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        {selectedCategory === "All Categories" 
                          ? "No active workers found" 
                          : `No active workers found in ${selectedCategory} category`}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ratings</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveWorkers.length > 0 ? (
                    inactiveWorkers.map((worker) => renderWorkerRow(worker))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                        No inactive workers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
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
        
        <TabsContent value="rejected" className="space-y-4">
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
