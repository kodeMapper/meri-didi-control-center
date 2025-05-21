
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GalleryItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { 
  Filter, 
  Grid, 
  ImageIcon, 
  MoreVertical, 
  Plus, 
  Search, 
  Trash, 
  Upload,
  Edit,
  ExternalLink,
  Copy,
  Check,
  Video
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Mock data
const generateMockGalleryItems = (): GalleryItem[] => {
  const categories = ["Slider", "Banner", "Customer Testimonial", "Worker Testimonial", "Service", "Advertisement", "General"];
  
  const items: GalleryItem[] = [];
  for (let i = 1; i <= 20; i++) {
    items.push({
      id: `gallery-${i}`,
      title: `Image ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      imageUrl: `/placeholder.svg`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      order: i,
      isActive: Math.random() > 0.2,
      mediaType: Math.random() > 0.7 ? "video" : "image",
    });
  }
  
  return items;
};

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(generateMockGalleryItems());
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMediaType, setSelectedMediaType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("images");
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    mediaType: "image",
    isActive: true,
  });
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  const { toast } = useToast();
  
  const categories = ["Slider", "Banner", "Customer Testimonial", "Worker Testimonial", "Service", "Advertisement", "General"];

  const filteredGalleryItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesMediaType = selectedMediaType === "all" || item.mediaType === selectedMediaType;
    return matchesSearch && matchesCategory && matchesMediaType;
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMedia = () => {
    if (!selectedImage || !formData.title) {
      toast({
        title: "Missing Information",
        description: "Please select a media file and provide a title",
        variant: "destructive",
      });
      return;
    }

    const newGalleryItem: GalleryItem = {
      id: `gallery-${Math.floor(Math.random() * 10000)}`,
      title: formData.title,
      category: formData.category,
      imageUrl: imagePreview || `/placeholder.svg`,
      createdAt: new Date().toISOString(),
      order: galleryItems.length + 1,
      isActive: formData.isActive,
      mediaType: formData.mediaType,
    };

    setGalleryItems([newGalleryItem, ...galleryItems]);
    resetForm();
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Success",
      description: `${formData.mediaType === 'video' ? 'Video' : 'Image'} has been uploaded successfully`,
    });
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    setGalleryItems(galleryItems.filter(item => item.id !== itemToDelete));
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    
    toast({
      title: "Success",
      description: "Media has been deleted successfully",
    });
  };

  const toggleItemStatus = (id: string) => {
    const updatedItems = galleryItems.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    setGalleryItems(updatedItems);
    
    const item = galleryItems.find(i => i.id === id);
    toast({
      title: item?.isActive ? "Item Deactivated" : "Item Activated",
      description: `The ${item?.mediaType} has been ${item?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const copyItemUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedToClipboard(true);
    
    toast({
      title: "Copied",
      description: "URL has been copied to clipboard",
    });
    
    setTimeout(() => setCopiedToClipboard(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "General",
      mediaType: "image", 
      isActive: true,
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="space-y-6 bg-[#FEF7CD]/10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gallery & Testimonials</h1>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")} className="mr-2">
            <TabsList className="grid w-16 grid-cols-2">
              <TabsTrigger value="grid" className="px-2">
                <Grid size={18} />
              </TabsTrigger>
              <TabsTrigger value="list" className="px-2">
                <ImageIcon size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Upload Media
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="customerTestimonials">Customer Testimonials</TabsTrigger>
          <TabsTrigger value="workerTestimonials">Worker Testimonials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Image Gallery</CardTitle>
                  <CardDescription>Manage your image collection for website and app</CardDescription>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="relative w-full sm:w-auto">
                    <Search size={16} className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search images..."
                      className="pl-10 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredGalleryItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No media found. Try changing your search or upload a new item.</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredGalleryItems.map((item) => (
                    <div key={item.id} className={`relative group rounded-md border overflow-hidden ${!item.isActive && 'opacity-70'}`}>
                      <div className="aspect-square relative">
                        <div className="absolute top-2 left-2 z-10">
                          {item.mediaType === "video" && (
                            <Badge variant="secondary" className="bg-black/60 text-white">
                              <Video size={12} className="mr-1" />
                              Video
                            </Badge>
                          )}
                        </div>
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8">
                                  <MoreVertical size={14} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => copyItemUrl(item.imageUrl)}>
                                  <Copy size={14} className="mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit size={14} className="mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleItemStatus(item.id)}>
                                  {item.isActive ? (
                                    <>
                                      <Trash size={14} className="mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Check size={14} className="mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setItemToDelete(item.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 bg-muted/20">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {!item.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Media</th>
                        <th className="px-4 py-3 text-left font-medium">Title</th>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Category</th>
                        <th className="px-4 py-3 text-left font-medium">Created At</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGalleryItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-3">
                            <div className="h-12 w-12 rounded overflow-hidden relative">
                              {item.mediaType === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Video size={16} className="text-white" />
                                </div>
                              )}
                              <img 
                                src={item.imageUrl} 
                                alt={item.title} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{item.title}</td>
                          <td className="px-4 py-3">
                            <Badge variant={item.mediaType === "video" ? "secondary" : "outline"}>
                              {item.mediaType === "video" ? "Video" : "Image"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant={item.isActive ? "success" : "secondary"}>
                              {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => copyItemUrl(item.imageUrl)}>
                                  <Copy size={16} className="mr-2" />
                                  Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit size={16} className="mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleItemStatus(item.id)}>
                                  {item.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setItemToDelete(item.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash size={16} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredGalleryItems.length} of {galleryItems.length} items
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customerTestimonials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Testimonial Videos</CardTitle>
              <CardDescription>Upload and manage customer testimonial videos for your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={() => {
                  setFormData({...formData, category: "Customer Testimonial", mediaType: "video"});
                  setIsUploadDialogOpen(true);
                }}>
                  <Upload size={16} className="mr-2" />
                  Upload Customer Testimonial
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems
                    .filter(item => item.category === "Customer Testimonial" && item.mediaType === "video")
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="border rounded-md overflow-hidden">
                        <div className="aspect-video relative bg-gray-100">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video size={32} className="text-gray-400" />
                          </div>
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Button variant="secondary" size="sm">
                              <Play className="mr-2 h-4 w-4" />
                              Play
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">Uploaded on {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
                
                {galleryItems.filter(item => item.category === "Customer Testimonial" && item.mediaType === "video").length === 0 && (
                  <div className="text-center py-12 border rounded-md bg-muted/10">
                    <Video className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium">No Customer Testimonials</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload customer testimonial videos to showcase on your platform</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workerTestimonials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Worker Testimonial Videos</CardTitle>
              <CardDescription>Upload and manage videos of worker testimonials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={() => {
                  setFormData({...formData, category: "Worker Testimonial", mediaType: "video"});
                  setIsUploadDialogOpen(true);
                }}>
                  <Upload size={16} className="mr-2" />
                  Upload Worker Testimonial
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryItems
                    .filter(item => item.category === "Worker Testimonial" && item.mediaType === "video")
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="border rounded-md overflow-hidden">
                        <div className="aspect-video relative bg-gray-100">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video size={32} className="text-gray-400" />
                          </div>
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Button variant="secondary" size="sm">
                              <Play className="mr-2 h-4 w-4" />
                              Play
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">Uploaded on {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
                
                {galleryItems.filter(item => item.category === "Worker Testimonial" && item.mediaType === "video").length === 0 && (
                  <div className="text-center py-12 border rounded-md bg-muted/10">
                    <Video className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="mt-4 text-lg font-medium">No Worker Testimonials</h3>
                    <p className="text-sm text-gray-500 mt-1">Upload worker testimonial videos to showcase on your platform</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Upload Media Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Upload New {formData.mediaType === 'video' ? 'Video' : 'Image'}</DialogTitle>
            <DialogDescription>
              Add a new {formData.mediaType === 'video' ? 'video' : 'image'} to your gallery collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <Select 
                value={formData.mediaType} 
                onValueChange={(value: string) => setFormData({...formData, mediaType: value as "image" | "video"})}
              >
                <SelectTrigger id="mediaType">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">{formData.mediaType === 'video' ? 'Video' : 'Image'} <span className="text-red-500">*</span></Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[200px] object-contain mb-3" 
                    />
                    <p className="text-sm text-primary">{formData.mediaType === 'video' ? 'Video' : 'Image'} selected</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-300" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept={formData.mediaType === 'video' ? "video/*" : "image/*"}
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      {formData.mediaType === 'video' ? 'MP4, WebM, OGG up to 100MB' : 'PNG, JPG, GIF up to 10MB'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              setIsUploadDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button type="button" onClick={handleUploadMedia}>
              Upload {formData.mediaType === 'video' ? 'Video' : 'Image'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Adding missing Play component
const Play = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);
