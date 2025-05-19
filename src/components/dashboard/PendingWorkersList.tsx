
import { useState } from "react";
import { Worker } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkerProfile } from "@/components/worker/WorkerProfile";

interface PendingWorkersListProps {
  workers: Worker[];
  onApprove: (workerId: string) => void;
  onReject: (workerId: string) => void;
}

export function PendingWorkersList({ workers, onApprove, onReject }: PendingWorkersListProps) {
  const navigate = useNavigate();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const handleViewDetails = (workerId: string) => {
    setSelectedWorkerId(workerId);
    setIsProfileOpen(true);
  };
  
  // Safe helper to get initials from a name
  const getInitials = (fullName: string | undefined): string => {
    if (!fullName) return "?";
    return fullName.split(" ")
      .map(n => n[0] || "")
      .join("")
      .toUpperCase();
  };
  
  if (workers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Recent Worker Applications</h3>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            onClick={() => navigate('/worker-management')}
          >
            View All
          </Button>
        </div>
        <div className="text-center py-8 text-gray-500">
          No pending applications
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Recent Worker Applications</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
          onClick={() => navigate('/worker-management')}
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {workers.map((worker) => (
          <div key={worker.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                {worker.photoUrl ? (
                  <img 
                    src={worker.photoUrl} 
                    alt={worker.fullName || "Worker"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-semibold">
                    {getInitials(worker.fullName)}
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{worker.fullName || "Unknown"}</h4>
                  <p className="text-sm text-gray-500">{worker.email || "No email"}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      {worker.serviceType || "Unknown"}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800">
                      {worker.experience ? `${worker.experience} years` : "Experience N/A"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline" 
                  size="sm" 
                  className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  onClick={() => handleViewDetails(worker.id)}
                >
                  <Eye size={16} className="mr-1" />
                  View
                </Button>
                <Button
                  variant="outline" 
                  size="sm" 
                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                  onClick={() => onApprove(worker.id)}
                >
                  <Check size={16} className="mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline"
                  size="sm" 
                  className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                  onClick={() => onReject(worker.id)}
                >
                  <X size={16} className="mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <WorkerProfile
        workerId={selectedWorkerId}
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onStatusChange={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
