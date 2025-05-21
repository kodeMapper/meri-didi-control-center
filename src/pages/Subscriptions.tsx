
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Check, 
  CheckCircle2, 
  CreditCard, 
  Edit, 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  Trash, 
  Users 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Mock data for subscription plans
const mockPlans = [
  {
    id: 1,
    name: "Basic Plan",
    description: "For individuals and small households",
    price: 499,
    duration: "Monthly",
    features: [
      "2 service bookings per month",
      "Standard service times",
      "Access to all basic services",
      "Email support"
    ],
    isPopular: false,
    isActive: true
  },
  {
    id: 2,
    name: "Premium Plan",
    description: "For medium households with regular needs",
    price: 999,
    duration: "Monthly",
    features: [
      "5 service bookings per month",
      "Priority service times",
      "Access to all services",
      "Phone support",
      "Discount on additional bookings"
    ],
    isPopular: true,
    isActive: true
  },
  {
    id: 3,
    name: "Enterprise Plan",
    description: "For large households and businesses",
    price: 1999,
    duration: "Monthly",
    features: [
      "10 service bookings per month",
      "Priority service times",
      "Access to all premium services",
      "24/7 phone support",
      "Dedicated account manager",
      "Custom booking options"
    ],
    isPopular: false,
    isActive: true
  },
  {
    id: 4,
    name: "Annual Basic",
    description: "Basic plan with annual discount",
    price: 4990,
    duration: "Annual",
    features: [
      "2 service bookings per month",
      "Standard service times",
      "Access to all basic services",
      "Email support",
      "Save 16% compared to monthly"
    ],
    isPopular: false,
    isActive: false
  }
];

// Mock data for subscribed users
const mockSubscriptions = [
  {
    id: "sub_123456",
    userId: "user_1",
    userName: "John Smith",
    userEmail: "john.smith@example.com",
    planName: "Premium Plan",
    status: "Active",
    startDate: "2023-10-15",
    endDate: "2023-11-14",
    nextBillingDate: "2023-11-15",
    autoRenew: true,
    amount: 999,
    paymentMethod: "Credit Card (****4242)",
    remainingBookings: 3
  },
  {
    id: "sub_123457",
    userId: "user_2",
    userName: "Jane Doe",
    userEmail: "jane.doe@example.com",
    planName: "Basic Plan",
    status: "Active",
    startDate: "2023-10-10",
    endDate: "2023-11-09",
    nextBillingDate: "2023-11-10",
    autoRenew: true,
    amount: 499,
    paymentMethod: "Credit Card (****1234)",
    remainingBookings: 1
  },
  {
    id: "sub_123458",
    userId: "user_3",
    userName: "Mike Johnson",
    userEmail: "mike.johnson@example.com",
    planName: "Enterprise Plan",
    status: "Expired",
    startDate: "2023-09-05",
    endDate: "2023-10-04",
    nextBillingDate: null,
    autoRenew: false,
    amount: 1999,
    paymentMethod: "Credit Card (****9876)",
    remainingBookings: 0
  },
  {
    id: "sub_123459",
    userId: "user_4",
    userName: "Sarah Williams",
    userEmail: "sarah.williams@example.com",
    planName: "Annual Basic",
    status: "Cancelled",
    startDate: "2023-06-15",
    endDate: "2024-06-14",
    nextBillingDate: null,
    autoRenew: false,
    amount: 4990,
    paymentMethod: "Credit Card (****5432)",
    remainingBookings: 14
  }
];

