
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Filter, Search, Download, MoreVertical, Edit, Trash2, Plus, Upload, Image } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Slider {
  id: number;
  type: string;
  appImage: string | null;
  webImage: string | null;
  createdAt: string;
  status: "Active" | "Deactive";
}

const initialSliders: Slider[] = [
  {
    id: 39,
    type: "Category",
    appImage: "/placeholder.svg",
    webImage: "/placeholder.svg",
    createdAt: "2025-05-15",
    status: "Active",
  },
  {
    id: 38,
    type: "Category",
    appImage: null,
    webImage: null,
    createdAt: "2025-05-10",
    status: "Active",
  },
  {
    id: 37,
    type: "Promotion",
    appImage: "/placeholder.svg",
    webImage: "/placeholder.svg",
    createdAt: "2025-05-05",
    status: "Deactive",
  },
];

export default function SliderManagement() {
  const [sliders, setSliders] = useState<Slider[]>(initialSliders);
  const [filter, setFilter] = useState<"all" | "active" | "deactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSlider, setNewSlider] = useState({
    type: "",
    appImage: null as File | null,
    appImagePreview: "",
    webImage: null as File | null,
    webImagePreview: "",
    status: true,
  });
  const [sliderToDelete, setSliderToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  
  const { toast } = useToast();

  const filteredSliders = sliders
    .filter(slider => {
      if (filter === "all") return true;
      return filter === "active" ? slider.status === "Active" : slider.status === "Deactive";
    })
    .filter(slider => {
      if (!searchQuery) return true;
      return (
        slider.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        slider.id.toString().includes(searchQuery.toLowerCase())
      );
    });

  const handleAppImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSlider({
        ...newSlider,
        appImage: file,
        appImagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleWebImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSlider({
        ...newSlider,
        webImage: file,
        webImagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleAddSlider = () => {
    if (!newSlider.type) {
      toast({
        title: "Missing Information",
        description: "Please select a slider type",
        variant: "destructive",
      });
      return;
    }

    if (!newSlider.appImage && !newSlider.webImage) {
      toast({
        title: "Missing Image",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(0, ...sliders.map(s => s.id)) + 1;
    
    setSliders([
      {
        id: newId,
        type: newSlider.type,
        appImage: newSlider.appImagePreview || null,
        webImage: newSlider.webImagePreview || null,
        createdAt: new Date().toISOString().split('T')[0],
        status: newSlider.status ? "Active" : "Deactive",
      },
      ...sliders,
    ]);

    setNewSlider({
      type: "",
      appImage: null,
      appImagePreview: "",
      webImage: null,
      webImagePreview: "",
      status: true,
    });

    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Slider has been added successfully",
    });
  };

  const handleToggleStatus = (id: number) => {
    setSliders(sliders.map(slider => 
      slider.id === id 
        ? { ...slider, status: slider.status === "Active" ? "Deactive" : "Active" } 
        : slider
    ));
  };

  const openDeleteDialog = (id: number) => {
    setSliderToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSlider = () => {
    if (sliderToDelete === null) return;
    
    setSliders(sliders.filter(slider => slider.id !== sliderToDelete));
    setIsDeleteDialogOpen(false);
    setSliderToDelete(null);
    
    toast({
      title: "Slider Deleted",
      description: "The slider has been deleted successfully",
    });
  };

  const openEditDialog = (slider: Slider) => {
    setEditingSlider(slider);
    setNewSlider({
      type: slider.type,
      appImage: null,
      appImagePreview: slider.appImage || "",
      webImage: null,
      webImagePreview: slider.webImage || "",
      status: slider.status === "Active",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSlider = () => {
    if (!editingSlider || !newSlider.type) return;

    setSliders(sliders.map(slider => 
      slider.id === editingSlider.id 
        ? {
            ...slider,
            type: newSlider.type,
            appImage: newSlider.appImagePreview || slider.appImage,
            webImage: newSlider.webImagePreview || slider.webImage,
            status: newSlider.status ? "Active" : "Deactive",
          } 
        : slider
    ));

    setIsEditDialogOpen(false);
    setEditingSlider(null);
    
    toast({
      title: "Slider Updated",
      description: "The slider has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Slider Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add New Slider</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Active</span>
                <Switch checked={newSlider.status} onCheckedChange={(checked) => setNewSlider({...newSlider, status: checked})} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
              <Select
                value={newSlider.type}
                onValueChange={(value) => setNewSlider({...newSlider, type: value})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Category">Category</SelectItem>
                  <SelectItem value="Promotion">Promotion</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appImage">
                App Image <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-1">(We recommend to use 345 X 163)</span>
              </Label>
              <div 
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById('appImageInput')?.click()}
              >
                {newSlider.appImagePreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={newSlider.appImagePreview} 
                      alt="App preview" 
                      className="h-32 object-contain mb-2" 
                    />
                    <p className="text-sm text-primary">Click to change</p>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="flex justify-center mb-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Drag & Drop your files or Browse</p>
                  </div>
                )}
                <input 
                  type="file"
                  id="appImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAppImageChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webImage">
                Web Image <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-1">(We recommend to use 1920 x 500)</span>
              </Label>
              <div 
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById('webImageInput')?.click()}
              >
                {newSlider.webImagePreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={newSlider.webImagePreview} 
                      alt="Web preview" 
                      className="h-32 object-contain mb-2" 
                    />
                    <p className="text-sm text-primary">Click to change</p>
                  </div>
                ) : (
                  <div className="py-6">
                    <div className="flex justify-center mb-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Drag & Drop your files or Browse</p>
                  </div>
                )}
                <input 
                  type="file"
                  id="webImageInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleWebImageChange}
                />
              </div>
            </div>
            
            <Button onClick={handleAddSlider} className="w-full mt-4">
              Add New Slider
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All Sliders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    placeholder="Search sliders..."
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
                    <TableHead>ID</TableHead>
                    <TableHead>App Image</TableHead>
                    <TableHead>Web Image</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSliders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        No sliders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSliders.map((slider) => (
                      <TableRow key={slider.id}>
                        <TableCell className="font-medium">{slider.id}</TableCell>
                        <TableCell>
                          {slider.appImage ? (
                            <div className="h-12 w-12 rounded overflow-hidden">
                              <img
                                src={slider.appImage}
                                alt="App slider"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded">
                              <Image size={18} className="text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {slider.webImage ? (
                            <div className="h-12 w-12 rounded overflow-hidden">
                              <img
                                src={slider.webImage}
                                alt="Web slider"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded">
                              <Image size={18} className="text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{slider.type}</TableCell>
                        <TableCell>
                          <button
                            className={`py-1 px-3 rounded-full text-xs font-medium ${
                              slider.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                            onClick={() => handleToggleStatus(slider.id)}
                          >
                            {slider.status}
                          </button>
                        </TableCell>
                        <TableCell>{slider.createdAt}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(slider)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Slider</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(slider.id)}
                                className="text-red-500 focus:text-red-500"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete slider</span>
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
                Showing {Math.min(1, filteredSliders.length)} to {filteredSliders.length} of {filteredSliders.length} rows
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
          </CardContent>
        </Card>
      </div>

      {/* Edit Slider Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Slider</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-status">Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm">{newSlider.status ? "Active" : "Inactive"}</span>
                <Switch 
                  id="edit-status"
                  checked={newSlider.status} 
                  onCheckedChange={(checked) => setNewSlider({...newSlider, status: checked})} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type <span className="text-red-500">*</span></Label>
              <Select
                value={newSlider.type}
                onValueChange={(value) => setNewSlider({...newSlider, type: value})}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Category">Category</SelectItem>
                  <SelectItem value="Promotion">Promotion</SelectItem>
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                  <SelectItem value="Featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>App Image Preview</Label>
                <div className="border rounded-md p-2 flex items-center justify-center h-40">
                  {newSlider.appImagePreview ? (
                    <img
                      src={newSlider.appImagePreview}
                      alt="App slider preview"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No image</div>
                  )}
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById('editAppImageInput')?.click()}
                  >
                    Change App Image
                  </Button>
                  <input 
                    type="file"
                    id="editAppImageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAppImageChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Web Image Preview</Label>
                <div className="border rounded-md p-2 flex items-center justify-center h-40">
                  {newSlider.webImagePreview ? (
                    <img
                      src={newSlider.webImagePreview}
                      alt="Web slider preview"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No image</div>
                  )}
                </div>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => document.getElementById('editWebImageInput')?.click()}
                  >
                    Change Web Image
                  </Button>
                  <input 
                    type="file"
                    id="editWebImageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleWebImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSlider}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Slider</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this slider? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSlider}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
