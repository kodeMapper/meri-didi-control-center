
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Subscription } from "@/types";
import { Check, CreditCard, Download, Edit, Grid, MoreVertical, Plus, Trash, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const generateMockSubscriptions = (): Subscription[] => {
  return [
    {
      id: "sub-1",
      name: "Basic Plan",
      description: "Perfect for individuals and small needs",
      price: 999,
      duration: 30,
      durationType: "Days",
      features: ["1 Worker Included", "Basic Support", "24x7 Help"],
      isActive: true,
      subscribersCount: 123,
      createdAt: "2024-01-15T12:00:00Z",
      updatedAt: "2024-01-15T12:00:00Z",
    },
    {
      id: "sub-2",
      name: "Standard Plan",
      description: "Ideal for small households",
      price: 1999,
      duration: 30,
      durationType: "Days",
      features: ["3 Workers Included", "Priority Support", "24x7 Help", "Cleaning Equipment Included"],
      isActive: true,
      subscribersCount: 256,
      createdAt: "2024-01-20T12:00:00Z",
      updatedAt: "2024-02-01T12:00:00Z",
    },
    {
      id: "sub-3",
      name: "Premium Plan",
      description: "Best for families and large homes",
      price: 3999,
      duration: 30,
      durationType: "Days",
      features: ["5 Workers Included", "Premium Support", "24x7 Help", "Cleaning Equipment Included", "Weekend Service"],
      isActive: true,
      subscribersCount: 89,
      createdAt: "2024-02-10T12:00:00Z",
      updatedAt: "2024-03-05T12:00:00Z",
    },
    {
      id: "sub-4",
      name: "Corporate Plan",
      description: "For office spaces and businesses",
      price: 9999,
      duration: 30,
      durationType: "Days",
      features: ["10 Workers Included", "Dedicated Account Manager", "24x7 Help", "Commercial Equipment", "Weekend Service", "Priority Scheduling"],
      isActive: false,
      subscribersCount: 18,
      createdAt: "2024-03-01T12:00:00Z",
      updatedAt: "2024-03-15T12:00:00Z",
    },
  ];
};

interface SubscriberData {
  id: string;
  name: string;
  email: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
  renewalType: string;
}

const generateMockSubscribers = (): SubscriberData[] => {
  const statuses = ["Active", "Expired", "Pending"];
  const renewalTypes = ["Auto", "Manual", "One-time"];
  const plans = ["Basic Plan", "Standard Plan", "Premium Plan", "Corporate Plan"];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `sub-user-${i + 1}`,
    name: `Subscriber ${i + 1}`,
    email: `subscriber${i + 1}@example.com`,
    plan: plans[Math.floor(Math.random() * plans.length)],
    startDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    endDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    renewalType: renewalTypes[Math.floor(Math.random() * renewalTypes.length)],
  }));
};

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(generateMockSubscriptions());
  const [subscribers] = useState<SubscriberData[]>(generateMockSubscribers());
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    durationType: "Days" as "Days" | "Months" | "Years",
    features: [""],
    isActive: true,
  });
  const [newFeature, setNewFeature] = useState("");
  const [activeTab, setActiveTab] = useState("plans");
  const [filterPlan, setFilterPlan] = useState("all");
  const { toast } = useToast();

  const handleAddSubscription = () => {
    if (!formData.name || !formData.price || !formData.duration) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const filteredFeatures = formData.features.filter(feature => feature.trim() !== "");
    
    const newSubscription: Subscription = {
      id: `sub-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      durationType: formData.durationType,
      features: filteredFeatures,
      isActive: formData.isActive,
      subscribersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "Success",
      description: "Subscription plan has been created successfully",
    });
  };

  const handleEditSubscription = () => {
    if (!editSubscription) return;
    
    if (!formData.name || !formData.price || !formData.duration) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const filteredFeatures = formData.features.filter(feature => feature.trim() !== "");
    
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === editSubscription.id 
        ? {
            ...sub,
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            duration: Number(formData.duration),
            durationType: formData.durationType,
            features: filteredFeatures,
            isActive: formData.isActive,
            updatedAt: new Date().toISOString(),
          }
        : sub
    );
    
    setSubscriptions(updatedSubscriptions);
    setIsEditDialogOpen(false);
    setEditSubscription(null);
    resetForm();
    
    toast({
      title: "Success",
      description: "Subscription plan has been updated successfully",
    });
  };

  const handleDeleteSubscription = () => {
    if (!subscriptionToDelete) return;
    
    setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionToDelete));
    setIsDeleteDialogOpen(false);
    setSubscriptionToDelete(null);
    
    toast({
      title: "Success",
      description: "Subscription plan has been deleted successfully",
    });
  };

  const openEditDialog = (subscription: Subscription) => {
    setEditSubscription(subscription);
    setFormData({
      name: subscription.name,
      description: subscription.description,
      price: String(subscription.price),
      duration: String(subscription.duration),
      durationType: subscription.durationType,
      features: [...subscription.features],
      isActive: subscription.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      durationType: "Days",
      features: [""],
      isActive: true,
    });
    setNewFeature("");
  };

  const addFeature = () => {
    if (newFeature.trim() !== "") {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const toggleSubscriptionStatus = (id: string, currentStatus: boolean) => {
    const updatedSubscriptions = subscriptions.map(sub => 
      sub.id === id ? { ...sub, isActive: !currentStatus } : sub
    );
    setSubscriptions(updatedSubscriptions);
    
    toast({
      title: `Plan ${currentStatus ? 'Deactivated' : 'Activated'}`,
      description: `The subscription plan has been ${currentStatus ? 'deactivated' : 'activated'}.`,
    });
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    if (filterPlan === "all") return true;
    return subscriber.plan === filterPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mr-auto">
            <TabsList>
              <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {activeTab === "plans" && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              New Plan
            </Button>
          )}
          
          {activeTab === "subscribers" && (
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>
      
      <TabsContent value="plans" className="mt-0 space-y-4" hidden={activeTab !== 'plans'}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className={`${!subscription.isActive ? 'opacity-70' : ''}`}>
              <CardHeader className="relative pb-2">
                <div className="absolute top-4 right-4">
                  <Switch 
                    checked={subscription.isActive} 
                    onCheckedChange={() => toggleSubscriptionStatus(subscription.id, subscription.isActive)}
                  />
                </div>
                <CardTitle>{subscription.name}</CardTitle>
                <div className="flex items-end space-x-1">
                  <span className="text-3xl font-bold">₹{subscription.price}</span>
                  <span className="text-sm text-muted-foreground mb-1">/{subscription.durationType.toLowerCase().slice(0, -1)}</span>
                </div>
                <CardDescription>{subscription.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Features included:</p>
                  <ul className="space-y-1.5">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="mr-2 mt-1 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{subscription.subscribersCount} subscribers</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(subscription)}>
                        <Edit size={16} className="mr-2" />
                        Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSubscriptionToDelete(subscription.id);
                        setIsDeleteDialogOpen(true);
                      }} className="text-red-600 focus:text-red-600">
                        <Trash size={16} className="mr-2" />
                        Delete Plan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="subscribers" className="mt-0" hidden={activeTab !== 'subscribers'}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Subscribers</CardTitle>
                <CardDescription>Manage all subscription plan users</CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative w-full sm:w-auto">
                  <Input placeholder="Search subscribers..." className="w-full sm:w-[250px]" />
                </div>
                
                <Select value={filterPlan} onValueChange={setFilterPlan}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {subscriptions.map((sub) => (
                      <SelectItem key={sub.id} value={sub.name}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">Plan</th>
                      <th className="px-4 py-3 text-left font-medium">Start Date</th>
                      <th className="px-4 py-3 text-left font-medium">End Date</th>
                      <th className="px-4 py-3 text-left font-medium">Status</th>
                      <th className="px-4 py-3 text-left font-medium">Renewal</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.slice(0, 10).map((subscriber) => (
                      <tr key={subscriber.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{subscriber.name}</td>
                        <td className="px-4 py-3">{subscriber.email}</td>
                        <td className="px-4 py-3">{subscriber.plan}</td>
                        <td className="px-4 py-3">{subscriber.startDate}</td>
                        <td className="px-4 py-3">{subscriber.endDate}</td>
                        <td className="px-4 py-3">
                          <Badge variant={
                            subscriber.status === "Active" ? "success" : 
                            subscriber.status === "Expired" ? "destructive" : "default"
                          }>
                            {subscriber.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {subscriber.renewalType === "Auto" ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <CreditCard size={12} className="mr-1" /> Auto
                            </Badge>
                          ) : subscriber.renewalType}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Grid size={16} className="mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit size={16} className="mr-2" />
                                Change Plan
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                <Trash size={16} className="mr-2" />
                                Cancel Subscription
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min(10, filteredSubscribers.length)} of {filteredSubscribers.length} subscribers
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Add Subscription Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Subscription Plan</DialogTitle>
            <DialogDescription>
              Create a new subscription plan for your customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Basic Plan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="e.g. 999"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration <span className="text-red-500">*</span></Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="e.g. 30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="durationType">Duration Type</Label>
                <Select
                  value={formData.durationType}
                  onValueChange={(value) => setFormData({...formData, durationType: value as "Days" | "Months" | "Years"})}
                >
                  <SelectTrigger id="durationType">
                    <SelectValue placeholder="Select duration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                    <SelectItem value="Years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="A brief description of the plan"
                rows={3}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Features</Label>
              
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const updatedFeatures = [...formData.features];
                      updatedFeatures[index] = e.target.value;
                      setFormData({...formData, features: updatedFeatures});
                    }}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSubscription}>
              Add Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Subscription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>
              Update the details of this subscription plan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Same form fields as Add dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Plan Name <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (₹) <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-durationType">Duration Type</Label>
                <Select
                  value={formData.durationType}
                  onValueChange={(value) => setFormData({...formData, durationType: value as "Days" | "Months" | "Years"})}
                >
                  <SelectTrigger id="edit-durationType">
                    <SelectValue placeholder="Select duration type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Days">Days</SelectItem>
                    <SelectItem value="Months">Months</SelectItem>
                    <SelectItem value="Years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Features</Label>
              
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const updatedFeatures = [...formData.features];
                      updatedFeatures[index] = e.target.value;
                      setFormData({...formData, features: updatedFeatures});
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  Add
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditSubscription(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditSubscription}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSubscription}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
