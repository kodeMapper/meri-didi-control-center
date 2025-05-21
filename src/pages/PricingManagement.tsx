
import { useState } from 'react';
import { ServiceCategory, ServiceType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Plus } from 'lucide-react';

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
      createdAt: new Date().toISOString()
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
      createdAt: new Date().toISOString()
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
      createdAt: new Date().toISOString()
    }
  ]);

  const categories: ServiceCategory[] = ['Cleaning', 'Cooking', 'Driving', 'Sweeping', 'Landscaping'];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Service Pricing Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input id="name" placeholder="e.g. Basic Cleaning" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select 
                    id="category"
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the service" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input type="number" id="price" placeholder="0.00" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input type="number" id="duration" placeholder="1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="features">Features (one per line)</Label>
                <textarea 
                  id="features"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                ></textarea>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isPopular" className="rounded border-gray-300" />
                <Label htmlFor="isPopular">Mark as popular</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Plan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
              <PricingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category} value={category.toLowerCase()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicePlans
                .filter(plan => plan.category.toLowerCase() === category.toLowerCase())
                .map(plan => (
                  <PricingPlanCard key={plan.id} plan={plan} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface PricingPlanCardProps {
  plan: ServicePlan;
}

function PricingPlanCard({ plan }: PricingPlanCardProps) {
  return (
    <Card className={`p-4 relative ${plan.isPopular ? 'border-yellow-400 border-2' : ''}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 right-4 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full text-black">
          Popular
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
        <Button variant="outline" size="sm">
          <Edit2 className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
