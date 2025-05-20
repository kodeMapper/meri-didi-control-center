
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Filter, Search, Download, MoreVertical, Edit, Trash2, Copy, Plus, Calendar, Upload, AlertCircle, DollarSign, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PromoCode } from "@/types";

const samplePromoCodes: PromoCode[] = [
  {
    id: "57",
    code: "SAVE15",
    discount: 15,
    discountType: "Percentage",
    maxDiscount: 200,
    minOrderValue: 1000,
    expiryDate: "2025-04-09",
    usageLimit: 100,
    usageCount: 23,
    isActive: true,
    createdAt: "2025-03-15",
    description: "15% off on all services",
  },
  {
    id: "56",
    code: "SAVE20",
    discount: 20,
    discountType: "Percentage",
    maxDiscount: 300,
    minOrderValue: 1500,
    expiryDate: "2025-04-09",
    usageLimit: 50,
    usageCount: 12,
    isActive: true,
    createdAt: "2025-03-10",
    description: "20% off on all services",
  },
  {
    id: "54",
    code: "10%OFF",
    discount: 10,
    discountType: "Percentage",
    maxDiscount: 100,
    minOrderValue: 500,
    expiryDate: "2025-02-20",
    usageLimit: 200,
    usageCount: 87,
    isActive: true,
    createdAt: "2024-02-20",
    description: "10% off on all services",
  },
  {
    id: "53",
    code: "25%OFF",
    discount: 25,
    discountType: "Percentage",
    maxDiscount: 500,
    minOrderValue: 2000,
    expiryDate: "2024-02-20",
    usageLimit: 30,
    usageCount: 28,
    isActive: true,
    createdAt: "2024-02-20",
    description: "25% off on premium services",
  },
  {
    id: "52",
    code: "R&R",
    discount: 100,
    discountType: "Fixed",
    maxDiscount: undefined,
    minOrderValue: 500,
    expiryDate: "2032-02-20",
    usageLimit: 1000,
    usageCount: 243,
    isActive: true,
    createdAt: "2024-02-20",
    description: "Special referral discount",
  },
  {
    id: "51",
    code: "20OFF",
    discount: 20,
    discountType: "Fixed",
    maxDiscount: undefined,
    minOrderValue: 100,
    expiryDate: "2032-02-20",
    usageLimit: 5000,
    usageCount: 1203,
    isActive: true,
    createdAt: "2024-02-20",
    description: "Fixed ₹20 discount on all orders",
  },
  {
    id: "50",
    code: "FFF99",
    discount: 99,
    discountType: "Fixed",
    maxDiscount: undefined,
    minOrderValue: 500,
    expiryDate: "2024-02-29",
    usageLimit: 100,
    usageCount: 42,
    isActive: true,
    createdAt: "2024-02-20",
    description: "Special weekend discount",
  },
];

