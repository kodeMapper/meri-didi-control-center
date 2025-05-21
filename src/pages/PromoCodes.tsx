import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PromoCode } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  ChevronDown, 
  Copy,
  Edit,
  MoreVertical,
  Plus, 
  RefreshCw, 
  Search, 
  Tag,
  Trash,
  X,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const generateMockPromoCodes = (): PromoCode[] => {
  return [
    {
      id: "promo-1",
      code: "SUMMER20",
      discount: 20,
      discountType: "Percentage",
      maxDiscount: 500,
      minOrderValue: 500,
      expiryDate: "2024-08-31",
      usageLimit: 100,
      usageCount: 25,
      isActive: true,
      createdAt: "2024-06-01",
      description: "20% off on all services this summer!",
    },
    {
      id: "promo-2",
      code: "WELCOME100",
      discount: 100,
      discountType: "Fixed",
      expiryDate: "2024-07-15",
      usageLimit: 50,
      usageCount: 10,
      isActive: true,
      createdAt: "2024-06-05",
      description: "₹100 off on your first booking!",
    },
    {
      id: "promo-3",
      code: "CLEANING15",
      discount: 15,
      discountType: "Percentage",
      expiryDate: "2024-09-30",
      usageLimit: 75,
      usageCount: 60,
      isActive: false,
      createdAt: "2024-06-10",
      description: "15% off on all cleaning services.",
    },
    {
      id: "promo-4",
      code: "FREEDRIVE",
      discount: 100,
      discountType: "Percentage",
      maxDiscount: 200,
      minOrderValue: 1000,
      expiryDate: "2024-08-15",
      usageLimit: 30,
      usageCount: 5,
      isActive: true,
      createdAt: "2024-06-15",
      description: "Free driving service for orders above ₹1000.",
    },
  ];
};

const isPromoExpired = (expiryDate: string): boolean => {
  return new Date(expiryDate) < new Date();
};

