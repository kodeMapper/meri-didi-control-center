
import { useState } from "react";
import { ServicePricing } from "@/types";
import { PricingService } from "@/services/mockDatabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function PricingManagement() {
  const [services, setServices] = useState<ServicePricing[]>(PricingService.getAll());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    serviceName: "",
    category: "",
    description: "",
    duration: 1,
    price: 0,
  });
  const { toast } = useToast();

  const handleAddService = () => {
    try {
      const service = PricingService.create({
        serviceName: newService.serviceName,
        category: newService.category as any,
        description: newService.description,
        duration: Number(newService.duration),
        price: Number(newService.price),
      });
      
      setServices([...services, service]);
      setIsAddDialogOpen(false);
      setNewService({
        serviceName: "",
        category: "",
        description: "",
        duration: 1,
        price: 0,
      });
      
      toast({
        title: "Service Added",
        description: "New service pricing has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service pricing.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = (id: string) => {
    try {
      PricingService.delete(id);
      setServices(services.filter(service => service.id !== id));
      
      toast({
        title: "Service Deleted",
        description: "Service pricing has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service pricing.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Pricing Management</h1>
          <p className="text-gray-500">Manage your service pricing</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              + Add Price
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Price</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  placeholder="Basic Cleaning"
                  value={newService.serviceName}
                  onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newService.category}
                  onValueChange={(value) => setNewService({ ...newService, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the service"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90" 
                onClick={handleAddService}
                disabled={!newService.serviceName || !newService.category || newService.price <= 0}
              >
                Add Price
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
              <SelectItem value="Sweeping">Sweeping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration (hrs)</TableHead>
                <TableHead>Price ($)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.serviceName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                  <TableCell>{service.duration} hrs</TableCell>
                  <TableCell className="font-semibold">${service.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
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

export default PricingManagement;
