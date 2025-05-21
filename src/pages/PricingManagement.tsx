
import { useState, useEffect } from 'react';
import { ServiceCategory, ServiceType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Plus, Eye, Check, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";

interface ServicePlan {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  published?: boolean;
}

export default function PricingManagement() {
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([
    {
      id: '1',
      name: 'Basic Cleaning',
      description: 'Essential cleaning for your home',
      category: 'Cleaning',
      price: 40,
      duration: 2,
      features: ['Dusting', 'Vacuuming', 'Surface cleaning'],
      isPopular: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      published: true
    },
    {
      id: '2',
      name: 'Deep Cleaning',
      description: 'Thorough cleaning of your entire home',
      category: 'Cleaning',
      price: 85,
      duration: 4,
      features: ['Basic cleaning features', 'Deep carpet cleaning', 'Inside cabinet cleaning', 'Window cleaning'],
      isPopular: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      published: true
    },
    {
      id: '3',
      name: 'Basic Cooking',
      description: 'Simple meal preparation',
      category: 'Cooking',
      price: 50,
      duration: 2,
      features: ['Meal preparation', 'Basic recipes', 'Using your ingredients'],
      isPopular: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      published: true
    }
  ]);

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ServicePlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ServicePlan>>({});

  const categories: ServiceCategory[] = ['Cleaning', 'Cooking', 'Driving', 'Sweeping', 'Landscaping'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEditFormData({
      ...editFormData,
      [id]: value
    });
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const features = e.target.value.split('\n').filter(feature => feature.trim() !== '');
    setEditFormData({
      ...editFormData,
      features
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setEditFormData({
      ...editFormData,
      isPopular: checked
    });
  };

  const handleCategoryChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      category: value as ServiceCategory
    });
  };

  const handleEditPlan = (plan: ServicePlan) => {
    setCurrentPlan(plan);
    setEditFormData({
      name: plan.name,
      description: plan.description,
      category: plan.category,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      isPopular: plan.isPopular,
      isActive: plan.isActive
    });
    setIsEditing(true);
  };

  const handleSavePlan = () => {
    if (!editFormData.name || !editFormData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (currentPlan) {
      // Update existing plan
      const updatedPlans = servicePlans.map(plan => 
        plan.id === currentPlan.id 
          ? { 
              ...plan, 
              ...editFormData,
              published: false
            } 
          : plan
      );
      setServicePlans(updatedPlans);
      toast.success("Service plan updated successfully");
    } else {
      // Add new plan
      const newPlan: ServicePlan = {
        id: Math.random().toString(36).substr(2, 9),
        name: editFormData.name!,
        description: editFormData.description!,
        category: editFormData.category as ServiceCategory || 'Cleaning',
        price: Number(editFormData.price) || 0,
        duration: Number(editFormData.duration) || 1,
        features: editFormData.features || [],
        isPopular: editFormData.isPopular || false,
        isActive: true,
        createdAt: new Date().toISOString(),
        published: false
      };
      setServicePlans([...servicePlans, newPlan]);
      toast.success("New service plan added successfully");
    }
    
    setHasUnpublishedChanges(true);
    setIsEditing(false);
    setCurrentPlan(null);
    setEditFormData({});
  };

  const handleDeletePrompt = (planId: string) => {
    setPlanToDelete(planId);
    setShowDeleteDialog(true);
  };

  const handleDeletePlan = () => {
    if (!planToDelete) return;
    
    const updatedPlans = servicePlans.filter(plan => plan.id !== planToDelete);
    setServicePlans(updatedPlans);
    setHasUnpublishedChanges(true);
    setShowDeleteDialog(false);
    setPlanToDelete(null);
    toast.success("Service plan deleted successfully");
  };

  const handlePublishChanges = () => {
    // In a real app, this would push changes to the server/mobile app
    const publishedPlans = servicePlans.map(plan => ({
      ...plan,
      published: true
    }));
    setServicePlans(publishedPlans);
    setHasUnpublishedChanges(false);
    toast.success("All changes have been published successfully");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Service Pricing Management</h1>
        <div className="flex gap-2">
          {hasUnpublishedChanges && (
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handlePublishChanges}
            >
              <Check className="mr-2 h-4 w-4" />
              Publish Changes
            </Button>
          )}
          <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setCurrentPlan(null);
                setEditFormData({});
                setIsEditing(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{currentPlan ? "Edit Service Plan" : "Add New Service Plan"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Plan Name *</Label>
                    <Input 
                      id="name"
                      placeholder="e.g. Basic Cleaning" 
                      value={editFormData.name || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={editFormData.category || categories[0]} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Input 
                    id="description" 
                    placeholder="Brief description of the service" 
                    value={editFormData.description || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input 
                      type="number" 
                      id="price" 
                      placeholder="0.00" 
                      value={editFormData.price || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (hours) *</Label>
                    <Input 
                      type="number" 
                      id="duration" 
                      placeholder="1"
                      value={editFormData.duration || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="features">Features (one per line) *</Label>
                  <Textarea 
                    id="features"
                    className="min-h-[100px]"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    value={editFormData.features?.join('\n') || ''}
                    onChange={handleFeaturesChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPopular" 
                    checked={editFormData.isPopular || false}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="isPopular">Mark as popular</Label>
                </div>
                
                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentPlan(null);
                      setEditFormData({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSavePlan}>
                    Save Plan
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {hasUnpublishedChanges && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-800">
            You have unpublished changes. Click "Publish Changes" to make them visible in the mobile app.
          </p>
        </div>
      )}

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicePlans.map(plan => (
              <PricingPlanCard 
                key={plan.id} 
                plan={plan} 
                onEdit={handleEditPlan}
                onDelete={handleDeletePrompt}
              />
            ))}
          </div>
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category} value={category.toLowerCase()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicePlans
                .filter(plan => plan.category.toLowerCase() === category.toLowerCase())
                .map(plan => (
                  <PricingPlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onEdit={handleEditPlan}
                    onDelete={handleDeletePrompt}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this service plan? This action cannot be undone.</p>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePlan}>Delete Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PricingPlanCardProps {
  plan: ServicePlan;
  onEdit: (plan: ServicePlan) => void;
  onDelete: (planId: string) => void;
}

function PricingPlanCard({ plan, onEdit, onDelete }: PricingPlanCardProps) {
  return (
    <Card className={`p-4 relative ${plan.isPopular ? 'border-amber-400 border-2' : ''}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 right-4 bg-amber-400 text-xs font-bold px-3 py-1 rounded-full text-black">
          Popular
        </div>
      )}

      {!plan.published && (
        <div className="absolute -top-3 left-4 bg-blue-400 text-xs font-bold px-3 py-1 rounded-full text-white">
          Unpublished
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{plan.name}</h3>
          <p className="text-gray-500 text-sm">{plan.category}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl">${plan.price}</p>
          <p className="text-gray-500 text-xs">{plan.duration} hours</p>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
      
      <div className="mt-4">
        <p className="font-medium text-sm mb-2">Features:</p>
        <ul className="text-sm space-y-1">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(plan)}>
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(plan.id)}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