export default function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(generateMockPromoCodes());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [promoCodeToEdit, setPromoCodeToEdit] = useState<PromoCode | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "Percentage" as "Percentage" | "Fixed",
    maxDiscount: "",
    minOrderValue: "",
    expiryDate: "",
    usageLimit: "",
    description: "",
    isActive: true,
  });
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreatePromoCode = () => {
    if (!formData.code || !formData.discount || !formData.expiryDate || !formData.usageLimit) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newPromoCode: PromoCode = {
      id: `promo-${Math.floor(Math.random() * 1000)}`,
      code: formData.code,
      discount: Number(formData.discount),
      discountType: formData.discountType,
      maxDiscount: formData.discountType === "Percentage" && formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
      expiryDate: formData.expiryDate,
      usageLimit: Number(formData.usageLimit),
      usageCount: 0,
      isActive: formData.isActive,
      createdAt: new Date().toISOString().split('T')[0],
      description: formData.description,
    };

    setPromoCodes([...promoCodes, newPromoCode]);
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Success",
      description: "Promo code has been created successfully.",
    });
  };

  const handleEditPromoCode = () => {
    if (!promoCodeToEdit) return;

    if (!formData.code || !formData.discount || !formData.expiryDate || !formData.usageLimit) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedPromoCodes = promoCodes.map(promo =>
      promo.id === promoCodeToEdit.id
        ? {
            ...promo,
            code: formData.code,
            discount: Number(formData.discount),
            discountType: formData.discountType,
            maxDiscount: formData.discountType === "Percentage" && formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
            minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
            expiryDate: formData.expiryDate,
            usageLimit: Number(formData.usageLimit),
            isActive: formData.isActive,
            description: formData.description,
          }
        : promo
    );

    setPromoCodes(updatedPromoCodes);
    setIsEditDialogOpen(false);
    setPromoCodeToEdit(null);
    resetForm();

    toast({
      title: "Success",
      description: "Promo code has been updated successfully.",
    });
  };

  const handleDeletePromoCode = () => {
    if (!promoCodeToDelete) return;

    setPromoCodes(promoCodes.filter(promo => promo.id !== promoCodeToDelete));
    setIsDeleteDialogOpen(false);
    setPromoCodeToDelete(null);

    toast({
      title: "Success",
      description: "Promo code has been deleted successfully.",
    });
  };

  const openEditDialog = (promo: PromoCode) => {
    setPromoCodeToEdit(promo);
    setFormData({
      code: promo.code,
      discount: String(promo.discount),
      discountType: promo.discountType,
      maxDiscount: String(promo.maxDiscount || ""),
      minOrderValue: String(promo.minOrderValue || ""),
      expiryDate: promo.expiryDate,
      usageLimit: String(promo.usageLimit),
      description: promo.description || "",
      isActive: promo.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discount: "",
      discountType: "Percentage",
      maxDiscount: "",
      minOrderValue: "",
      expiryDate: "",
      usageLimit: "",
      description: "",
      isActive: true,
    });
  };

  const togglePromoCodeStatus = (id: string, currentStatus: boolean) => {
    const updatedPromoCodes = promoCodes.map(promo =>
      promo.id === id ? { ...promo, isActive: !currentStatus } : promo
    );
    setPromoCodes(updatedPromoCodes);

    toast({
      title: `Promo Code ${currentStatus ? 'Deactivated' : 'Activated'}`,
      description: `The promo code has been ${currentStatus ? 'deactivated' : 'activated'}.`,
    });
  };

  const filteredPromoCodes = promoCodes.filter(promo => {
    const searchLower = searchQuery.toLowerCase();
    return (
      promo.code.toLowerCase().includes(searchLower) ||
      (promo.description && promo.description.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Create Promo Code
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Promo Code</DialogTitle>
                <DialogDescription>
                  Create a new promo code to offer discounts to your customers.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g. SUMMER20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount <span className="text-red-500">*</span></Label>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => setFormData({ ...formData, discountType: value as "Percentage" | "Fixed" })}
                  >
                    <SelectTrigger id="discountType">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.discountType === "Percentage" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxDiscount">Max Discount</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                        placeholder="e.g. 500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minOrderValue">Min Order Value</Label>
                      <Input
                        id="minOrderValue"
                        type="number"
                        value={formData.minOrderValue}
                        onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date <span className="text-red-500">*</span></Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit <span className="text-red-500">*</span></Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A brief description of the promo code"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive === true}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
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
                <Button type="button" onClick={handleCreatePromoCode}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Promo Codes</CardTitle>
              <CardDescription>Manage your promo codes and discounts</CardDescription>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Search size={16} className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500 peer-focus:text-gray-900 dark:text-gray-400 dark:peer-focus:text-gray-100" />
              <Input 
                placeholder="Search promo codes..." 
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {filteredPromoCodes.length === 0 ? (
            <div className="text-center py-8">
              <Tag size={48} className="mx-auto text-gray-400" />
              <h2 className="text-xl font-semibold mt-4 text-gray-500">No promo codes found</h2>
              <p className="text-gray-400">Create a new promo code to offer discounts to your customers.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredPromoCodes.map((promo) => {
                const expired = isPromoExpired(promo.expiryDate);
                return (
                  <Card key={promo.id} className={`overflow-hidden ${(!promo.isActive || expired) ? 'opacity-70' : ''}`}>
                    <div className={`p-4 border-l-4 ${expired ? 'border-gray-300' : (promo.isActive ? 'border-green-400' : 'border-gray-300')}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{promo.code}</CardTitle>
                          <CardDescription>
                            {promo.discountType === "Percentage" ? `${promo.discount}% off` : `₹${promo.discount} off`}
                            {promo.maxDiscount && ` (Max ₹${promo.maxDiscount})`}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(promo)}>
                              <Edit size={16} className="mr-2" />
                              Edit Promo Code
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setPromoCodeToDelete(promo.id);
                              setIsDeleteDialogOpen(true);
                            }} className="text-red-600 focus:text-red-600">
                              <Trash size={16} className="mr-2" />
                              Delete Promo Code
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        {promo.description && <p>{promo.description}</p>}
                        <p>
                          Expiry Date: {new Date(promo.expiryDate).toLocaleDateString()}
                        </p>
                        <p>Usage: {promo.usageCount}/{promo.usageLimit}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            navigator.clipboard.writeText(promo.code);
                            toast({
                              title: "Copied!",
                              description: "Promo code copied to clipboard.",
                            });
                          }}
                        >
                          <Copy size={16} className="mr-2" />
                          Copy Code
                        </Button>
                        
                        <Checkbox
                          id={`promo-${promo.id}`}
                          checked={promo.isActive}
                          onCheckedChange={() => togglePromoCodeStatus(promo.id, promo.isActive)}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Promo Code Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Promo Code</DialogTitle>
            <DialogDescription>
              Edit the details of this promo code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SUMMER20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Discount <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder="e.g. 20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-discountType">Discount Type</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => setFormData({ ...formData, discountType: value as "Percentage" | "Fixed" })}
              >
                <SelectTrigger id="edit-discountType">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.discountType === "Percentage" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-maxDiscount">Max Discount</Label>
                  <Input
                    id="edit-maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g. 500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-minOrderValue">Min Order Value</Label>
                  <Input
                    id="edit-minOrderValue"
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Expiry Date <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-usageLimit">Usage Limit <span className="text-red-500">*</span></Label>
                <Input
                  id="edit-usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A brief description of the promo code"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-isActive"
                checked={formData.isActive === true}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setPromoCodeToEdit(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditPromoCode}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promo code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeletePromoCode}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
