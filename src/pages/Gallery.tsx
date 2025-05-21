
import { useState, useEffect } from 'react';
import { GalleryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Search, Filter, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
  {
    id: "1",
    title: "Happy Customer with Cleaner",
    description: "Customer John D. with our professional cleaner after a successful service",
    type: "image",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    category: "Customer Testimonial",
    createdAt: "2025-04-20T10:30:00Z",
    featured: true
  },
  {
    id: "2",
    title: "Professional Cooking Service",
    description: "Our chef preparing a gourmet meal at client's home",
    type: "image",
    url: "https://images.unsplash.com/photo-1556911220-bff31c812dba",
    category: "Service Showcase",
    createdAt: "2025-04-15T14:20:00Z",
    featured: false
  },
  {
    id: "3",
    title: "Customer Testimonial Video",
    description: "Hear what our customers have to say about our services",
    type: "video",
    url: "https://example.com/testimonial.mp4",
    thumbnail: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5",
    category: "Customer Testimonial",
    createdAt: "2025-04-10T09:15:00Z",
    featured: true
  }
]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setLoading(false);
  }, []);

  const filterGalleryByCategory = (category: string) => {
  if (category === "all") {
    return galleryItems;
  }
  return galleryItems.filter(item => item.category === category);
};

  const filteredGalleryItems = filterGalleryByCategory(selectedCategory).filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading gallery items...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gallery Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by title or description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-400" />
                <span>{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
              <SelectItem value="Customer Testimonial">Customer Testimonial</SelectItem>
              <SelectItem value="Worker Testimonial">Worker Testimonial</SelectItem>
              <SelectItem value="Service Showcase">Service Showcase</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGalleryItems.map(galleryItem => (
          <Card key={galleryItem.id}>
            <CardContent className="p-4">
              <div>
                {galleryItem.type === "video" ? (
    <video
      src={galleryItem.url}
      controls
      className="w-full h-64 object-cover rounded-lg"
    />
  ) : (
    <img
      src={galleryItem.url}
      alt={galleryItem.title}
      className="w-full h-64 object-cover rounded-lg"
    />
  )}
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">{galleryItem.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{galleryItem.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                    {galleryItem.category}
                  </span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
