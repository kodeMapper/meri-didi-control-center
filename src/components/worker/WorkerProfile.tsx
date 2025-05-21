import { useState, useEffect } from "react";
import { Worker } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Pencil, X, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkerService } from "@/services/mockDatabase";
import { getWorkerApplications, mapWorkerApplicationToWorker, updateWorkerApplicationStatus, deleteWorkerApplication } from "@/lib/supabase";

interface WorkerProfileProps {
  workerId: string | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: () => void;
}

export function WorkerProfile({ workerId, open, onClose, onStatusChange }: WorkerProfileProps) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadWorkerData = async () => {
      if (!workerId || !open) return;
      
      setIsLoading(true);
      try {
        // First try to get worker from Supabase
        const workerApplications = await getWorkerApplications();
        const workerApp = workerApplications.find(w => w.id === workerId);
        
        if (workerApp) {
          setWorker(mapWorkerApplicationToWorker(workerApp));
        } else {
          // Fallback to mock database
          const mockWorker = WorkerService.getById(workerId);
          setWorker(mockWorker);
        }
      } catch (error) {
        console.error("Error loading worker data:", error);
        // Fallback to mock database
        const mockWorker = WorkerService.getById(workerId);
        setWorker(mockWorker);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkerData();
  }, [workerId, open]);

  const handleActivateWorker = async () => {
    if (!worker) return;

    try {
      const success = await updateWorkerApplicationStatus(worker.id, 'Active');
      
      if (!success) {
        throw new Error("Failed to update worker status");
      }
      
      // Also update in mock database for compatibility
      WorkerService.update(worker.id, { status: "Active" });
      
      toast({
        title: "Worker Activated",
        description: "Worker has been activated successfully.",
      });
      
      setWorker({ ...worker, status: "Active" });
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error activating worker:", error);
      toast({
        title: "Error",
        description: "Failed to activate worker",
        variant: "destructive",
      });
    }
  };

  const handleVerifyWorker = () => {
    if (!worker) return;

    toast({
      title: "Worker Verified",
      description: "Worker documents have been verified.",
    });
    if (onStatusChange) onStatusChange();
  };

  const handleDeleteWorker = async () => {
    if (!worker) return;

    try {
      const success = await deleteWorkerApplication(worker.id);
      
      if (!success) {
        throw new Error("Failed to delete worker");
      }
      
      // Also delete from mock database for compatibility
      WorkerService.delete(worker.id);
      
      toast({
        title: "Worker Deleted",
        description: "Worker has been deleted successfully.",
        variant: "destructive",
      });
      
      onClose();
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast({
        title: "Error",
        description: "Failed to delete worker",
        variant: "destructive",
      });
    }
  };

  // Safe helper to get initials from a name
  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0] || "")
      .join("")
      .toUpperCase();
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Worker Profile</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500">Loading worker data...</p>
          </div>
        ) : !worker ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-500">Worker not found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Basic info */}
            <div className="flex flex-col items-center text-center space-y-4 p-4 border rounded-lg">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-yellow-100 flex items-center justify-center text-yellow-800 text-2xl font-bold">
                {worker.photoUrl ? (
                  <img 
                    src={worker.photoUrl} 
                    alt={worker.fullName} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  getInitials(worker.fullName)
                )}
              </div>
              <h2 className="text-xl font-bold">{worker.fullName}</h2>
              <p className="text-sm text-gray-500">{worker.status === "Active" ? "Active Worker" : "Unknown"}</p>
              <Badge 
                variant="outline"
                className={`${worker.status === "Active" 
                  ? "bg-green-100 text-green-800" 
                  : worker.status === "Pending" 
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"}`}
              >
                {worker.status}
              </Badge>
              
              <Button 
                onClick={() => onClose()} 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                variant="outline"
              >
                <Pencil size={16} className="mr-2" />
                Edit Profile
              </Button>
              
              {worker.status === "Pending" && (
                <Button 
                  onClick={handleActivateWorker}
                  className="w-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:text-green-700"
                  variant="outline"
                >
                  <Check size={16} className="mr-2" />
                  Activate Worker
                </Button>
              )}
              
              <Button 
                onClick={handleVerifyWorker}
                className="w-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:text-blue-700"  
                variant="outline"
              >
                <Check size={16} className="mr-2" />
                Verify Worker
              </Button>
              
              <Button 
                onClick={handleDeleteWorker}
                className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700"
                variant="outline"
              >
                <Trash size={16} className="mr-2" />
                Delete Profile
              </Button>
            </div>
            
            {/* Middle column - Contact & Experience */}
            <div className="space-y-6">
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-lg">Contact Information</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">📱</span>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p>{worker.phone || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">✉️</span>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p>{worker.email || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">📍</span>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p>{worker.address || "N/A"}</p>
                      <p>{worker.city || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-medium text-lg">Professional Details</h3>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">👷</span>
                    <div>
                      <p className="text-sm text-gray-500">Service Type</p>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        {worker.serviceType || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">⏱️</span>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p>{worker.experience ? `${worker.experience} years` : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">📅</span>
                    <div>
                      <p className="text-sm text-gray-500">Joining Date</p>
                      <p>{worker.joiningDate || worker.createdAt ? new Date(worker.joiningDate || worker.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">🕒</span>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p>{worker.availability || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">🆔</span>
                    <div>
                      <p className="text-sm text-gray-500">ID Information</p>
                      <p>{worker.idType || "N/A"}: {worker.idNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Skills, Stats & About */}
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills && worker.skills.length > 0 ? worker.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      {skill}
                    </Badge>
                  )) : (
                    <p className="text-sm text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-3">Booking Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold">{worker.totalBookings || 0}</p>
                    <p className="text-xs text-gray-600">Total Bookings</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold">{worker.rating ? worker.rating.toFixed(1) : 'N/A'}</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold">{worker.completionRate ? worker.completionRate + '%' : '0%'}</p>
                    <p className="text-xs text-gray-600">Completion</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">About</h3>
                <p className="text-sm text-gray-700">{worker.about || "No information provided."}</p>
              </div>
              
              {worker.idProofUrl && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-3">ID Proof Document</h3>
                  <a 
                    href={worker.idProofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    View ID Document
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