export default function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(samplePromoCodes);
  const [filter, setFilter] = useState<"all" | "active" | "deactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [newPromoCode, setNewPromoCode] = useState<Partial<PromoCode>>({
    code: "",
    discount: 0,
    discountType: "Percentage",
    maxDiscount: undefined,
    minOrderValue: 0,
    expiryDate: new Date().toISOString().split('T')[0],
    usageLimit: 100,
    isActive: true,
    description: "",
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const { toast } = useToast();

  const filteredPromoCodes = promoCodes
    .filter(code => {
      if (filter === "all") return true;
      return filter === "active" ? code.isActive : !code.isActive;
    })
    .filter(code => {
      if (!searchQuery) return true;
      return (
        code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.id.toString().includes(searchQuery) ||
        (code.description && code.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });

  const handleAddPromoCode = () => {
    if (!newPromoCode.code || !newPromoCode.discount || !newPromoCode.expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = (Math.max(0, ...promoCodes.map(c => parseInt(c.id))) + 1).toString();
    
    setPromoCodes([
      {
        id: newId,
        code: newPromoCode.code,
        discount: newPromoCode.discount,
        discountType: newPromoCode.discountType as "Percentage" | "Fixed",
        maxDiscount: newPromoCode.maxDiscount,
        minOrderValue: newPromoCode.minOrderValue,
        expiryDate: newPromoCode.expiryDate,
        usageLimit: newPromoCode.usageLimit || 100,
        usageCount: 0,
        isActive: newPromoCode.isActive || true,
        createdAt: new Date().toISOString().split('T')[0],
        description: newPromoCode.description,
      },
      ...promoCodes,
    ]);

    setNewPromoCode({
      code: "",
      discount: 0,
      discountType: "Percentage",
      maxDiscount: undefined,
      minOrderValue: 0,
      expiryDate: new Date().toISOString().split('T')[0],
      usageLimit: 100,
      isActive: true,
      description: "",
    });

    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Promocode has been added successfully",
    });
  };

  const handleEditPromoCode = () => {
    if (!editingCode || !newPromoCode.code || !newPromoCode.discount || !newPromoCode.expiryDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setPromoCodes(promoCodes.map(promo => 
      promo.id === editingCode.id 
        ? {
            ...promo,
            code: newPromoCode.code || promo.code,
            discount: newPromoCode.discount || promo.discount,
            discountType: newPromoCode.discountType as "Percentage" | "Fixed" || promo.discountType,
            maxDiscount: newPromoCode.maxDiscount,
            minOrderValue: newPromoCode.minOrderValue || promo.minOrderValue,
            expiryDate: newPromoCode.expiryDate || promo.expiryDate,
            usageLimit: newPromoCode.usageLimit || promo.usageLimit,
            isActive: newPromoCode.isActive !== undefined ? newPromoCode.isActive : promo.isActive,
            description: newPromoCode.description || promo.description,
          } 
        : promo
    ));

    setIsEditDialogOpen(false);
    setEditingCode(null);
    
    toast({
      title: "PromoCode Updated",
      description: "The promocode has been updated successfully",
    });
  };

  const handleDeletePromoCode = () => {
    if (codeToDelete === null) return;
    
    setPromoCodes(promoCodes.filter(promo => promo.id !== codeToDelete));
    setIsDeleteDialogOpen(false);
    setCodeToDelete(null);
    
    toast({
      title: "PromoCode Deleted",
      description: "The promocode has been deleted successfully",
    });
  };

  const handleToggleStatus = (id: string) => {
    setPromoCodes(promoCodes.map(promo => 
      promo.id === id 
        ? { ...promo, isActive: !promo.isActive } 
        : promo
    ));
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    
    toast({
      title: "Code Copied",
      description: `${code} has been copied to clipboard`,
    });
    
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const duplicatePromoCode = (promo: PromoCode) => {
    const newId = (Math.max(0, ...promoCodes.map(c => parseInt(c.id))) + 1).toString();
    
    const duplicated: PromoCode = {
      ...promo,
      id: newId,
      code: `${promo.code}_COPY`,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setPromoCodes([duplicated, ...promoCodes]);
    
    toast({
      title: "PromoCode Duplicated",
      description: `A copy of ${promo.code} has been created`,
    });
  };

  const openEditDialog = (promo: PromoCode) => {
    setEditingCode(promo);
    setNewPromoCode({
      code: promo.code,
      discount: promo.discount,
      discountType: promo.discountType,
      maxDiscount: promo.maxDiscount,
      minOrderValue: promo.minOrderValue,
      expiryDate: promo.expiryDate,
      usageLimit: promo.usageLimit,
      isActive: promo.isActive,
      description: promo.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setCodeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-1">
          <Plus size={16} />
          Add Promocodes
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex space-x-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
            className="text-sm h-9"
          >
            All
          </Button>
          <Button 
            variant={filter === "active" ? "default" : "outline"} 
            onClick={() => setFilter("active")}
            className="text-sm h-9"
          >
            Active
          </Button>
          <Button 
            variant={filter === "deactive" ? "default" : "outline"} 
            onClick={() => setFilter("deactive")}
            className="text-sm h-9"
          >
            Deactive
          </Button>
        </div>
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search promocodes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" title="More filters">
            <Filter size={18} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Provider Name</TableHead>
              <TableHead>Promo Code</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPromoCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  No promo codes found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPromoCodes.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.id}</TableCell>
                  <TableCell>
                    <div className="h-12 w-12 rounded overflow-hidden bg-gray-100">
                      <img
                        src="/placeholder.svg"
                        alt="Promo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{promo.id.includes("5") ? "amarik" : "Sameera"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-mono bg-gray-100 px-2 py-1 rounded text-sm cursor-pointer"
                        onClick={() => copyToClipboard(promo.code)}
                      >
                        {promo.code}
                      </span>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => copyToClipboard(promo.code)}
                      >
                        {copiedCode === promo.code ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>{promo.createdAt}</TableCell>
                  <TableCell>{promo.expiryDate}</TableCell>
                  <TableCell>
                    <button
                      className={`py-1 px-3 rounded-full text-xs font-medium ${
                        promo.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => handleToggleStatus(promo.id)}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicatePromoCode(promo)}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate Promocode</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(promo)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(promo.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {Math.min(1, filteredPromoCodes.length)} to {filteredPromoCodes.length} of {filteredPromoCodes.length} rows
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Rows per page:</span>
          <Select defaultValue="10">
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add Promo Code Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Promocode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="active-status">Status</Label>
                <div className="text-xs text-gray-500">Activate or deactivate this promo code</div>
              </div>
              <Switch 
                id="active-status"
                checked={newPromoCode.isActive} 
                onCheckedChange={(checked) => setNewPromoCode({...newPromoCode, isActive: checked})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Provider <span className="text-red-500">*</span></Label>
                <Select
                  value="amarik"
                  onValueChange={(value) => {}}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amarik">amarik</SelectItem>
                    <SelectItem value="sameera">Sameera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Promo Code <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="e.g. SUMMER25"
                  value={newPromoCode.code}
                  onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value.toUpperCase()})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    type="date"
                    className="pl-10"
                    value={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>End Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    type="date"
                    className="pl-10"
                    value={newPromoCode.expiryDate}
                    onChange={(e) => setNewPromoCode({...newPromoCode, expiryDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label>Minimum Booking Amount <span className="text-red-500">*</span></Label>
                  <Info 
                    size={14} 
                    className="ml-1 text-gray-400"
                    title="Minimum order value required to apply this promo code" 
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    type="number"
                    className="pl-10"
                    placeholder="0"
                    value={newPromoCode.minOrderValue || ""}
                    onChange={(e) => setNewPromoCode({
                      ...newPromoCode, 
                      minOrderValue: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label>No. of Users <span className="text-red-500">*</span></Label>
                  <Info 
                    size={14} 
                    className="ml-1 text-gray-400"
                    title="Maximum number of times this code can be used" 
                  />
                </div>
                <Input 
                  type="number"
                  placeholder="100"
                  value={newPromoCode.usageLimit || ""}
                  onChange={(e) => setNewPromoCode({
                    ...newPromoCode, 
                    usageLimit: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  placeholder="10"
                  value={newPromoCode.discount || ""}
                  onChange={(e) => setNewPromoCode({
                    ...newPromoCode, 
                    discount: e.target.value ? parseInt(e.target.value) : 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Discount Type <span className="text-red-500">*</span></Label>
                <Select
                  value={newPromoCode.discountType}
                  onValueChange={(value) => setNewPromoCode({
                    ...newPromoCode, 
                    discountType: value as "Percentage" | "Fixed"
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Label>Max Discount Amount {newPromoCode.discountType === "Percentage" && <span className="text-red-500">*</span>}</Label>
                <Info 
                  size={14} 
                  className="ml-1 text-gray-400"
                  title="Maximum discount amount when using percentage" 
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  type="number"
                  className="pl-10"
                  placeholder="500"
                  value={newPromoCode.maxDiscount || ""}
                  onChange={(e) => setNewPromoCode({
                    ...newPromoCode, 
                    maxDiscount: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  disabled={newPromoCode.discountType !== "Percentage"}
                />
              </div>
              {newPromoCode.discountType === "Percentage" && !newPromoCode.maxDiscount && (
                <p className="text-xs text-amber-500 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  Setting a maximum discount is recommended for percentage discounts
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                placeholder="Description or terms for this promocode"
                value={newPromoCode.description || ""}
                onChange={(e) => setNewPromoCode({...newPromoCode, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Image <span className="text-red-500">*</span></Label>
              <div 
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById('promoImageInput')?.click()}
              >
                <div className="py-6">
                  <div className="flex justify-center mb-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Drag & Drop your files or Browse</p>
                </div>
                <input 
                  type="file"
                  id="promoImageInput"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Repeat Usage</Label>
                <Switch defaultChecked={false} />
              </div>
              <p className="text-xs text-gray-500">Allow users to use this promo code multiple times</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPromoCode}>
              Add Promocode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promo Code Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Promocode</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as add dialog but filled with existing data */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="edit-active-status">Status</Label>
                <div className="text-xs text-gray-500">Activate or deactivate this promo code</div>
              </div>
              <Switch 
                id="edit-active-status"
                checked={newPromoCode.isActive} 
                onCheckedChange={(checked) => setNewPromoCode({...newPromoCode, isActive: checked})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input value={editingCode?.id.includes("5") ? "amarik" : "Sameera"} disabled />
              </div>
              
              <div className="space-y-2">
                <Label>Promo Code <span className="text-red-500">*</span></Label>
                <Input 
                  value={newPromoCode.code}
                  onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value.toUpperCase()})}
                />
              </div>
            </div>
            
            {/* And so on for the rest of the form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>End Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input 
                    type="date"
                    className="pl-10"
                    value={newPromoCode.expiryDate}
                    onChange={(e) => setNewPromoCode({...newPromoCode, expiryDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label>No. of Users <span className="text-red-500">*</span></Label>
                  <Info 
                    size={14} 
                    className="ml-1 text-gray-400"
                    title="Maximum number of times this code can be used" 
                  />
                </div>
                <Input 
                  type="number"
                  value={newPromoCode.usageLimit || ""}
                  onChange={(e) => setNewPromoCode({
                    ...newPromoCode, 
                    usageLimit: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  value={newPromoCode.discount || ""}
                  onChange={(e) => setNewPromoCode({
                    ...newPromoCode, 
                    discount: e.target.value ? parseInt(e.target.value) : 0
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Discount Type <span className="text-red-500">*</span></Label>
                <Select
                  value={newPromoCode.discountType}
                  onValueChange={(value) => setNewPromoCode({
                    ...newPromoCode, 
                    discountType: value as "Percentage" | "Fixed"
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Label>Max Discount Amount {newPromoCode.discountType === "Percentage" && <span className="text-red-500">*</span>}</Label>
                <Info 
                  size={14} 
                  className="ml-1 text-gray-400"
                  title="Maximum discount amount when using percentage" 
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  type="number"
                  className="pl-10"
                  placeholder="500"
                  value={newPromoCode.maxDiscount || ""}
                  onChange={(e) => setNewPromoCode({
                    ...newPromoCode, 
                    maxDiscount: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  disabled={newPromoCode.discountType !== "Percentage"}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                value={newPromoCode.description || ""}
                onChange={(e) => setNewPromoCode({...newPromoCode, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Usage Statistics</Label>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Times Used:</span>
                    <span className="font-medium">{editingCode?.usageCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Usage Limit:</span>
                    <span className="font-medium">{newPromoCode.usageLimit || 100}</span>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 h-2 rounded-full w-full">
                      <div 
                        className={cn(
                          "h-2 rounded-full bg-primary",
                          editingCode && newPromoCode.usageLimit && 
                          (editingCode.usageCount / newPromoCode.usageLimit > 0.8) 
                            ? "bg-red-500" 
                            : (editingCode.usageCount / newPromoCode.usageLimit > 0.5) 
                              ? "bg-yellow-500" 
                              : "bg-green-500"
                        )} 
                        style={{ 
                          width: `${editingCode && newPromoCode.usageLimit ? 
                            Math.min(100, (editingCode.usageCount / newPromoCode.usageLimit) * 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1 text-gray-500">
                      {editingCode && newPromoCode.usageLimit ? 
                        Math.round((editingCode.usageCount / newPromoCode.usageLimit) * 100) : 0}% used
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPromoCode}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Promocode</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this promocode? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePromoCode}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
