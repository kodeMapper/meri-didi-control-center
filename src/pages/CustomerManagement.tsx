
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer, City } from "@/types";
import { Search, Filter, Download, MoreVertical, Edit, Trash2, Eye, Ban, UserPlus, RefreshCw, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const generateMockCustomers = (): Customer[] => {
  const cities: City[] = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
  const plans = ["Basic", "Premium", "Gold", "Silver", "Free"];
  const statuses: ("Active" | "Inactive")[] = ["Active", "Inactive"];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `cust-${i + 1}`,
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    address: `${Math.floor(Math.random() * 100) + 1}, Street ${Math.floor(Math.random() * 100) + 1}`,
    city: cities[Math.floor(Math.random() * cities.length)],
    joiningDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    totalBookings: Math.floor(Math.random() * 100),
    subscriptionPlan: plans[Math.floor(Math.random() * plans.length)],
    lastActivity: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
  }));
};

export default function CustomerManagement() {
  const [customers] = useState<Customer[]>(generateMockCustomers());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<string>("all");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isBulkActionMenuOpen, setIsBulkActionMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filterCustomers = () => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = selectedCity === "all" || customer.city === selectedCity;
      const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
      const matchesPlan = selectedPlan === "all" || customer.subscriptionPlan === selectedPlan;
      
      return matchesSearch && matchesCity && matchesStatus && matchesPlan;
    });
  };

  const filteredCustomers = filterCustomers();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real application, this would call an API
    console.log(`Deleting customer ${customerToDelete}`);
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };
  
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on customers:`, selectedCustomers);
    setIsBulkActionMenuOpen(false);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting customers as ${format}`);
  };

  const availableCities = Array.from(new Set(customers.map(c => c.city)));
  const availablePlans = Array.from(new Set(customers.map(c => c.subscriptionPlan)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <UserPlus size={16} />
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <CardTitle>All Customers</CardTitle>
              <CardDescription>
                Manage your customer database, view and edit customer information
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-10 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px]">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="p-2">
                    <Label htmlFor="cityFilter" className="text-xs font-medium">City</Label>
                    <Select
                      value={selectedCity}
                      onValueChange={setSelectedCity}
                    >
                      <SelectTrigger id="cityFilter" className="mt-1">
                        <SelectValue placeholder="All Cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {availableCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-2">
                    <Label htmlFor="statusFilter" className="text-xs font-medium">Status</Label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger id="statusFilter" className="mt-1">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-2">
                    <Label htmlFor="planFilter" className="text-xs font-medium">Plan</Label>
                    <Select
                      value={selectedPlan}
                      onValueChange={setSelectedPlan}
                    >
                      <SelectTrigger id="planFilter" className="mt-1">
                        <SelectValue placeholder="All Plans" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        {availablePlans.map(plan => (
                          <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedCity("all");
                        setSelectedStatus("all");
                        setSelectedPlan("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {selectedCustomers.length > 0 && (
                <DropdownMenu open={isBulkActionMenuOpen} onOpenChange={setIsBulkActionMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default">
                      Bulk Actions ({selectedCustomers.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction("email")}>
                      <Mail size={16} className="mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                      <Check size={16} className="mr-2" />
                      Activate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
                      <Ban size={16} className="mr-2" />
                      Deactivate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleBulkAction("delete")}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b px-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all" className="relative">
                  All Customers
                  <Badge variant="secondary" className="ml-2">{customers.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active
                  <Badge variant="secondary" className="ml-2">
                    {customers.filter(c => c.status === "Active").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive
                  <Badge variant="secondary" className="ml-2">
                    {customers.filter(c => c.status === "Inactive").length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                          onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">City</TableHead>
                      <TableHead className="hidden md:table-cell">Plan</TableHead>
                      <TableHead className="hidden md:table-cell">Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                          No customers found matching your filters. Try changing your search criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedCustomers.includes(customer.id)}
                              onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.city}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.subscriptionPlan}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.totalBookings}</TableCell>
                          <TableCell>
                            <Badge variant={customer.status === "Active" ? "success" : "secondary"}>
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.joiningDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye size={16} className="mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit size={16} className="mr-2" />
                                  Edit Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail size={16} className="mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete Customer
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
            </TabsContent>
            
            <TabsContent value="active" className="m-0">
              {/* Same table structure but filtered for active customers */}
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    {/* Same header structure */}
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">City</TableHead>
                      <TableHead className="hidden md:table-cell">Plan</TableHead>
                      <TableHead className="hidden md:table-cell">Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers
                      .filter(customer => customer.status === "Active")
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedCustomers.includes(customer.id)}
                              onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.city}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.subscriptionPlan}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.totalBookings}</TableCell>
                          <TableCell>
                            <Badge variant="success">
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.joiningDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive" className="m-0">
              {/* Same table structure but filtered for inactive customers */}
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    {/* Same header structure */}
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">City</TableHead>
                      <TableHead className="hidden md:table-cell">Plan</TableHead>
                      <TableHead className="hidden md:table-cell">Bookings</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers
                      .filter(customer => customer.status === "Inactive")
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedCustomers.includes(customer.id)}
                              onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.city}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.subscriptionPlan}</TableCell>
                          <TableCell className="hidden md:table-cell">{customer.totalBookings}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {customer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{customer.joiningDate}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {filteredCustomers.length} of {customers.length} customers
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
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
