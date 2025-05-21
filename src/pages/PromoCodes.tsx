import { useState } from 'react';
import { PromoCode } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Plus, Percent, Tag } from 'lucide-react';

export default function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: "1",
      code: "WELCOME20",
      discount: 20,
      expiresAt: "2025-12-31T23:59:59Z",
      isActive: true,
      usageLimit: 100,
      usedCount: 42,
      createdAt: "2025-01-01T00:00:00Z",
      description: "20% off for new customers"
    },
    {
      id: "2",
      code: "SUMMER25",
      discount: 25,
      expiresAt: "2025-06-30T23:59:59Z",
      isActive: true,
      usageLimit: 50,
      usedCount: 12,
      createdAt: "2025-05-01T00:00:00Z",
      description: "Summer special discount"
    }
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Promo Codes Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Promo Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="code">Promo Code</Label>
                <Input id="code" placeholder="e.g. SUMMER25" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input type="number" id="discount" placeholder="e.g. 25" />
                </div>
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input type="number" id="usageLimit" placeholder="e.g. 100" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the promo code" />
              </div>
              
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input type="date" id="expiryDate" />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isActive" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Promo Code</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoCodes.map(promoCode => (
          <PromoCodeCard key={promoCode.id} promoCode={promoCode} />
        ))}
      </div>
    </div>
  );
}

interface PromoCodeCardProps {
  promoCode: PromoCode;
}

function PromoCodeCard({ promoCode }: PromoCodeCardProps) {
  const isExpired = new Date(promoCode.expiresAt) < new Date();
  const usagePercentage = (promoCode.usedCount || 0) / promoCode.usageLimit * 100;
  
  return (
    <Card className={`p-4 ${isExpired ? 'bg-gray-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Tag className="h-5 w-5 mr-2 text-yellow-500" />
          <h3 className="font-bold text-lg">{promoCode.code}</h3>
        </div>
        <div className="text-right">
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            <Percent className="h-4 w-4 mr-1" />
            {promoCode.discount}% OFF
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{promoCode.description}</p>
      
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Usage:</span>
          <span>
            {promoCode.usedCount} / {promoCode.usageLimit}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className={`h-full rounded-full ${isExpired ? 'bg-gray-400' : 'bg-yellow-500'}`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-3">
          <span>Expires:</span>
          <span className={isExpired ? 'text-red-500' : ''}>
            {new Date(promoCode.expiresAt).toLocaleDateString()}
            {isExpired && ' (Expired)'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${promoCode.isActive && !isExpired ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="text-sm">{promoCode.isActive && !isExpired ? 'Active' : 'Inactive'}</span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
