
import { useState } from "react";
import { Worker } from "@/types";
import { WorkerService } from "@/services/mockDatabase";
import { Button } from "@/components/ui/button";
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
import { Eye, Edit, CheckCircle, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

function WorkerManagement() {
  const [workers] = useState<Worker[]>(WorkerService.getAll());
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleActivateWorker = (id: string) => {
    WorkerService.update(id, { status: "Active" });
    toast({
      title: "Worker Activated",
      description: "Worker has been activated successfully.",
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
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => navigate("/worker-registration")}
        >
          + Add Worker
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <Select defaultValue="All Categories">
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
              {workers.map((worker) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default WorkerManagement;
