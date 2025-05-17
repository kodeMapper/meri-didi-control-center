
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Worker } from "@/types";
import { WorkerService } from "@/services/mockDatabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, X, Trash, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const workerData = WorkerService.getById(id);
      if (workerData) {
        setWorker(workerData);
      } else {
        setError("Worker not found");
      }
      setLoading(false);
    }
  }, [id]);

  const handleActivateWorker = () => {
    if (!worker || !id) return;

    WorkerService.update(id, { status: "Active" });
    toast({
      title: "Worker Activated",
      description: "Worker has been activated successfully.",
    });
    setWorker({ ...worker, status: "Active" });
  };

  const handleDeactivateWorker = () => {
    if (!worker || !id) return;

    WorkerService.update(id, { status: "Inactive" });
    toast({
      title: "Worker Deactivated",
      description: "Worker has been deactivated.",
    });
    setWorker({ ...worker, status: "Inactive" });
  };

  const handleVerifyWorker = () => {
    if (!worker) return;

    toast({
      title: "Worker Verified",
      description: "Worker documents have been verified.",
    });
  };

  const handleDeleteWorker = () => {
    if (!worker || !id) return;

    WorkerService.delete(id);
    toast({
      title: "Worker Deleted",
      description: "Worker has been deleted successfully.",
      variant: "destructive",
    });
    navigate("/worker-management");
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

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !worker) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error || "Worker not found"}</div>
        <Button onClick={() => navigate("/worker-management")}>
          Back to Worker Management
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Worker Profile</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
            onClick={() => navigate(`/edit-worker/${worker.id}`)}
          >
            <Pencil size={16} className="mr-2" />
            Edit
          </Button>
          
          {worker.status !== "Active" ? (
            <Button 
              className="bg-green-100 text-green-600 border border-green-200 hover:bg-green-200 hover:text-green-700"
              variant="outline"
              onClick={handleActivateWorker}
            >
              <Check size={16} className="mr-2" />
              Activate
            </Button>
          ) : (
            <Button 
              className="bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              variant="outline"
              onClick={handleDeactivateWorker}
            >
              <X size={16} className="mr-2" />
              Deactivate
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Basic info */}
        <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
          <div className="h-32 w-32 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 text-3xl font-bold">
            {worker.fullName
              .split(" ")
              .map(n => n[0])
              .join("")}
          </div>
          {worker.photoUrl && (
            <img 
              src={worker.photoUrl} 
              alt={worker.fullName} 
              className="h-32 w-32 rounded-full object-cover"
            />
          )}
          <h2 className="text-2xl font-bold">{worker.fullName}</h2>
          <Badge 
            variant="outline"
            className={getStatusBadgeStyle(worker.status)}
          >
            {worker.status}
          </Badge>
          
          <div className="w-full pt-4 space-y-4">
            <Button 
              onClick={handleVerifyWorker}
              className="w-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
              variant="outline"
            >
              <Check size={16} className="mr-2" />
              Verify Documents
            </Button>
            
            <Button 
              onClick={handleDeleteWorker}
              className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
              variant="outline"
            >
              <Trash size={16} className="mr-2" />
              Delete Profile
            </Button>
          </div>
        </div>
        
        {/* Middle column - Contact & Experience */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Contact Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">📱</span>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{worker.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">✉️</span>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium">{worker.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">📍</span>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{worker.address}</p>
                  <p className="font-medium">{worker.city}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Professional Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">👷</span>
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    {worker.serviceType}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">⏱️</span>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">{worker.experience} years</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">📅</span>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{worker.dateOfBirth}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">🕒</span>
                <div>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="font-medium">{worker.availability}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-yellow-600">🆔</span>
                <div>
                  <p className="text-sm text-gray-500">ID Information</p>
                  <p className="font-medium">{worker.idType}: {worker.idNumber}</p>
                </div>
              </div>

              {worker.idProofUrl && (
                <div className="flex items-start gap-3">
                  <span className="text-yellow-600">📄</span>
                  <div>
                    <p className="text-sm text-gray-500">ID Document</p>
                    <a 
                      href={worker.idProofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Skills, Stats & About */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills && worker.skills.length > 0 ? (
                worker.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills listed</p>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg border-b pb-2 mb-3">Booking Stats</h3>
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
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium text-lg border-b pb-2 mb-2">About</h3>
            <p className="text-gray-700">{worker.about}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfilePage;