export default function Subscriptions() {
  const [plans, setPlans] = useState(mockPlans);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [activeTab, setActiveTab] = useState("plans");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Plan dialog state
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false);
  const [isDeletePlanDialogOpen, setIsDeletePlanDialogOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    price: 0,
    duration: "Monthly",
    features: [] as string[],
    isPopular: false,
    isActive: true
  });
  const [newFeature, setNewFeature] = useState("");
  
  // Subscription dialog state
  const [isViewSubscriptionDialogOpen, setIsViewSubscriptionDialogOpen] = useState(false);
  const [isEditSubscriptionDialogOpen, setIsEditSubscriptionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  
  const { toast } = useToast();
  
  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Plan management functions
  const handleAddPlan = () => {
    setIsLoading(true);
    
    // Validate form
    if (!planForm.name || !planForm.description || planForm.price <= 0 || planForm.features.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const newPlan = {
        id: Math.max(...plans.map(p => p.id)) + 1,
        ...planForm
      };
      
      setPlans([...plans, newPlan]);
      setIsAddPlanDialogOpen(false);
      resetPlanForm();
      
      toast({
        title: "Plan Created",
        description: `${planForm.name} has been created successfully.`,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleEditPlan = (plan: any) => {
    setSelectedPlanId(plan.id);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      features: [...plan.features],
      isPopular: plan.isPopular,
      isActive: plan.isActive
    });
    setIsAddPlanDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    if (!selectedPlanId) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedPlans = plans.map(plan => 
        plan.id === selectedPlanId ? { ...plan, ...planForm } : plan
      );
      
      setPlans(updatedPlans);
      setIsAddPlanDialogOpen(false);
      resetPlanForm();
      
      toast({
        title: "Plan Updated",
        description: `${planForm.name} has been updated successfully.`,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDeletePlan = () => {
    if (!selectedPlanId) return;
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedPlans = plans.filter(plan => plan.id !== selectedPlanId);
      setPlans(updatedPlans);
      setIsDeletePlanDialogOpen(false);
      setSelectedPlanId(null);
      
      toast({
        title: "Plan Deleted",
        description: "The subscription plan has been deleted successfully.",
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleTogglePlanStatus = (id: number) => {
    const updatedPlans = plans.map(plan => 
      plan.id === id ? { ...plan, isActive: !plan.isActive } : plan
    );
    
    setPlans(updatedPlans);
    
    const plan = plans.find(p => p.id === id);
    toast({
      title: plan?.isActive ? "Plan Deactivated" : "Plan Activated",
      description: `${plan?.name} is now ${plan?.isActive ? "inactive" : "active"}.`,
    });
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setPlanForm({
      ...planForm,
      features: [...planForm.features, newFeature]
    });
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...planForm.features];
    updatedFeatures.splice(index, 1);
    setPlanForm({
      ...planForm,
      features: updatedFeatures
    });
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      description: "",
      price: 0,
      duration: "Monthly",
      features: [],
      isPopular: false,
      isActive: true
    });
    setNewFeature("");
    setSelectedPlanId(null);
  };

  // Subscription management functions
  const handleViewSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setIsViewSubscriptionDialogOpen(true);
  };

  const handleCancelSubscription = (id: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedSubscriptions = subscriptions.map(sub => 
        sub.id === id ? { ...sub, status: "Cancelled", autoRenew: false, nextBillingDate: null } : sub
      );
      
      setSubscriptions(updatedSubscriptions);
      setIsViewSubscriptionDialogOpen(false);
      setSelectedSubscription(null);
      
      toast({
        title: "Subscription Cancelled",
        description: "The subscription has been cancelled successfully.",
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleToggleAutoRenew = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (!subscription) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedSubscriptions = subscriptions.map(sub => 
        sub.id === id ? { 
          ...sub, 
          autoRenew: !sub.autoRenew,
          nextBillingDate: !sub.autoRenew ? new Date(sub.endDate).toISOString().split('T')[0] : null
        } : sub
      );
      
      setSubscriptions(updatedSubscriptions);
      
      toast({
        title: subscription.autoRenew ? "Auto-Renew Disabled" : "Auto-Renew Enabled",
        description: `Auto-renew for this subscription has been ${subscription.autoRenew ? "disabled" : "enabled"}.`,
      });
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 bg-[#FEF7CD]/10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Subscription Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage subscription plans and customer subscriptions</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="plans">
            <CreditCard size={16} className="mr-2" />
            Subscription Plans
          </TabsTrigger>
          <TabsTrigger value="subscribers">
            <Users size={16} className="mr-2" />
            Subscribers
          </TabsTrigger>
        </TabsList>
        
        {/* Subscription Plans Tab */}
        <TabsContent value="plans">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Available Plans</h2>
            <Button onClick={() => {
              resetPlanForm();
              setIsAddPlanDialogOpen(true);
            }}>
              <Plus size={16} className="mr-2" />
              Add New Plan
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`overflow-hidden ${!plan.isActive ? 'opacity-60' : ''} ${plan.isPopular ? 'border-yellow-500 border-2' : ''}`}>
                {plan.isPopular && (
                  <div className="bg-yellow-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription className="mt-1">{plan.description}</CardDescription>
                    </div>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.duration.toLowerCase()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleTogglePlanStatus(plan.id)}
                    >
                      {plan.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setIsDeletePlanDialogOpen(true);
                      }}
                    >
                      <Trash size={16} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Subscribers Tab */}
        <TabsContent value="subscribers">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder="Search subscribers..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left font-medium">User</th>
                      <th className="px-6 py-4 text-left font-medium">Plan</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-left font-medium">Next Billing</th>
                      <th className="px-6 py-4 text-left font-medium">Auto-Renew</th>
                      <th className="px-6 py-4 text-left font-medium">Amount</th>
                      <th className="px-6 py-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.length > 0 ? (
                      filteredSubscriptions.map(subscription => (
                        <tr key={subscription.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium">{subscription.userName}</div>
                              <div className="text-gray-500">{subscription.userEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{subscription.planName}</td>
                          <td className="px-6 py-4">
                            <Badge variant={
                              subscription.status === "Active" ? "success" : 
                              subscription.status === "Expired" ? "destructive" : 
                              "secondary"
                            }>
                              {subscription.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {subscription.nextBillingDate ? (
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-2 text-gray-500" />
                                {subscription.nextBillingDate}
                              </div>
                            ) : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={subscription.autoRenew ? "outline" : "secondary"}>
                              {subscription.autoRenew ? "Yes" : "No"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">₹{subscription.amount}</td>
                          <td className="px-6 py-4 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewSubscription(subscription)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          {searchQuery ? "No subscriptions found matching your search criteria." : "No subscriptions found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add/Edit Plan Dialog */}
      <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPlanId ? "Edit Subscription Plan" : "Add New Subscription Plan"}</DialogTitle>
            <DialogDescription>
              {selectedPlanId ? "Update the details of your subscription plan." : "Create a new subscription plan for your customers."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input 
                  id="plan-name" 
                  value={planForm.name} 
                  onChange={(e) => setPlanForm({...planForm, name: e.target.value})} 
                  placeholder="e.g. Basic Plan"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-description">Description</Label>
                <Textarea 
                  id="plan-description" 
                  value={planForm.description} 
                  onChange={(e) => setPlanForm({...planForm, description: e.target.value})} 
                  placeholder="Brief description of the plan"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan-price">Price (₹)</Label>
                  <Input 
                    id="plan-price" 
                    type="number" 
                    value={planForm.price} 
                    onChange={(e) => setPlanForm({...planForm, price: Number(e.target.value)})} 
                    placeholder="e.g. 499"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plan-duration">Duration</Label>
                  <Select 
                    value={planForm.duration} 
                    onValueChange={(value) => setPlanForm({...planForm, duration: value})}
                  >
                    <SelectTrigger id="plan-duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Biannual">Biannual</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-popular" 
                  checked={planForm.isPopular} 
                  onCheckedChange={(checked) => setPlanForm({...planForm, isPopular: checked})} 
                />
                <Label htmlFor="is-popular">Mark as Popular</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-active" 
                  checked={planForm.isActive} 
                  onCheckedChange={(checked) => setPlanForm({...planForm, isActive: checked})} 
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="features" className="block mb-2">Plan Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    id="features" 
                    value={newFeature} 
                    onChange={(e) => setNewFeature(e.target.value)} 
                    placeholder="e.g. 2 service bookings per month"
                    onKeyDown={(e) => e.key === "Enter" && addFeature()}
                  />
                  <Button type="button" variant="secondary" onClick={addFeature}>
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4 min-h-[200px] max-h-[200px] overflow-y-auto">
                {planForm.features.length > 0 ? (
                  <ul className="space-y-2">
                    {planForm.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-1" />
                          <span>{feature}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => removeFeature(index)}
                        >
                          <Trash size={14} className="text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No features added yet. Add features to make your plan attractive.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddPlanDialogOpen(false);
                resetPlanForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={selectedPlanId ? handleUpdatePlan : handleAddPlan}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedPlanId ? "Updating..." : "Creating..."}
                </>
              ) : (
                selectedPlanId ? "Update Plan" : "Create Plan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Plan Confirmation Dialog */}
      <Dialog open={isDeletePlanDialogOpen} onOpenChange={setIsDeletePlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscription plan? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeletePlanDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePlan}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Subscription Dialog */}
      {selectedSubscription && (
        <Dialog open={isViewSubscriptionDialogOpen} onOpenChange={setIsViewSubscriptionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">
                  {selectedSubscription.planName}
                  <Badge variant={
                    selectedSubscription.status === "Active" ? "success" : 
                    selectedSubscription.status === "Expired" ? "destructive" : 
                    "secondary"
                  } className="ml-2">
                    {selectedSubscription.status}
                  </Badge>
                </h3>
                <div className="text-lg font-semibold">₹{selectedSubscription.amount}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                    <div className="mt-1">
                      <div className="font-medium">{selectedSubscription.userName}</div>
                      <div className="text-sm">{selectedSubscription.userEmail}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                    <div className="mt-1 flex items-center">
                      <CreditCard size={16} className="mr-2 text-gray-500" />
                      {selectedSubscription.paymentMethod}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Remaining Bookings</h4>
                    <div className="mt-1 font-medium">
                      {selectedSubscription.remainingBookings} bookings
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Subscription Period</h4>
                    <div className="mt-1">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        {selectedSubscription.startDate} to {selectedSubscription.endDate}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Auto-Renew</h4>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center">
                        <RefreshCw size={16} className="mr-2 text-gray-500" />
                        {selectedSubscription.autoRenew ? 
                          `Renews on ${selectedSubscription.nextBillingDate}` : 
                          "Auto-renew disabled"
                        }
                      </div>
                      {selectedSubscription.status === "Active" && (
                        <Switch 
                          checked={selectedSubscription.autoRenew} 
                          onCheckedChange={() => handleToggleAutoRenew(selectedSubscription.id)} 
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Subscription ID</h4>
                    <div className="mt-1 text-sm font-mono">
                      {selectedSubscription.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between">
              <div>
                {selectedSubscription.status === "Active" && (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleCancelSubscription(selectedSubscription.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : "Cancel Subscription"}
                  </Button>
                )}
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setIsViewSubscriptionDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
