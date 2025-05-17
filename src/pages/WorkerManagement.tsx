
import { useState } from "react";
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
import { Eye, Edit, CheckCircle, Trash, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PendingWorkersList } from "@/components/dashboard/PendingWorkersList";

function WorkerManagement() {
  const [activeWorkers] = useState<Worker[]>(WorkerService.getActive());
  const [pendingWorkers] = useState<Worker[]>(WorkerService.getPending());
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredActiveWorkers = selectedCategory === "All Categories" 
    ? activeWorkers 
    : activeWorkers.filter(worker => worker.serviceType === selectedCategory);

  const handleActivateWorker = (id: string) => {
    WorkerService.update(id, { status: "Active" });
    toast({
      title: "Worker Activated",
      description: "Worker has been activated successfully.",
    });
  };

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

  const handleVerifyWorker = (id: string) => {
    // In a real app this would verify documents
    toast({
      title: "Worker Verified",
      description: "Worker documents have been verified.",
    });
  };

  const handleDeleteWorker = (id: string) => {
    WorkerService.delete(id);
    toast({
      title: "Worker Deleted",
      description: "Worker has been deleted successfully.",
      variant: "destructive",
    });
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
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="active">Hired Workers</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
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
                    filteredActiveWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-medium">
                              {worker.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
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
                            {worker.rating.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>{worker.totalBookings}</TableCell>
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
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate(`/worker-profile/${worker.id}`)}>
                                <Eye size={16} /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate(`/edit-worker/${worker.id}`)}>
                                <Edit size={16} /> Edit Worker
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleActivateWorker(worker.id)}>
                                <CheckCircle size={16} /> Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleVerifyWorker(worker.id)}>
                                <CheckCircle size={16} /> Verify Worker
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center gap-2 text-red-600" 
                                onClick={() => handleDeleteWorker(worker.id)}
                              >
                                <Trash size={16} /> Delete Worker
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
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
                        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-medium">
                          {worker.fullName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <h4 className="font-medium">{worker.fullName}</h4>
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
                          <Trash size={16} className="mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/worker-profile/${worker.id}`)}
                        >
                          <Eye size={16} className="mr-1" />
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
      </Tabs>
    </div>
  );
}

export default WorkerManagement;
