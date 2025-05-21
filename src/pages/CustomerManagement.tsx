
import { useState, useEffect } from 'react';
import { Customer, City } from '@/types';
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

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCustomerDetails, setShowCustomerDetails] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<Customer>>({});

  const cities: City[] = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata'];
  const statuses = ['Active', 'Inactive', 'Pending'];

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setCustomers([
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex@example.com',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'Mumbai',
          totalBookings: 5,
          lastBookingDate: '2025-05-10',
          createdAt: '2025-01-15T10:30:00Z',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Priya Singh',
          email: 'priya@example.com',
          phone: '+9876543210',
          address: '456 Park Avenue',
          city: 'Delhi',
          totalBookings: 3,
          lastBookingDate: '2025-04-22',
          createdAt: '2025-02-10T14:20:00Z',
          status: 'Active'
        },
        {
          id: '3',
          name: 'Raj Kumar',
          email: 'raj@example.com',
          phone: '+8765432109',
          address: '789 Tree Lane',
          city: 'Bangalore',
          totalBookings: 0,
          lastBookingDate: '',
          createdAt: '2025-03-05T09:15:00Z',
          status: 'Pending'
        },
        {
          id: '4',
          name: 'Emma Wilson',
          email: 'emma@example.com',
          phone: '+7654321098',
          address: '101 Oak Street',
          city: 'Chennai',
          totalBookings: 1,
          lastBookingDate: '2025-05-01',
          createdAt: '2025-02-28T16:45:00Z',
          status: 'Inactive'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      status: customer.status
    });
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveCustomer = () => {
    if (!selectedCustomer) return;

    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedCustomers = customers.map(customer => {
      if (customer.id === selectedCustomer.id) {
        return {
          ...customer,
          ...editFormData
        } as Customer;
      }
      return customer;
    });

    setCustomers(updatedCustomers);
    setIsEditing(false);
    setSelectedCustomer(null);
    setEditFormData({});
    toast.success("Customer information updated successfully");
  };

  // Apply filters and search
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    
    const matchesCity = selectedCity === 'all' || customer.city === selectedCity;
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading customers...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by name, email or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-400" />
                <span>{selectedCity === 'all' ? 'All Cities' : selectedCity}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-gray-400" />
                <span>{selectedStatus === 'all' ? 'All Statuses' : selectedStatus}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No customers found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          Joined: {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{customer.email}</p>
                        <p className="text-sm">{customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      <div>
                        <p>{customer.totalBookings}</p>
                        {customer.lastBookingDate && (
                          <p className="text-xs text-gray-500">
                            Last: {new Date(customer.lastBookingDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={customer.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCustomerDetails(customer)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Information</p>
                  <p className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">Email:</span>
                    <span>{selectedCustomer.email}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedCustomer.phone}</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1">{selectedCustomer.address}, {selectedCustomer.city}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Information</p>
                  <p className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">Customer ID:</span>
                    <span>{selectedCustomer.id}</span>
                  </p>
                  <p className="flex items-center gap-2 mt-1">
                    <span className="text-gray-600">Joined:</span>
                    <span>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Booking Statistics</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-amber-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500">Total Bookings</p>
                      <p className="text-xl font-semibold">{selectedCustomer.totalBookings}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-md">
                      <p className="text-xs text-gray-500">Last Booking</p>
                      <p className="text-sm font-semibold">
                        {selectedCustomer.lastBookingDate 
                          ? new Date(selectedCustomer.lastBookingDate).toLocaleDateString()
                          : 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2 flex justify-end">
                <Button variant="outline" onClick={() => handleEditCustomer(selectedCustomer)}>
                  <Edit2 size={16} className="mr-2" />
                  Edit Customer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Customer Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name || ''}
                onChange={handleInputChange}
                placeholder="Full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editFormData.email || ''}
                onChange={handleInputChange}
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={editFormData.phone || ''}
                onChange={handleInputChange}
                placeholder="Phone number"
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select 
                value={editFormData.city || ''} 
                onValueChange={(value) => handleSelectChange('city', value)}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={editFormData.address || ''}
                onChange={handleInputChange}
                placeholder="Full address"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={editFormData.status || ''} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = 'bg-gray-100 text-gray-800';
  let icon = null;
  
  switch (status) {
    case 'Active':
      bgColor = 'bg-green-100 text-green-800';
      icon = <CheckCircle size={14} className="mr-1" />;
      break;
    case 'Inactive':
      bgColor = 'bg-gray-100 text-gray-800';
      icon = <XCircle size={14} className="mr-1" />;
      break;
    case 'Pending':
      bgColor = 'bg-amber-100 text-amber-800';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {icon}
      {status}
    </span>
  );
}
