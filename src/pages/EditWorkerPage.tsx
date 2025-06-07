import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Worker, WorkerStatus, ServiceType } from "@/types";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, X, Trash, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WorkerService } from "@/services/mockDatabase";
import { WorkerAPI } from "@/services/api-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditWorkerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Editable fields state
  const [editableData, setEditableData] = useState({
    phone: '',
    email: '',
    address: '',
    service: '' as ServiceType,
    availability: '',
    status: '' as WorkerStatus,
    religion: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const loadWorkerData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      console.log(`Loading worker data for ID: ${id}`);
      
      try {
        // First make sure worker mappings are synced
        await WorkerAPI.syncWorkerMappings();
        
        // Try to get all workers via the API
        const allWorkers = await WorkerAPI.getAllWorkers();
        console.log(`Found ${allWorkers.length} workers in API response`);
        
        const foundWorker = allWorkers.find(w => w.id === id);
        
        if (foundWorker) {
          console.log(`Found worker matching ID ${id}: ${foundWorker.fullName}`);
          setWorker(foundWorker);
          // Initialize editable data
          const initialEditableData = {
            phone: foundWorker.phone || '',
            email: foundWorker.email || '',
            address: foundWorker.address || '',
            service: foundWorker.serviceType || 'Cleaning',
            availability: foundWorker.availability || '',
            status: foundWorker.status || 'Pending',
            religion: foundWorker.religion || 'Hindu'
          };
          console.log("🏗️ INITIALIZING EDITABLE DATA:", initialEditableData);
          setEditableData(initialEditableData);
        } else {
          // Fallback to mock database
          const mockWorker = WorkerService.getById(id);
          if (mockWorker) {
            setWorker(mockWorker);
            setEditableData({
              phone: mockWorker.phone || '',
              email: mockWorker.email || '',
              address: mockWorker.address || '',
              service: mockWorker.serviceType || 'Cleaning',
              availability: mockWorker.availability || '',
              status: mockWorker.status || 'Pending',
              religion: mockWorker.religion || 'Hindu'
            });
          } else {
            toast({
              title: "Worker Not Found",
              description: "The requested worker could not be found.",
              variant: "destructive",
            });
            navigate("/worker-management");
          }
        }
      } catch (error) {
        console.error("Error loading worker data:", error);
        // Fallback to mock database
        const mockWorker = WorkerService.getById(id);
        if (mockWorker) {
          setWorker(mockWorker);
          setEditableData({
            phone: mockWorker.phone || '',
            email: mockWorker.email || '',
            address: mockWorker.address || '',
            service: mockWorker.serviceType || 'Cleaning',
            availability: mockWorker.availability || '',
            status: mockWorker.status || 'Pending',
            religion: mockWorker.religion || 'Hindu'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWorkerData();
  }, [id, navigate, toast]);

  const handleUpdateWorkerProfile = async (fieldsToUpdate: Partial<typeof editableData>) => {
    if (!worker) return false;

    setIsUpdating(true);
    try {
      console.log("🔄 Starting worker profile update...");
      console.log("Worker ID:", worker.id);
      console.log("Fields to update:", fieldsToUpdate);
      console.log("Current worker data:", worker);
      
      // Check if we're changing status (this is a critical operation)
      const statusChanging = fieldsToUpdate.status && fieldsToUpdate.status !== worker.status;
      console.log(`🔍 Status changing: ${statusChanging} (${worker.status} → ${fieldsToUpdate.status})`);
      
      if (statusChanging) {
        console.log(`🔄 Taking STATUS CHANGE path: ${worker.status} → ${fieldsToUpdate.status}`);
        
        // Ensure all required fields are included with status changes
        const statusUpdateData = {
          ...fieldsToUpdate,
          religion: fieldsToUpdate.religion || worker.religion || 'Hindu',
          phone: fieldsToUpdate.phone || worker.phone || '',
          email: fieldsToUpdate.email || worker.email || '',
          address: fieldsToUpdate.address || worker.address || '',
          service: fieldsToUpdate.service || worker.serviceType,
          availability: fieldsToUpdate.availability || worker.availability || 'Full-Time'
        };
        
        // First try to specifically update status using the dedicated method
        try {
          const success = await WorkerAPI.updateWorkerStatus(
            worker.id, 
            fieldsToUpdate.status, 
            statusUpdateData.religion
          );
          
          if (success) {
            console.log(`Status updated successfully to: ${fieldsToUpdate.status}`);
          } else {
            throw new Error("Status update returned false");
          }
        } catch (statusError) {
          console.error("Error with dedicated status update method, trying full profile update:", statusError);
          
          // Fall back to full profile update
          const success = await WorkerAPI.updateWorkerProfile(worker.id, statusUpdateData, worker);
          
          if (!success) {
            throw new Error("Failed to update worker profile via API");
          }
        }
      } else {
        // Normal profile update (not changing status)
        console.log("🔄 Taking NORMAL UPDATE path (no status change)");
        console.log("🔄 Calling WorkerAPI.updateWorkerProfile with:", {
          workerId: worker.id,
          fieldsToUpdate: fieldsToUpdate,
          worker: worker
        });
        
        const success = await WorkerAPI.updateWorkerProfile(worker.id, fieldsToUpdate, worker);
        
        console.log("🔄 WorkerAPI.updateWorkerProfile returned:", success);
        
        if (!success) {
          throw new Error("Failed to update worker profile via API");
        }
      }
      
      // Refresh worker data to ensure we have the latest from the server
      try {
        console.log("🔄 Refreshing worker data from API...");
        // Try to get updated worker from API
        const allWorkers = await WorkerAPI.getAllWorkers();
        console.log(`Found ${allWorkers.length} workers in API response`);
        const refreshedWorker = allWorkers.find(w => w.id === worker.id);
        
        if (refreshedWorker) {
          console.log("✅ Successfully fetched updated worker data from API");
          console.log("Updated worker:", refreshedWorker);
          // Use the fresh data from server
          setWorker(refreshedWorker);
          
          // Also update local mockDB
          WorkerService.update(worker.id, refreshedWorker);
          
          // Update editableData to reflect changes
          setEditableData({
            phone: refreshedWorker.phone || '',
            email: refreshedWorker.email || '',
            address: refreshedWorker.address || '',
            service: refreshedWorker.serviceType || 'Cleaning',
            availability: refreshedWorker.availability || '',
            status: refreshedWorker.status || 'Pending',
            religion: refreshedWorker.religion || 'Hindu'
          });
          
          console.log("✅ Updated editableData with fresh values:");
          console.log("  Email:", refreshedWorker.email);
          console.log("  Phone:", refreshedWorker.phone);
          console.log("  Status:", refreshedWorker.status);
          
          return true;
        } else {
          console.log("❌ Could not find refreshed worker in API response");
          console.log("Looking for worker ID:", worker.id);
          console.log("Available worker IDs:", allWorkers.map(w => w.id));
        }
      } catch (refreshError) {
        console.warn("Could not refresh worker data from API:", refreshError);
      }
      
      // Fallback: Update local state with what we know
      console.log("🔄 Updating local state with new values...");
      const updatedWorker = {
        ...worker,
        phone: fieldsToUpdate.phone || worker.phone,
        email: fieldsToUpdate.email || worker.email,
        address: fieldsToUpdate.address || worker.address,
        serviceType: (fieldsToUpdate.service || worker.serviceType) as ServiceType,
        availability: fieldsToUpdate.availability || worker.availability,
        status: (fieldsToUpdate.status || worker.status) as WorkerStatus,
        religion: fieldsToUpdate.religion || worker.religion
      };
      
      console.log("Updated local worker:", updatedWorker);
      
      // Update mock database for compatibility
      WorkerService.update(worker.id, updatedWorker);
      
      setWorker(updatedWorker);
      
      // Force update of editable data to ensure UI reflects changes
      const newEditableData = {
        phone: updatedWorker.phone || '',
        email: updatedWorker.email || '',
        address: updatedWorker.address || '',
        service: updatedWorker.serviceType || 'Cleaning',
        availability: updatedWorker.availability || '',
        status: updatedWorker.status || 'Pending',
        religion: updatedWorker.religion || 'Hindu'
      };
      
      console.log("✅ Setting new editable data:", newEditableData);
      setEditableData(newEditableData);
      
      return true;
    } catch (error) {
      console.error("Error updating worker profile:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      console.log("💾 FRONTEND: User clicked Save Changes");
      console.log("💾 FRONTEND: Current worker:", worker);
      console.log("💾 FRONTEND: Editable data:", editableData);
      console.log("💾 FRONTEND: Worker ID for API call:", worker?.id);
      
      // Add detailed comparison to see what's changing
      if (worker) {
        console.log("🔍 FRONTEND: Field comparison:");
        console.log(`🔍 Email: "${worker.email}" → "${editableData.email}" (changed: ${worker.email !== editableData.email})`);
        console.log(`🔍 Phone: "${worker.phone}" → "${editableData.phone}" (changed: ${worker.phone !== editableData.phone})`);
        console.log(`🔍 Status: "${worker.status}" → "${editableData.status}" (changed: ${worker.status !== editableData.status})`);
        console.log(`🔍 Service: "${worker.serviceType}" → "${editableData.service}" (changed: ${worker.serviceType !== editableData.service})`);
        console.log(`🔍 Address: "${worker.address}" → "${editableData.address}" (changed: ${worker.address !== editableData.address})`);
        console.log(`🔍 Availability: "${worker.availability}" → "${editableData.availability}" (changed: ${worker.availability !== editableData.availability})`);
        console.log(`🔍 Religion: "${worker.religion}" → "${editableData.religion}" (changed: ${worker.religion !== editableData.religion})`);
      }
      
      const success = await handleUpdateWorkerProfile(editableData);
      
      if (success) {
        console.log("✅ FRONTEND: handleUpdateWorkerProfile returned success");
        toast({
          title: "Profile Updated",
          description: "Worker profile has been updated successfully.",
          variant: "default",
        });
        
        // Small delay to ensure the user sees the update
        setTimeout(() => {
          navigate(`/worker-profile/${worker?.id}`);
        }, 1000);
      } else {
        throw new Error("handleUpdateWorkerProfile returned false");
      }
    } catch (error) {
      console.error("❌ FRONTEND: Error in handleSaveChanges:", error);
      toast({
        title: "Update Failed",
        description: `Failed to update worker profile: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorker = async () => {
    if (!worker) return;

    setIsDeleting(true);
    try {
      // First try to delete via the new API
      try {
        const success = await WorkerAPI.deleteWorker(worker.id);
        if (!success) {
          throw new Error("Failed to delete worker via API");
        }
      } catch (apiError) {
        console.error("Error deleting worker via API, trying fallback:", apiError);
      }
      
      // Also delete from mock database for compatibility
      WorkerService.delete(worker.id);
      
      toast({
        title: "Worker Deleted",
        description: "Worker has been deleted successfully.",
        variant: "destructive",
      });
      
      navigate("/worker-management");
    } catch (error) {
      console.error("Error deleting worker:", error);
      toast({
        title: "Error",
        description: "Failed to delete worker",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading worker data...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Worker not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/worker-management")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Back to Workers
          </Button>
          <h1 className="text-2xl font-bold">Edit Worker Profile</h1>
        </div>
        <div className="flex gap-2">
          <LoadingButton 
            onClick={() => {
              console.log("🔘 SAVE BUTTON CLICKED!", {
                timestamp: new Date().toISOString(),
                isUpdating: isUpdating,
                editableData: editableData,
                worker: worker
              });
              handleSaveChanges();
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
            isLoading={isUpdating}
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </LoadingButton>
          <Button 
            variant="outline"
            onClick={() => navigate(`/worker-profile/${worker.id}`)}
            className="border-gray-200 hover:bg-gray-50"
          >
            <X size={16} className="mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Basic info and Status */}
        <Card>
          <CardHeader>
            <CardTitle>Worker Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center space-y-4">
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
              <p className="text-sm text-gray-500">ID: {worker.id}</p>
              <Badge 
                variant="outline"
                className={`${worker.status === "Active" 
                  ? "bg-green-100 text-green-800" 
                  : worker.status === "Pending" 
                    ? "bg-yellow-100 text-yellow-800"
                    : worker.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"}`}
              >
                {worker.status}
              </Badge>
            </div>

            {/* Status Update */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Update Status</h3>
              <Select
                value={editableData.status}
                onValueChange={(value) => setEditableData({...editableData, status: value as WorkerStatus})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center">
                      <span className="w-2 h-2 mr-2 rounded-full bg-green-500"></span>
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <div className="flex items-center">
                      <span className="w-2 h-2 mr-2 rounded-full bg-gray-500"></span>
                      Inactive
                    </div>
                  </SelectItem>
                  <SelectItem value="Pending">
                    <div className="flex items-center">
                      <span className="w-2 h-2 mr-2 rounded-full bg-yellow-500"></span>
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="Rejected">
                    <div className="flex items-center">
                      <span className="w-2 h-2 mr-2 rounded-full bg-red-500"></span>
                      Rejected
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t">
              <Button 
                variant="outline"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => navigate(`/worker-profile/${worker.id}`)}
              >
                <Check size={16} className="mr-2" />
                View Profile
              </Button>
              <LoadingButton 
                onClick={handleDeleteWorker}
                className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700"
                variant="outline"
                isLoading={isDeleting}
              >
                <Trash size={16} className="mr-2" />
                Delete Worker
              </LoadingButton>
            </div>
          </CardContent>
        </Card>

        {/* Middle column - Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">📱</span>
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Phone Number</Label>
                  <Input
                    value={editableData.phone}
                    onChange={(e) => setEditableData({...editableData, phone: e.target.value})}
                    placeholder="Enter phone number"
                    className={`mt-1 ${editableData.phone !== (worker?.phone || '') ? 'border-blue-300 bg-blue-50' : ''}`}
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">✉️</span>
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Email Address</Label>
                  <Input
                    value={editableData.email}
                    onChange={(e) => {
                      console.log("📝 EMAIL INPUT CHANGE:", {
                        oldValue: editableData.email,
                        newValue: e.target.value,
                        timestamp: new Date().toISOString()
                      });
                      setEditableData({...editableData, email: e.target.value});
                    }}
                    placeholder="Enter email address"
                    type="email"
                    className={`mt-1 ${editableData.email !== (worker?.email || '') ? 'border-blue-300 bg-blue-50' : ''}`}
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">📍</span>
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Address</Label>
                  <Input
                    value={editableData.address}
                    onChange={(e) => setEditableData({...editableData, address: e.target.value})}
                    placeholder="Enter address"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">🙏</span>
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Religion</Label>
                  <Select
                    value={editableData.religion}
                    onValueChange={(value) => setEditableData({...editableData, religion: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Sikh">Sikh</SelectItem>
                      <SelectItem value="Buddhist">Buddhist</SelectItem>
                      <SelectItem value="Jain">Jain</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Professional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">👷</span>
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Service Type</Label>
                  <Select
                    value={editableData.service}
                    onValueChange={(value) => setEditableData({...editableData, service: value as ServiceType})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                      <SelectItem value="Cooking">Cooking</SelectItem>
                      <SelectItem value="Driving">Driving</SelectItem>
                      <SelectItem value="Sweeping">Sweeping</SelectItem>
                      <SelectItem value="Landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">🕒</span>
                <div className="flex-1">
                  <Label className="text-sm text-gray-500">Availability</Label>
                  <Select
                    value={editableData.availability}
                    onValueChange={(value) => setEditableData({...editableData, availability: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Weekends Only">Weekends Only</SelectItem>
                      <SelectItem value="On-Call">On-Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Worker Stats */}
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <h3 className="font-medium text-sm">Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold">{worker.rating ? worker.rating.toFixed(1) : 'N/A'}</p>
                  <p className="text-xs text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{worker.completionRate ? worker.completionRate + '%' : '0%'}</p>
                  <p className="text-xs text-gray-600">Completion</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {worker.about && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-sm mb-2">About</h3>
                <p className="text-sm text-gray-700">{worker.about}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
