
import { useState, useEffect } from "react";
import { ServiceCategory, ServicePlan } from "@/types";
import { PricingService } from "@/services/mockDatabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, ChevronDown, ChevronUp, Plus, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for service plans
const initialServicePlans: {[key: string]: ServicePlan[]} = {
  Cooking: [
    {
      id: "1",
      planName: "Daily Lunch",
      description: "One meal per day",
      category: "Cooking",
      frequency: "Daily",
      persons: 1,
      basePrice: 2500,
    },
    {
      id: "2",
      planName: "Daily Dinner",
      description: "One meal per day",
      category: "Cooking",
      frequency: "Daily",
      persons: 1,
      basePrice: 2500,
    },
    {
      id: "3",
      planName: "Daily Full Meals",
      description: "Two meals per day",
      category: "Cooking",
      frequency: "Daily",
      persons: 1,
      basePrice: 4500,
    },
    {
      id: "4",
      planName: "Party Special",
      description: "One-time cooking for events",
      category: "Cooking",
      frequency: "One-time",
      persons: 10,
      basePrice: 3500,
    }
  ],
  Cleaning: [
    {
      id: "5",
      planName: "Basic Home Cleaning",
      description: "Regular home cleaning service",
      category: "Cleaning",
      frequency: "Weekly",
      persons: 1,
      basePrice: 1200,
    },
    {
      id: "6",
      planName: "Deep Home Cleaning",
      description: "Thorough home cleaning service",
      category: "Cleaning",
      frequency: "Monthly",
      persons: 2,
      basePrice: 3000,
    },
  ],
  Driving: [
    {
      id: "7",
      planName: "Daily Driver",
      description: "Driver for daily commute",
      category: "Driving",
      frequency: "Daily",
      persons: 1,
      basePrice: 3000,
    },
    {
      id: "8",
      planName: "Weekend Driver",
      description: "Driver for weekend trips",
      category: "Driving",
      frequency: "Weekend",
      persons: 1,
      basePrice: 1500,
    },
  ],
  Sweeping: [
    {
      id: "9",
      planName: "Daily Sweeping",
      description: "Daily sweeping service",
      category: "Sweeping",
      frequency: "Daily",
      persons: 1,
      basePrice: 1000,
    },
  ],
  Landscaping: [
    {
      id: "10",
      planName: "Garden Maintenance",
      description: "Regular garden care",
      category: "Landscaping",
      frequency: "Weekly",
      persons: 1,
      basePrice: 2000,
    },
  ],
};

function PricingManagement() {
  const [expandedCategory, setExpandedCategory] = useState<ServiceCategory | null>("Cooking");
  const [servicePlans, setServicePlans] = useState<{[key: string]: ServicePlan[]}>(initialServicePlans);
  const [isAddPlanDialogOpen, setIsAddPlanDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<ServicePlan>>({
    planName: "",
    description: "",
    category: "Cooking",
    frequency: "Daily",
    persons: 1,
    basePrice: 0,
  });
  const { toast } = useToast();
  
  const categories: ServiceCategory[] = ["Cooking", "Cleaning", "Driving", "Sweeping", "Landscaping"];

  const toggleCategory = (category: ServiceCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleAddPlan = () => {
    if (!newPlan.planName || !newPlan.category || !newPlan.basePrice) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const category = newPlan.category as ServiceCategory;
    const newId = `plan-${Date.now()}`;
    
    const plan: ServicePlan = {
      id: newId,
      planName: newPlan.planName || "",
      description: newPlan.description || "",
      category: category,
      frequency: newPlan.frequency || "Daily",
      persons: newPlan.persons || 1,
      basePrice: newPlan.basePrice || 0,
    };
    
    setServicePlans(prevPlans => ({
      ...prevPlans,
      [category]: [...(prevPlans[category] || []), plan]
    }));
    
    setIsAddPlanDialogOpen(false);
    setNewPlan({
      planName: "",
      description: "",
      category: "Cooking",
      frequency: "Daily",
      persons: 1,
      basePrice: 0,
    });
    
    toast({
      title: "Plan Added",
      description: "New service plan has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Service Pricing</h1>
          <p className="text-gray-500">Manage service plans and pricing</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isAddPlanDialogOpen} onOpenChange={setIsAddPlanDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                Add Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Plan</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planName">Plan Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="planName"
                      placeholder="e.g. Daily Lunch"
                      value={newPlan.planName}
                      onChange={(e) => setNewPlan({ ...newPlan, planName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                    <Select
                      value={newPlan.category}
                      onValueChange={(value) => setNewPlan({ ...newPlan, category: value as ServiceCategory })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency <span className="text-red-500">*</span></Label>
                    <Select
                      value={newPlan.frequency}
                      onValueChange={(value) => setNewPlan({ ...newPlan, frequency: value })}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="One-time">One-time</SelectItem>
                        <SelectItem value="Weekend">Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="persons">Persons <span className="text-red-500">*</span></Label>
                    <Input
                      id="persons"
                      type="number"
                      min="1"
                      value={newPlan.persons}
                      onChange={(e) => setNewPlan({ ...newPlan, persons: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (₹) <span className="text-red-500">*</span></Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    value={newPlan.basePrice}
                    onChange={(e) => setNewPlan({ ...newPlan, basePrice: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the service plan"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddPlanDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPlan}>
                  Add Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="flex items-center gap-1">
            <FileText size={16} />
            Publish All Changes
          </Button>
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div 
            className="p-4 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"
            onClick={() => toggleCategory(category)}
          >
            <div className="space-y-1">
              <h3 className="font-medium">{category} Services</h3>
              <p className="text-sm text-gray-500">
                {category === "Cooking" && "Meal preparation services"}
                {category === "Cleaning" && "House and office cleaning services"}
                {category === "Driving" && "Chauffeur services"}
                {category === "Sweeping" && "Outdoor cleaning services"}
                {category === "Landscaping" && "Garden maintenance services"}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {expandedCategory === category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          </div>
          
          {expandedCategory === category && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Plan Name</th>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center">Persons</th>
                    <th className="px-4 py-3 text-center">Frequency</th>
                    <th className="px-4 py-3 text-right">Base Price (₹)</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {servicePlans[category]?.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 font-medium">{plan.planName}</td>
                      <td className="px-4 py-4 text-gray-600 max-w-xs truncate">{plan.description}</td>
                      <td className="px-4 py-4 text-center">{plan.persons}</td>
                      <td className="px-4 py-4 text-center">{plan.frequency}</td>
                      <td className="px-4 py-4 text-right font-medium">₹{plan.basePrice}</td>
                      <td className="px-4 py-4 text-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PricingManagement;
