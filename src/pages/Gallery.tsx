
import { useState } from 'react';
import { GalleryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, Video, Upload, Plus, Trash2 } from 'lucide-react';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: '1',
      title: 'Happy Customer with Cleaner',
      category: 'Customer Testimonial',
      imageUrl: 'https://via.placeholder.com/400x300',
      createdAt: new Date().toISOString(),
      order: 1,
      isActive: true,
      mediaType: 'image'
    },
    {
      id: '2',
      title: 'Professional Cooking Service',
      category: 'Service Showcase',
      imageUrl: 'https://via.placeholder.com/400x300',
      createdAt: new Date().toISOString(),
      order: 2,
      isActive: true,
      mediaType: 'image'
    },
    {
      id: '3',
      title: 'Customer Review Video',
      category: 'Customer Testimonial',
      imageUrl: 'https://via.placeholder.com/400x300',
      createdAt: new Date().toISOString(),
      order: 3,
      isActive: true,
      mediaType: 'video'
    }
  ]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery & Testimonials</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Media</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter media title" />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_testimonial">Customer Testimonial</SelectItem>
                    <SelectItem value="worker_testimonial">Worker Testimonial</SelectItem>
                    <SelectItem value="service_showcase">Service Showcase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="mediaType">Media Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click or drag and drop to upload</p>
                <Input id="media-upload" type="file" className="hidden" />
                <Button variant="outline" onClick={() => document.getElementById('media-upload')?.click()}>
                  Select File
                </Button>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit">Upload</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="customer_testimonial">Customer Testimonials</TabsTrigger>
          <TabsTrigger value="worker_testimonial">Worker Testimonials</TabsTrigger>
          <TabsTrigger value="service_showcase">Service Showcase</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </TabsContent>
        
        <TabsContent value="customer_testimonial" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems
            .filter(item => item.category === 'Customer Testimonial')
            .map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
        </TabsContent>
        
        <TabsContent value="worker_testimonial" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems
            .filter(item => item.category === 'Worker Testimonial')
            .map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
        </TabsContent>
        
        <TabsContent value="service_showcase" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems
            .filter(item => item.category === 'Service Showcase')
            .map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface GalleryCardProps {
  item: GalleryItem;
}

function GalleryCard({ item }: GalleryCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {item.mediaType === 'image' ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Video className="h-12 w-12 text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-white/30 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                  <div className="h-0 w-0 border-t-8 border-t-transparent border-l-16 border-l-black border-b-8 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-md text-xs">
          {item.mediaType === 'image' ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-xs text-gray-500">{item.category}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
